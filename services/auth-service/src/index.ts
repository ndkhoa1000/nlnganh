import app from "./app"
import config  from "./config/app.config"
const server = app.listen(config.PORT, () => {
    console.log(`Auth-service running on port ${config.PORT} in ${config.NODE_ENV} mode`)
})

server.on('error', (error:any) => {
    console.error('Fail to start server:', error)
    process.exit(1)
})