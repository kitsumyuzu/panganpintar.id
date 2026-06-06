import { config } from '@/config/index'
import mysql from 'mysql2/promise'
import fs from 'fs'
import path from 'path'

const pool = mysql.createPool({
    host: config.db.host || 'localhost',
    user: config.db.user || 'root',
    password: config.db.password || '',
    database: config.db.database || 'panganpintar',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true
});

const verifyConnection = async () => {
    let connection;

    try {
        connection = await pool.getConnection()

        const sqlFile = path.join(__dirname, '../schema.sql')
        const sql = fs.readFileSync(sqlFile, 'utf-8')

        const statements = sql.split(';').filter(stmt => stmt.trim())
        
        for (const statement of statements) {
            if (statement.trim()) {
                await connection.query(statement)
            }
        }

        connection.release(); // Close connection
        console.log('🌿 [Database] Database connected & tables initialized successfully')
    } catch (e: any) {
        console.error('🌿 [Nofutechnology] Database filed to connect');
        console.error(e.message)
    }
}

verifyConnection()
export default pool;