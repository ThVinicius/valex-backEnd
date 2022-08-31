import express, { json } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

const app = express()
app.use(cors())
app.use(json())
dotenv.config()

app.listen(process.env.PORT)
