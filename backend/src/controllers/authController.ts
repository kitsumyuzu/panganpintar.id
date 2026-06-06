import { Request, Response } from 'express'
import { config } from '@/config/index'
import bcrypt from 'bcryptjs'
import jwt, { JwtPayload } from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import pool from '@/config/db'

interface ApiResponse {
    success: boolean
    message?: string
    data?: any
    error?: string
}

interface RegisterRequest extends Request {
    body: {
        namaLengkap: string
        email: string
        password: string
        username?: string
        tanggalLahir?: string
        province?: string
        phone?: string
    }
}

const rateLimitStore = new Map<string, { count: number, firstAttempt: number }>()
const RATE_LIMIT_WINDOW = 15 * 60 * 1000
const MAX_ATTEMPTS = 5

const checkRateLimit = (key: string, maxAttempts: number = MAX_ATTEMPTS): boolean => {
    const now = Date.now()
    const record = rateLimitStore.get(key)
    
    if (!record) {
        rateLimitStore.set(key, { count: 1, firstAttempt: now })
        return true
    }
    
    if (now - record.firstAttempt > RATE_LIMIT_WINDOW) {
        rateLimitStore.set(key, { count: 1, firstAttempt: now })
        return true
    }
    
    if (record.count >= maxAttempts) {
        return false
    }
    
    record.count++
    return true
}

const clearRateLimit = (key: string): void => {
    rateLimitStore.delete(key)
}

const sanitizeEmail = (email: string): string => {
    return email.toLowerCase().trim()
}

const sanitizeName = (name: string): string => {
    return name.replace(/[<>]/g, '').trim().substring(0, 100)
}

const validatePassword = (password: string): { valid: boolean, message: string } => {
    if (password.length < 6) {
        return { valid: false, message: 'Password minimal 6 karakter' }
    }
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: 'Password harus memiliki huruf besar' }
    }
    if (!/[0-9]/.test(password)) {
        return { valid: false, message: 'Password harus memiliki angka' }
    }
    return { valid: true, message: 'OK' }
}

const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

const sendResponse = (res: Response, statusCode: number, data: ApiResponse): Response => {
    return res.status(statusCode).json(data)
}

let transporter: nodemailer.Transporter | null = null

function getTransporter() {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: config.smtp.host,
            port: config.smtp.port,
            secure: config.smtp.port === 465,
            auth: {
                user: config.smtp.user,
                pass: config.smtp.pass
            }
        })
    }
    return transporter
}

function generateToken(payload: object, options?: { expiresIn?: string }): string {
    return jwt.sign(payload, config.jwt.secret as string, {
        expiresIn: options?.expiresIn || '7d'
    } as any)
}

export function verifyToken(token: string): any {
    return jwt.verify(token, config.jwt.secret as string, {
        algorithms: ['HS256']
    } as any)
}

export const register = async (req: RegisterRequest, res: Response) => {
    const connection = await pool.getConnection()
    
    try {
        await connection.beginTransaction()

        const { 
            namaLengkap, 
            email, 
            password, 
            username, 
            tanggalLahir, 
            province, 
            phone 
        } = req.body

        // Validate required fields
        if (!namaLengkap || !email || !password) {
            await connection.rollback()
            return sendResponse(res, 400, {
                success: false,
                error: 'Nama lengkap, email, dan password wajib diisi'
            })
        }

        // Sanitize inputs
        const sanitizedName = sanitizeName(namaLengkap)
        const sanitizedEmail = sanitizeEmail(email)
        
        if (!isValidEmail(sanitizedEmail)) {
            await connection.rollback()
            return sendResponse(res, 400, {
                success: false,
                error: 'Format email tidak valid'
            })
        }
        
        const passwordValidation = validatePassword(password)
        if (!passwordValidation.valid) {
            await connection.rollback()
            return sendResponse(res, 400, {
                success: false,
                error: passwordValidation.message
            })
        }

        // Check if email already exists
        const [existing] = await connection.execute(
            'SELECT _id FROM users WHERE email = ?',
            [sanitizedEmail]
        )

        if ((existing as any[]).length > 0) {
            await connection.rollback()
            return sendResponse(res, 400, {
                success: false,
                error: 'Email sudah terdaftar'
            })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12)
        const roles_id = 3

        // Insert into users table
        const [userResult] = await connection.execute(
            'INSERT INTO users (email, password, username, roles_id) VALUES (?, ?, ?, ?)',
            [sanitizedEmail, hashedPassword, username || null, roles_id]
        )

        const userId = (userResult as any).insertId

        // Insert into customers table
        await connection.execute(
            `INSERT INTO customers (user_id, nama_lengkap, tanggal_lahir, province, phone_number) 
             VALUES (?, ?, ?, ?, ?)`,
            [userId, sanitizedName, tanggalLahir || null, province || null, phone || null]
        )

        await connection.commit()

        // Generate verification token
        const verificationToken = generateToken(
            { email: sanitizedEmail, type: 'verification' },
            { expiresIn: '1h' }
        )

        // Send verification email
        try {
            const transporterInstance = getTransporter()
            await transporterInstance.sendMail({
                from: `"PanganPintar" <${config.smtp.user}>`,
                to: sanitizedEmail,
                subject: 'Verifikasi Email - PanganPintar',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1>Verifikasi Email</h1>
                        <p>Halo ${sanitizedName},</p>
                        <p>Klik tombol di bawah untuk verifikasi email Anda:</p>
                        <a href="${config.app.frontendUrl}/verify/${verificationToken}" 
                           style="background: #259d84; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
                            Verifikasi Email
                        </a>
                    </div>
                `
            })
        } catch (emailError) {
            console.log('Email sending failed:', emailError)
        }

        return sendResponse(res, 201, {
            success: true,
            message: 'Pendaftaran berhasil! Silakan verifikasi email Anda.',
            data: { userId }
        })

    } catch (error: any) {
        await connection.rollback()
        console.error('Registration error:', error)
        return sendResponse(res, 500, {
            success: false,
            error: 'Terjadi kesalahan saat pendaftaran'
        })
    } finally {
        connection.release()
    }
}

export const login = async (req: Request, res: Response) => {
    const connection = await pool.getConnection()
    
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return sendResponse(res, 400, {
                success: false,
                error: 'Email dan password wajib diisi'
            })
        }

        // Rate limiting
        const rateKey = `login:${email.toLowerCase()}`
        if (!checkRateLimit(rateKey, 5)) {
            return sendResponse(res, 429, {
                success: false,
                error: 'Terlalu banyak percobaan login. Silakan coba lagi nanti.'
            })
        }

        const sanitizedEmail = sanitizeEmail(email)

        // Get user with customer data
        const [users] = await connection.execute(
            `SELECT u._id, u.email, u.password, u.username, u.roles_id, u.is_active, u.email_verified,
                    c.nama_lengkap, c.phone_number, c.avatar, c.province
             FROM users u 
             LEFT JOIN customers c ON u._id = c.user_id 
             WHERE u.email = ?`,
            [sanitizedEmail]
        )

        const userResult = users as any[]
        
        if (userResult.length === 0) {
            return sendResponse(res, 401, {
                success: false,
                error: 'Email atau password salah'
            })
        }

        const user = userResult[0]

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return sendResponse(res, 401, {
                success: false,
                error: 'Email atau password salah'
            })
        }

        // Check if account is active
        if (!user.is_active) {
            return sendResponse(res, 403, {
                success: false,
                error: 'Akun Anda telah dinonaktifkan'
            })
        }

        clearRateLimit(rateKey)

        // Generate token
        const token = generateToken({
            id: user._id,
            email: user.email,
            roles_id: user.roles_id
        })

        // Log authentication
        try {
            await connection.execute(
                'INSERT INTO user_authentications (user_id, ip_address, user_agent) VALUES (?, ?, ?)',
                [user._id, req.ip || 'unknown', req.headers['user-agent'] || 'unknown']
            )
        } catch (logError) {
            console.log('Failed to log authentication:', logError)
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
        })

    } catch (error: any) {
        console.error('Login error:', error)
        return sendResponse(res, 500, {
            success: false,
            error: 'Terjadi kesalahan saat login'
        })
    } finally {
        connection.release()
    }
}

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

export const forgotPassword = async (req: Request, res: Response) => {
    return sendResponse(res, 200, {
        success: true,
        message: 'Jika email terdaftar, link reset password akan dikirim'
    })
}

export const resetPassword = async (req: Request, res: Response) => {
    const connection = await pool.getConnection()
    
    try {
        const { token, password } = req.body

        if (!token || !password) {
            return sendResponse(res, 400, {
                success: false,
                error: 'Token dan password wajib diisi'
            })
        }

        const passwordValidation = validatePassword(password)
        if (!passwordValidation.valid) {
            return sendResponse(res, 400, {
                success: false,
                error: passwordValidation.message
            })
        }

        // Verify token
        let decoded: JwtPayload
        try {
            decoded = jwt.verify(token, config.jwt.secret as string, {
                algorithms: ['HS256']
            }) as JwtPayload
        } catch (jwtError) {
            return sendResponse(res, 400, {
                success: false,
                error: 'Token tidak valid atau sudah kedaluwarsa'
            })
        }
        
        if (!decoded || decoded.type !== 'reset') {
            return sendResponse(res, 400, {
                success: false,
                error: 'Token tidak valid atau sudah kedaluwarsa'
            })
        }

        const userId = decoded.id as number
        const hashedPassword = await bcrypt.hash(password, 12)

        const [result] = await connection.execute(
            'UPDATE users SET password = ? WHERE _id = ? AND is_active = TRUE',
            [hashedPassword, userId]
        )

        const updateResult = result as any
        if (updateResult.affectedRows === 0) {
            return sendResponse(res, 400, {
                success: false,
                error: 'User tidak ditemukan atau akun dinonaktifkan'
            })
        }

        return sendResponse(res, 200, {
            success: true,
            message: 'Password berhasil direset.'
        })

    } catch (error: any) {
        console.error('Reset password error:', error)
        return sendResponse(res, 500, {
            success: false,
            error: 'Terjadi kesalahan'
        })
    } finally {
        connection.release()
    }
}

export const verifyEmail = async (req: Request, res: Response) => {
    const connection = await pool.getConnection()
    
    try {
        const { token } = req.body

        if (!token) {
            return sendResponse(res, 400, {
                success: false,
                error: 'Token wajib diisi'
            })
        }

        // Verify token
        let decoded: JwtPayload
        try {
            decoded = jwt.verify(token, config.jwt.secret as string, {
                algorithms: ['HS256']
            }) as JwtPayload
        } catch (jwtError) {
            return sendResponse(res, 400, {
                success: false,
                error: 'Token tidak valid atau sudah kedaluwarsa'
            })
        }
        
        if (!decoded || decoded.type !== 'verification') {
            return sendResponse(res, 400, {
                success: false,
                error: 'Token tidak valid atau sudah kedaluwarsa'
            })
        }

        const email = decoded.email as string

        const [result] = await connection.execute(
            'UPDATE users SET email_verified = TRUE, updated_at = NOW() WHERE email = ? AND email_verified = FALSE',
            [email]
        )

        const updateResult = result as any
        if (updateResult.affectedRows === 0) {
            return sendResponse(res, 400, {
                success: false,
                error: 'User tidak ditemukan atau sudah terverifikasi'
            })
        }

        return sendResponse(res, 200, {
            success: true,
            message: 'Email berhasil diverifikasi'
        })

    } catch (error: any) {
        console.error('Verify email error:', error)
        return sendResponse(res, 500, {
            success: false,
            error: 'Terjadi kesalahan'
        })
    } finally {
        connection.release()
    }
}

export const getMe = async (req: Request, res: Response) => {
    const connection = await pool.getConnection()
    
    try {
        const userId = (req as any).user?.id
        
        if (!userId) {
            return sendResponse(res, 401, {
                success: false,
                error: 'Unauthorized'
            })
        }

        const [users] = await connection.execute(
            `SELECT u._id, u.email, u.username, u.roles_id, u.email_verified, u.created_at,
                    c.nama_lengkap, c.tanggal_lahir, c.province, c.phone_number, c.avatar, 
                    c.bio, c.address, c.kota, c.kode_pos
             FROM users u 
             LEFT JOIN customers c ON u._id = c.user_id 
             WHERE u._id = ?`,
            [userId]
        )

        if ((users as any[]).length === 0) {
            return sendResponse(res, 404, {
                success: false,
                error: 'User tidak ditemukan'
            })
        }

        const user = users[0]

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
        })
    } catch (error: any) {
        console.error('Get me error:', error)
        return sendResponse(res, 500, {
            success: false,
            error: 'Terjadi kesalahan'
        })
    } finally {
        connection.release()
    }
}