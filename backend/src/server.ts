import 'tsconfig-paths/register'

import { config } from '@/config/index'
import app from '@/app'

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`
    ╔═══════════════════════════════════════════════════╗
    ║     🚀 Server running on port ${config.app.port}                  ║
    ║     📚 API Documentation: http://localhost:${config.app.port}/api-docs  ║
    ╚═══════════════════════════════════════════════════╝
    `)
});