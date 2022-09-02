import { Router } from 'express'
import cardsRouter from './cardsRouter'

const route = Router()

route.use(cardsRouter)

export default route
