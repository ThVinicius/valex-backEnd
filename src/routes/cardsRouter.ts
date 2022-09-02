import { Router } from 'express'
import schemaValidator from '../middlewares/schemaValidator'
import cardsSchemas from '../schemas/cardsSchemas'
import verifyApiKey from '../middlewares/verifyApiKey'
import { createCard, activate, get } from '../controllers/cardsController'

const route = Router()

route.post(
  '/cards',
  schemaValidator(cardsSchemas.create),
  verifyApiKey,
  createCard
)

route.patch('/cards/activate', schemaValidator(cardsSchemas.activate), activate)

route.get('/cards', schemaValidator(cardsSchemas.getCards), get)

export default route
