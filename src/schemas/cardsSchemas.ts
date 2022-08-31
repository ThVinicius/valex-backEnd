import joi from 'joi'

const create = joi.object({
  employeeId: joi.number().greater(0).required(),
  type: joi
    .string()
    .valid('groceries', 'restaurants', 'transport', 'education', 'health')
    .required()
})

const cvcRegex = /^\d{3}$/
const passwordRegex = /^\d{4}$/

const activate = joi.object({
  cardId: joi.number().greater(0).required(),
  securityCode: joi.string().length(3).pattern(cvcRegex).required(),
  password: joi.string().length(4).pattern(passwordRegex).required()
})

const getCards = joi.object({
  cardId: joi.number().greater(0).required(),
  password: joi.string().length(4).pattern(passwordRegex).required()
})

const balanceAndTransactions = joi.object({
  cardId: joi.number().greater(0).required()
})

const lockAndUnlock = joi.object({
  cardId: joi.number().greater(0).required(),
  password: joi.string().length(4).pattern(passwordRegex).required()
})

export default {
  create,
  activate,
  getCards,
  balanceAndTransactions,
  lockAndUnlock
}
