import express from 'express'
import cors from "cors"
import { connectDB } from './config/database'
const app = express()

// Middleware setup
app.use(cors())
app.use(express.json())
connectDB()
// Routes setup
app.get('/health', (req,res) => {
    res.status(200).json("Auth-service is running.")
})

// Export app
export default app