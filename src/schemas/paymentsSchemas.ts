import joi from 'joi'
import { passwordRegex, numberRegex, dateRegex, cvcRegex } from './regex'

const create = joi.object({
  cardId: joi.number().greater(0).required(),
  businessId: joi.number().greater(0).required(),
  password: joi.string().length(4).pattern(passwordRegex).required(),
  amount: joi.number().integer().greater(0).required()
})

const online = joi.object({
  number: joi.string().length(19).pattern(numberRegex).required(),
  cardholderName: joi.string().trim().required(),
  expirationDate: joi.string().length(5).pattern(dateRegex).required(),
  securityCode: joi.string().length(3).pattern(cvcRegex).required(),
  businessId: joi.number().greater(0).required(),
  amount: joi.number().integer().greater(0).required()
})

export default { create, online }
