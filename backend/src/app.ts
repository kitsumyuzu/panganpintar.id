import { errorHandler } from '@/middleware/errorHandler'
import { swaggerSpec } from '@/config/swagger'
import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import swaggerUi from 'swagger-ui-express'
import routes from '@/routes'

const app = express()

const uploadsDir = path.join(__dirname, '../../public/uploads')
fs.mkdirSync(uploadsDir, { recursive: true })

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.get('/api-docs.json', (req: express.Request, res: express.Response) => {
    res.json(swaggerSpec)
})

// Health Check Endpoint
/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Server health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy
 */
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        status: 'ok',
        message: 'Server is running',
        timestamp: new Date().toISOString()
    })
})

app.use('/api', routes)

app.use(errorHandler)

export default app