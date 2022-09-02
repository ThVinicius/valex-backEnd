import { Router } from 'express'
import schemaValidator from '../middlewares/schemaValidator'
import paymentsSchemas from '../schemas/paymentsSchemas'
import { create } from '../controllers/paymentsController'

const route = Router()

route.post('/payments', schemaValidator(paymentsSchemas.create), create)

export default route
