import pool from '../config/db'

export const findUserByEmail = async (email: string) => {
    const [rows] = await pool.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
    )

    return (rows as any[])[0]
}