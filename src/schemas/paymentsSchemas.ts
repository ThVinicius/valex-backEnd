import joi from 'joi'

const passwordRegex = /^\d{4}$/

const create = joi.object({
  cardId: joi.number().greater(0).required(),
  businessId: joi.number().greater(0).required(),
  password: joi.string().length(4).pattern(passwordRegex).required(),
  amount: joi.number().greater(0).required()
})

export default { create }
