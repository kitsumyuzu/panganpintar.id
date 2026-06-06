import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '@/controllers/authController'

interface AuthRequest extends Request {
    user?: {
        id: number
        name: string
        email: string
        role: string
    }
}

export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            })
        }

        const token = authHeader.split(' ')[1]
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token not found'
            })
        }

        const decoded = verifyToken(token)
        
        req.user = decoded as AuthRequest['user']
        
        next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        })
    }
}