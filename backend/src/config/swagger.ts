import swaggerJsdoc from 'swagger-jsdoc'

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Pangan Pintar Backend API',
            description: 'Backend API Pangan Pintar v0.1',
            contact: {
                name: 'Developer',
                email: 'developer@panganpintar.id'
            }
        },
        security: [{ bearerAuth: [] }]
    },
    apis: ['./src/routes/*.ts', './src/app.ts']
}

export const swaggerSpec = swaggerJsdoc(options)