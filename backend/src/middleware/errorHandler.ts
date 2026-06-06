import { Request, Response, NextFunction } from 'express'

export interface AppError extends Error {
    statusCode?: number
    isOperational?: boolean
}

export const errorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = err.statusCode || 500
    const message = err.isOperational ? err.message : 'Internal Server Error'

    console.error(`🌿 [Nofutechnology] ${err.name}: ${err.message}`)

    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    })
}