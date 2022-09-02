import { Router } from 'express'
import cardsRouter from './cardsRouter'
import reChargesRouter from './reChargesRouter'

const route = Router()

route.use(cardsRouter)
route.use(reChargesRouter)

export default route
