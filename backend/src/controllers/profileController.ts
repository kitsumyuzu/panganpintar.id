import { Request, Response } from 'express'
import pool from '@/config/db'
import path from 'path'
import fs from 'fs'

interface AuthRequest extends Request {
    user?: {
        id: number
        email?: string
        roles_id?: number
    }
}

interface ApiResponse {
    success: boolean
    message?: string
    data?: any
    error?: string
}

const sendResponse = (res: Response, statusCode: number, data: ApiResponse): Response => {
    return res.status(statusCode).json(data)
}

const buildProfile = (user: any) => ({
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
})

const getProfileData = async (connection: any, userId: number) => {
    const [rows] = await connection.execute(
        `SELECT u._id, u.email, u.username, u.roles_id, u.email_verified, u.created_at,
                c.nama_lengkap, c.tanggal_lahir, c.province, c.phone_number, c.avatar,
                c.bio, c.address, c.kota, c.kode_pos
         FROM users u
         LEFT JOIN customers c ON u._id = c.user_id
         WHERE u._id = ?`,
        [userId]
    )

    const result = (rows as any[])[0]
    return result ? buildProfile(result) : null
}

export const getProfile = async (req: AuthRequest, res: Response) => {
    const connection = await pool.getConnection()

    try {
        const userId = req.user?.id
        if (!userId) {
            return sendResponse(res, 401, {
                success: false,
                error: 'Unauthorized'
            })
        }

        const profile = await getProfileData(connection, userId)
        if (!profile) {
            return sendResponse(res, 404, {
                success: false,
                error: 'Profile not found'
            })
        }

        return sendResponse(res, 200, {
            success: true,
            data: profile
        })
    } catch (error) {
        console.error('Get profile error:', error)
        return sendResponse(res, 500, {
            success: false,
            error: 'Failed to fetch profile'
        })
    } finally {
        connection.release()
    }
}

export const updateProfile = async (req: AuthRequest, res: Response) => {
    const connection = await pool.getConnection()

    try {
        const userId = req.user?.id
        if (!userId) {
            return sendResponse(res, 401, {
                success: false,
                error: 'Unauthorized'
            })
        }

        const {
            username,
            namaLengkap,
            tanggalLahir,
            province,
            kota,
            kodePos,
            phone,
            bio,
            address
        } = req.body

        await connection.beginTransaction()

        if (username !== undefined) {
            await connection.execute(
                'UPDATE users SET username = ? WHERE _id = ?',
                [username || null, userId]
            )
        }

        const [existingRows] = await connection.execute(
            'SELECT * FROM customers WHERE user_id = ?',
            [userId]
        )

        const existing = (existingRows as any[])[0] || {}

        const finalNamaLengkap = namaLengkap ?? existing.nama_lengkap ?? null
        const finalTanggalLahir = tanggalLahir ?? existing.tanggal_lahir ?? null
        const finalProvince = province ?? existing.province ?? null
        const finalKota = kota ?? existing.kota ?? null
        const finalKodePos = kodePos ?? existing.kode_pos ?? null
        const finalPhone = phone ?? existing.phone_number ?? null
        const finalBio = bio ?? existing.bio ?? null
        const finalAddress = address ?? existing.address ?? null

        await connection.execute(
            `INSERT INTO customers (
                user_id, nama_lengkap, tanggal_lahir, province, kota, kode_pos, phone_number, bio, address
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                nama_lengkap = VALUES(nama_lengkap),
                tanggal_lahir = VALUES(tanggal_lahir),
                province = VALUES(province),
                kota = VALUES(kota),
                kode_pos = VALUES(kode_pos),
                phone_number = VALUES(phone_number),
                bio = VALUES(bio),
                address = VALUES(address)`,
            [
                userId,
                finalNamaLengkap,
                finalTanggalLahir,
                finalProvince,
                finalKota,
                finalKodePos,
                finalPhone,
                finalBio,
                finalAddress
            ]
        )

        await connection.commit()

        const profile = await getProfileData(connection, userId)
        return sendResponse(res, 200, {
            success: true,
            message: 'Profile updated successfully',
            data: profile
        })
    } catch (error) {
        await connection.rollback()
        console.error('Update profile error:', error)
        return sendResponse(res, 500, {
            success: false,
            error: 'Failed to update profile'
        })
    } finally {
        connection.release()
    }
}

export const uploadAvatar = async (req: AuthRequest, res: Response) => {
    const connection = await pool.getConnection()

    try {
        const userId = req.user?.id
        if (!userId) {
            if (req.file) {
                fs.unlinkSync(req.file.path)
            }
            return sendResponse(res, 401, {
                success: false,
                error: 'Unauthorized'
            })
        }

        if (!req.file) {
            return sendResponse(res, 400, {
                success: false,
                error: 'No file uploaded'
            })
        }

        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        if (!allowedMimes.includes(req.file.mimetype)) {
            fs.unlinkSync(req.file.path)
            return sendResponse(res, 400, {
                success: false,
                error: 'Only image files are allowed'
            })
        }

        if (req.file.size > 5 * 1024 * 1024) {
            fs.unlinkSync(req.file.path)
            return sendResponse(res, 400, {
                success: false,
                error: 'File size must be less than 5MB'
            })
        }

        const [existingRows] = await connection.execute(
            'SELECT avatar FROM customers WHERE user_id = ?',
            [userId]
        )
        const existingAvatar = (existingRows as any[])[0]?.avatar

        const avatarPath = `/uploads/${path.basename(req.file.path)}`

        await connection.execute(
            'UPDATE customers SET avatar = ? WHERE user_id = ?',
            [avatarPath, userId]
        )

        if (existingAvatar) {
            const oldFile = path.join(process.cwd(), 'public', existingAvatar)
            if (fs.existsSync(oldFile)) {
                fs.unlinkSync(oldFile)
            }
        }

        const profile = await getProfileData(connection, userId)

        return sendResponse(res, 200, {
            success: true,
            message: 'Avatar uploaded successfully',
            data: {
                avatar: avatarPath,
                profile
            }
        })
    } catch (error) {
        console.error('Upload avatar error:', error)
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path)
        }
        return sendResponse(res, 500, {
            success: false,
            error: 'Failed to upload avatar'
        })
    } finally {
        connection.release()
    }
}
