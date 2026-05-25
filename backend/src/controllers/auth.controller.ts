import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { findUserByEmail } from '../services/auth.service'

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        const user = await findUserByEmail(email)

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        const validPassword = await bcrypt.compare(
            password,
            user.password
        )

        if (!validPassword) {
            return res.status(401).json({
                message: 'Invalid password'
            })
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRET as string,
            {
                expiresIn: '1d'
            }
        )

        return res.json({
            message: 'Login success',
            token
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Server error'
        })
    }
}