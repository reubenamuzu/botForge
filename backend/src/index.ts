import 'dotenv/config'
import path from 'path'
import express from 'express'
import cors from 'cors'
import { router } from './routes/index'
import { publicRouter } from './routes/public'
import { webhookRouter } from './routes/webhooks'
import { errorHandler } from './middlewares/error'

const app = express()
const PORT = process.env.PORT ?? 4000

// Open CORS: widget.js is embedded on third-party sites; auth is via Bearer tokens not cookies
app.use(cors({ origin: '*' }))
app.use(express.static(path.join(__dirname, '..', 'public')))
app.use('/api/webhooks', express.raw({ type: 'application/json' }), webhookRouter)
app.use(express.json())
app.use('/api', publicRouter)
app.use('/api', router)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
