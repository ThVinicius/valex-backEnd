import joi from 'joi'

const cardId = joi.object({
  cardId: joi.number().greater(0).required()
})

export default { cardId }
