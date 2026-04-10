import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { router } from './routes/index'
import { errorHandler } from './middlewares/error'

const app = express()
const PORT = process.env.PORT ?? 4000

app.use(cors({ origin: process.env.FRONTEND_URL }))
app.use(express.json())
app.use('/api', router)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
