import { Router } from 'express'
import schemaValidator from '../middlewares/schemaValidator'
import cardsSchemas from '../schemas/cardsSchemas'
import paramsSchemas from '../schemas/paramsSchemas'
import verifyApiKey from '../middlewares/verifyApiKey'
import {
  createCard,
  activate,
  get,
  statement,
  blocked,
  unlock,
  virtual,
  remove
} from '../controllers/cardsController'

const route = Router()

route.post(
  '/cards',
  schemaValidator(cardsSchemas.create),
  verifyApiKey,
  createCard
)

route.patch('/cards/activate', schemaValidator(cardsSchemas.activate), activate)

route.get('/cards', schemaValidator(cardsSchemas.getCards), get)

route.patch('/blocked', schemaValidator(cardsSchemas.blockedAndUnlock), blocked)

route.patch('/unlock', schemaValidator(cardsSchemas.blockedAndUnlock), unlock)

const isParams = true

route.get(
  '/statement/:cardId',
  schemaValidator(paramsSchemas.cardId, isParams),
  statement
)

route.post('/cards/virtual', schemaValidator(cardsSchemas.virtual), virtual)

route.delete('/cards/virtual', schemaValidator(cardsSchemas.virtual), remove)

export default route
