import { Router } from 'express'
import cardsRouter from './cardsRouter.js'

const route = Router()

route.use(cardsRouter)

export default route
