import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { authenticate } from '@/middleware/auth'
import { getProfile, updateProfile, uploadAvatar } from '@/controllers/profileController'

const router = Router()

const uploadsDir = path.join(process.cwd(), 'public', 'uploads')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
        const extension = path.extname(file.originalname)
        cb(null, `avatar-${uniqueSuffix}${extension}`)
    }
})

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})

router.get('/me', authenticate, getProfile)
router.put('/me', authenticate, updateProfile)
router.post('/avatar', authenticate, upload.single('avatar'), uploadAvatar)

export default router
