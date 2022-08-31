import { Router } from 'express'
import schemaValidator from '../middlewares/schemaValidator.js'
import cardsSchemas from '../schemas/cardsSchemas.js'
import verifyApiKey from '../middlewares/verifyApiKey.js'
import { createCard } from '../controllers/cardsController.js'

const route = Router()

route.post(
  '/cards',
  schemaValidator(cardsSchemas.create),
  verifyApiKey,
  createCard
)

export default route
