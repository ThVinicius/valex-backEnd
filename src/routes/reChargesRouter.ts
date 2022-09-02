import { Router } from 'express'
import schemaValidator from '../middlewares/schemaValidator'
import reChargesSchemas from '../schemas/reChargesSchemas'
import { reCharges } from '../controllers/reChargesController'

const route = Router()

route.post('/recharges', schemaValidator(reChargesSchemas.create), reCharges)

export default route
