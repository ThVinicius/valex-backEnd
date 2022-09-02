import { Router } from 'express'
import cardsRouter from './cardsRouter'
import reChargesRouter from './reChargesRouter'
import paymentsRouter from './paymentsRouter'

const route = Router()

route.use(cardsRouter)
route.use(reChargesRouter)
route.use(paymentsRouter)

export default route
