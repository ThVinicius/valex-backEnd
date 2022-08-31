import express, { json } from 'express'
import 'express-async-errors'
import cors from 'cors'
import dotenv from 'dotenv'
import router from './routes/index.js'
import { errorHandling } from './middlewares/errorHandling.js'

const app = express()
app.use(cors())
app.use(json())
dotenv.config()

app.use(router)
app.use(errorHandling)

app.listen(process.env.PORT)
