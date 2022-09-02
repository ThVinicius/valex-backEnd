import { Router } from 'express'
import schemaValidator from '../middlewares/schemaValidator'
import paymentsSchemas from '../schemas/paymentsSchemas'
import { create, online } from '../controllers/paymentsController'

const route = Router()

route.post('/payments', schemaValidator(paymentsSchemas.create), create)

route.post('/payments/online', schemaValidator(paymentsSchemas.online), online)

export default route
