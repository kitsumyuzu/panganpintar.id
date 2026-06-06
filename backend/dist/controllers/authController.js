"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.verifyEmail = exports.resetPassword = exports.forgotPassword = exports.login = exports.register = void 0;
exports.verifyToken = verifyToken;
const index_1 = require("@/config/index");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const db_1 = __importDefault(require("@/config/db"));
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const checkRateLimit = (key, maxAttempts = MAX_ATTEMPTS) => {
    const now = Date.now();
    const record = rateLimitStore.get(key);
    if (!record) {
        rateLimitStore.set(key, { count: 1, firstAttempt: now });
        return true;
    }
    if (now - record.firstAttempt > RATE_LIMIT_WINDOW) {
        rateLimitStore.set(key, { count: 1, firstAttempt: now });
        return true;
    }
    if (record.count >= maxAttempts) {
        return false;
    }
    record.count++;
    return true;
};
const clearRateLimit = (key) => {
    rateLimitStore.delete(key);
};
const sanitizeEmail = (email) => {
    return email.toLowerCase().trim();
};
const sanitizeName = (name) => {
    return name.replace(/[<>]/g, '').trim().substring(0, 100);
};
const validatePassword = (password) => {
    if (password.length < 6) {
        return { valid: false, message: 'Password minimal 6 karakter' };
    }
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: 'Password harus memiliki huruf besar' };
    }
    if (!/[0-9]/.test(password)) {
        return { valid: false, message: 'Password harus memiliki angka' };
    }
    return { valid: true, message: 'OK' };
};
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
const sendResponse = (res, statusCode, data) => {
    return res.status(statusCode).json(data);
};
let transporter = null;
function getTransporter() {
    if (!transporter) {
        transporter = nodemailer_1.default.createTransport({
            host: index_1.config.smtp.host,
            port: index_1.config.smtp.port,
            secure: index_1.config.smtp.port === 465,
            auth: {
                user: index_1.config.smtp.user,
                pass: index_1.config.smtp.pass
            }
        });
    }
    return transporter;
}
function generateToken(payload, options) {
    return jsonwebtoken_1.default.sign(payload, index_1.config.jwt.secret, {
        expiresIn: options?.expiresIn || '7d'
    });
}
function verifyToken(token) {
    return jsonwebtoken_1.default.verify(token, index_1.config.jwt.secret, {
        algorithms: ['HS256']
    });
}
const register = async (req, res) => {
    const connection = await db_1.default.getConnection();
    try {
        await connection.beginTransaction();
        const { namaLengkap, email, password, username, tanggalLahir, province, phone } = req.body;
        // Validate required fields
        if (!namaLengkap || !email || !password) {
            await connection.rollback();
            return sendResponse(res, 400, {
                success: false,
                error: 'Nama lengkap, email, dan password wajib diisi'
            });
        }
        // Sanitize inputs
        const sanitizedName = sanitizeName(namaLengkap);
        const sanitizedEmail = sanitizeEmail(email);
        if (!isValidEmail(sanitizedEmail)) {
            await connection.rollback();
            return sendResponse(res, 400, {
                success: false,
                error: 'Format email tidak valid'
            });
        }
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            await connection.rollback();
            return sendResponse(res, 400, {
                success: false,
                error: passwordValidation.message
            });
        }
        // Check if email already exists
        const [existing] = await connection.execute('SELECT _id FROM users WHERE email = ?', [sanitizedEmail]);
        if (existing.length > 0) {
            await connection.rollback();
            return sendResponse(res, 400, {
                success: false,
                error: 'Email sudah terdaftar'
            });
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        const roles_id = 3;
        // Insert into users table
        const [userResult] = await connection.execute('INSERT INTO users (email, password, username, roles_id) VALUES (?, ?, ?, ?)', [sanitizedEmail, hashedPassword, username || null, roles_id]);
        const userId = userResult.insertId;
        // Insert into customers table
        await connection.execute(`INSERT INTO customers (user_id, nama_lengkap, tanggal_lahir, province, phone_number) 
             VALUES (?, ?, ?, ?, ?)`, [userId, sanitizedName, tanggalLahir || null, province || null, phone || null]);
        await connection.commit();
        // Generate verification token
        const verificationToken = generateToken({ email: sanitizedEmail, type: 'verification' }, { expiresIn: '1h' });
        // Send verification email
        try {
            const transporterInstance = getTransporter();
            await transporterInstance.sendMail({
                from: `"PanganPintar" <${index_1.config.smtp.user}>`,
                to: sanitizedEmail,
                subject: 'Verifikasi Email - PanganPintar',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1>Verifikasi Email</h1>
                        <p>Halo ${sanitizedName},</p>
                        <p>Klik tombol di bawah untuk verifikasi email Anda:</p>
                        <a href="${index_1.config.app.frontendUrl}/verify/${verificationToken}" 
                           style="background: #259d84; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
                            Verifikasi Email
                        </a>
                    </div>
                `
            });
        }
        catch (emailError) {
            console.log('Email sending failed:', emailError);
        }
        return sendResponse(res, 201, {
            success: true,
            message: 'Pendaftaran berhasil! Silakan verifikasi email Anda.',
            data: { userId }
        });
    }
    catch (error) {
        await connection.rollback();
        console.error('Registration error:', error);
        return sendResponse(res, 500, {
            success: false,
            error: 'Terjadi kesalahan saat pendaftaran'
        });
    }
    finally {
        connection.release();
    }
};
exports.register = register;
const login = async (req, res) => {
    const connection = await db_1.default.getConnection();
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return sendResponse(res, 400, {
                success: false,
                error: 'Email dan password wajib diisi'
            });
        }
        // Rate limiting
        const rateKey = `login:${email.toLowerCase()}`;
        if (!checkRateLimit(rateKey, 5)) {
            return sendResponse(res, 429, {
                success: false,
                error: 'Terlalu banyak percobaan login. Silakan coba lagi nanti.'
            });
        }
        const sanitizedEmail = sanitizeEmail(email);
        // Get user with customer data
        const [users] = await connection.execute(`SELECT u._id, u.email, u.password, u.username, u.roles_id, u.is_active, u.email_verified,
                    c.nama_lengkap, c.phone_number, c.avatar, c.province
             FROM users u 
             LEFT JOIN customers c ON u._id = c.user_id 
             WHERE u.email = ?`, [sanitizedEmail]);
        const userResult = users;
        if (userResult.length === 0) {
            return sendResponse(res, 401, {
                success: false,
                error: 'Email atau password salah'
            });
        }
        const user = userResult[0];
        // Verify password
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return sendResponse(res, 401, {
                success: false,
                error: 'Email atau password salah'
            });
        }
        // Check if account is active
        if (!user.is_active) {
            return sendResponse(res, 403, {
                success: false,
                error: 'Akun Anda telah dinonaktifkan'
            });
        }
        clearRateLimit(rateKey);
        // Generate token
        const token = generateToken({
            id: user._id,
            email: user.email,
            roles_id: user.roles_id
        });
        // Log authentication
        try {
            await connection.execute('INSERT INTO user_authentications (user_id, ip_address, user_agent) VALUES (?, ?, ?)', [user._id, req.ip || 'unknown', req.headers['user-agent'] || 'unknown']);
        }
        catch (logError) {
            console.log('Failed to log authentication:', logError);
        }
        return sendResponse(res, 200, {
            success: true,
            message: 'Login berhasil',
            data: {
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    username: user.username,
                    namaLengkap: user.nama_lengkap,
                    phone: user.phone_number,
                    avatar: user.avatar,
                    province: user.province,
                    role: user.roles_id
                }
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        return sendResponse(res, 500, {
            success: false,
            error: 'Terjadi kesalahan saat login'
        });
    }
    finally {
        connection.release();
    }
};
exports.login = login;
// export const forgotPassword = async (req: Request, res: Response) => {
//     const connection = await pool.getConnection()
//     try {
//         const { email } = req.body
//         if (!email) {
//             return sendResponse(res, 400, {
//                 success: false,
//                 error: 'Email is required'
//             })
//         }
//         const sanitizedEmail = sanitizeEmail(email)
//         // Rate limiting by IP
//         const rateKey = `forgot:${req.ip}`
//         if (!checkRateLimit(rateKey, 3)) {
//             return sendResponse(res, 429, {
//                 success: false,
//                 error: 'Too many requests. Please try again later.'
//             })
//         }
//         // Get user
//         const [users] = await connection.execute(
//             'SELECT id, name, email FROM users WHERE email = ?',
//             [sanitizedEmail]
//         )
//         // Always return success (prevent email enumeration)
//         if ((users as any[]).length === 0) {
//             return sendResponse(res, 200, {
//                 success: true,
//                 message: 'If email exists, reset link will be sent'
//             })
//         }
//         const user = (users as User[])[0]
//         const resetToken = generateToken(
//             { id: user.id, type: 'reset' },
//             { expiresIn: '15m' } // 15 minutes expiry
//         )
//         try {
//             const transporterInstance = getTransporter()
//             await transporterInstance.sendMail({
//                 from: `"PanganPintar" <${config.smtp.user}>`,
//                 to: sanitizedEmail,
//                 subject: 'Reset Password - PanganPintar',
//                 html: `
//                     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//                         <h1>Reset Password</h1>
//                         <p>Halo ${user.name},</p>
//                         <p>Klik tombol di bawah untuk reset password Anda:</p>
//                         <a href="${config.app.frontendUrl}/reset-password/${resetToken}" 
//                            style="background: #259d84; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
//                             Reset Password
//                         </a>
//                         <p style="margin-top: 20px; color: #666; font-size: 12px;">
//                             Link ini akan kedaluwarsa dalam 15 menit.<br>
//                             Jika Anda tidak meminta reset password, abaikan email ini.
//                         </p>
//                     </div>
//                 `
//             })
//         } catch (emailError) {
//             console.log('Email sending failed:', emailError)
//         }
//         return sendResponse(res, 200, {
//             success: true,
//             message: 'If email exists, reset link will be sent'
//         })
//     } catch (error: any) {
//         console.error('Forgot password error:', error)
//         return sendResponse(res, 500, {
//             success: false,
//             error: 'Internal server error'
//         })
//     } finally {
//         connection.release()
//     }
// }
// Reset Password
const forgotPassword = async (req, res) => {
    return sendResponse(res, 200, {
        success: true,
        message: 'Jika email terdaftar, link reset password akan dikirim'
    });
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    const connection = await db_1.default.getConnection();
    try {
        const { token, password } = req.body;
        if (!token || !password) {
            return sendResponse(res, 400, {
                success: false,
                error: 'Token dan password wajib diisi'
            });
        }
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            return sendResponse(res, 400, {
                success: false,
                error: passwordValidation.message
            });
        }
        // Verify token
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, index_1.config.jwt.secret, {
                algorithms: ['HS256']
            });
        }
        catch (jwtError) {
            return sendResponse(res, 400, {
                success: false,
                error: 'Token tidak valid atau sudah kedaluwarsa'
            });
        }
        if (!decoded || decoded.type !== 'reset') {
            return sendResponse(res, 400, {
                success: false,
                error: 'Token tidak valid atau sudah kedaluwarsa'
            });
        }
        const userId = decoded.id;
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        const [result] = await connection.execute('UPDATE users SET password = ? WHERE _id = ? AND is_active = TRUE', [hashedPassword, userId]);
        const updateResult = result;
        if (updateResult.affectedRows === 0) {
            return sendResponse(res, 400, {
                success: false,
                error: 'User tidak ditemukan atau akun dinonaktifkan'
            });
        }
        return sendResponse(res, 200, {
            success: true,
            message: 'Password berhasil direset.'
        });
    }
    catch (error) {
        console.error('Reset password error:', error);
        return sendResponse(res, 500, {
            success: false,
            error: 'Terjadi kesalahan'
        });
    }
    finally {
        connection.release();
    }
};
exports.resetPassword = resetPassword;
const verifyEmail = async (req, res) => {
    const connection = await db_1.default.getConnection();
    try {
        const { token } = req.body;
        if (!token) {
            return sendResponse(res, 400, {
                success: false,
                error: 'Token wajib diisi'
            });
        }
        // Verify token
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, index_1.config.jwt.secret, {
                algorithms: ['HS256']
            });
        }
        catch (jwtError) {
            return sendResponse(res, 400, {
                success: false,
                error: 'Token tidak valid atau sudah kedaluwarsa'
            });
        }
        if (!decoded || decoded.type !== 'verification') {
            return sendResponse(res, 400, {
                success: false,
                error: 'Token tidak valid atau sudah kedaluwarsa'
            });
        }
        const email = decoded.email;
        const [result] = await connection.execute('UPDATE users SET email_verified = TRUE, updated_at = NOW() WHERE email = ? AND email_verified = FALSE', [email]);
        const updateResult = result;
        if (updateResult.affectedRows === 0) {
            return sendResponse(res, 400, {
                success: false,
                error: 'User tidak ditemukan atau sudah terverifikasi'
            });
        }
        return sendResponse(res, 200, {
            success: true,
            message: 'Email berhasil diverifikasi'
        });
    }
    catch (error) {
        console.error('Verify email error:', error);
        return sendResponse(res, 500, {
            success: false,
            error: 'Terjadi kesalahan'
        });
    }
    finally {
        connection.release();
    }
};
exports.verifyEmail = verifyEmail;
const getMe = async (req, res) => {
    const connection = await db_1.default.getConnection();
    try {
        const userId = req.user?.id;
        if (!userId) {
            return sendResponse(res, 401, {
                success: false,
                error: 'Unauthorized'
            });
        }
        const [users] = await connection.execute(`SELECT u._id, u.email, u.username, u.roles_id, u.email_verified, u.created_at,
                    c.nama_lengkap, c.tanggal_lahir, c.province, c.phone_number, c.avatar, 
                    c.bio, c.address, c.kota, c.kode_pos
             FROM users u 
             LEFT JOIN customers c ON u._id = c.user_id 
             WHERE u._id = ?`, [userId]);
        if (users.length === 0) {
            return sendResponse(res, 404, {
                success: false,
                error: 'User tidak ditemukan'
            });
        }
        const user = users[0];
        return sendResponse(res, 200, {
            success: true,
            data: {
                id: user._id,
                email: user.email,
                username: user.username,
                role: user.roles_id,
                emailVerified: user.email_verified,
                namaLengkap: user.nama_lengkap,
                tanggalLahir: user.tanggal_lahir,
                createdAt: user.created_at,
                province: user.province,
                phone: user.phone_number,
                avatar: user.avatar,
                bio: user.bio,
                address: user.address,
                kota: user.kota,
                kodePos: user.kode_pos
            }
        });
    }
    catch (error) {
        console.error('Get me error:', error);
        return sendResponse(res, 500, {
            success: false,
            error: 'Terjadi kesalahan'
        });
    }
    finally {
        connection.release();
    }
};
exports.getMe = getMe;
