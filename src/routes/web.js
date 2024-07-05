import express from 'express'
import { getHomePage, getWebhook, postWebhook } from '../controllers/chatbotController.js'

let router = express.Router()

let initWebRoutes = (app) => {
    router.get("/", getHomePage)

    

    router.get("/webhook", getWebhook)
    router.post("/webhook", postWebhook)
    return app.use("/", router)
}

export default initWebRoutes