import joi from 'joi'
import { cvcRegex, passwordRegex } from './regex'

const create = joi.object({
  employeeId: joi.number().greater(0).required(),
  type: joi
    .string()
    .valid('groceries', 'restaurant', 'transport', 'education', 'health')
    .required()
})

const activate = joi.object({
  cardId: joi.number().greater(0).required(),
  securityCode: joi.string().length(3).pattern(cvcRegex).required(),
  password: joi.string().length(4).pattern(passwordRegex).required()
})

const getCards = joi.object({
  employeeId: joi.number().greater(0).required(),
  password: joi.string().length(4).pattern(passwordRegex).required()
})

const balanceAndTransactions = joi.object({
  cardId: joi.number().greater(0).required()
})

const blockedAndUnlock = joi.object({
  cardId: joi.number().greater(0).required(),
  password: joi.string().length(4).pattern(passwordRegex).required()
})

export default {
  create,
  activate,
  getCards,
  balanceAndTransactions,
  blockedAndUnlock
}
