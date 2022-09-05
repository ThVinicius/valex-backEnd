import { Router } from 'express'
import schemaValidator from '../middlewares/schemaValidator'
import reChargesSchemas from '../schemas/reChargesSchemas'
import verifyApiKey from '../middlewares/verifyApiKey'
import { reCharges } from '../controllers/reChargesController'

const route = Router()

route.post(
  '/recharges',
  schemaValidator(reChargesSchemas.create),
  verifyApiKey,
  reCharges
)

export default route
