import express from 'express'
import messageRoutes from './modules/messages/controller'

export const app = express()
app.use(express.json())

app.use('/messages', messageRoutes)
