import joi from 'joi'

const create = joi.object({
  cardId: joi.number().greater(0).required(),
  amount: joi.number().integer().greater(0).required()
})

export default { create }
