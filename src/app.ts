import express, { json } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import router from './routes/index.js'

const app = express()
app.use(cors())
app.use(json())
dotenv.config()

app.use(router)

app.listen(process.env.PORT)
