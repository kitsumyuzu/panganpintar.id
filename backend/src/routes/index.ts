import { Router } from 'express'
import authRoutes from '@/routes/authRoutes'
import affiliateRoutes from '@/routes/affiliateRoutes'
import profileRoutes from '@/routes/profileRoutes'

const router = Router()

router.use('/auth', authRoutes)
router.use('/affiliate', affiliateRoutes)
router.use('/profile', profileRoutes)

export default router