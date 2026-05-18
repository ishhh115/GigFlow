import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes'
import leadRoutes from './routes/leadRoutes'

dotenv.config()

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/leads', leadRoutes)
    
app.get('/', (req, res) => {
  res.json({ message: 'Smart Leads API is running 🚀' })
})

const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI || ''

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected ✅')
    app.listen(PORT, () => {
      console.log(`Server running on port 5000 🚀`)
    })
  })
  .catch((err) => {
    console.log('MongoDB connection failed ❌', err)
  })