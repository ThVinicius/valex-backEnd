import * as rechargeRepository from '../repositories/rechargeRepository'
import * as cardsRepository from '../repositories/cardRepository'
import { validateDate } from './shared'

async function hanleRecharge(cardId: number) {
  const card = await validateCard(cardId)

  validateDate(card.expirationDate)
}

async function validateCard(cardId: number) {
  const card = await cardsRepository.findById(cardId)

  if (card === undefined) throw { code: 404, message: 'cartão não cadastrado' }

  if (card.password === null)
    throw { code: 403, message: 'Esse cartão não esta ativado' }

  return card
}

async function insert(cardId: number, amount: number) {
  await rechargeRepository.insert({ cardId, amount })
}

export default { hanleRecharge, insert }
