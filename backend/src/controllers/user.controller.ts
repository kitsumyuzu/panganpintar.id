import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.middleware'

export const getProfile = async (
    req: AuthRequest,
    res: Response
) => {
    return res.json({
        message: 'Profile fetched',
        user: req.user
    })
}