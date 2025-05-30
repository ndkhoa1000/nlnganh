import "dotenv/config"
import express from "express";

const app = express()
const PORT = process.env.PORT || 3001
const NODE_ENV = process.env.NODE_ENV ||"development"
const server = app.listen(PORT, () => {
    console.log(`Auth-service running on port ${PORT} in mode ${NODE_ENV}`)
})

server.on('error', (error:any) => {
    console.error('Fail to start server:', error)
    process.exit(1)
})