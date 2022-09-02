import express, { json } from 'express'
import 'express-async-errors'
import cors from 'cors'
import dotenv from 'dotenv'
import router from './routes/index'
import { errorHandling } from './middlewares/errorHandling'

const app = express()
app.use(cors())
app.use(json())
dotenv.config()

app.use(router)
app.use(errorHandling)

const PORT: number = Number(process.env.PORT)

app.listen(PORT)
