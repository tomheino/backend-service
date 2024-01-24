import express from 'express'
import proxy from 'express-http-proxy'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

const app:express.Express = express()
app.use(cors()) // allow requests from any origin

// proxy config
const backUrl = process.env.BACKURL ?? ""
app.use('*', proxy(backUrl, {
    proxyReqPathResolver : (req:express.Request) => {
        const url = `${backUrl}${req.baseUrl}`
        console.log("proxyReqPathResolver", url)
        return url
    }
}))

const PORT = process.env.PROXYPORT || 5000
app.listen(PORT, () => {
    console.log("Proxy listening port: "+PORT)
})