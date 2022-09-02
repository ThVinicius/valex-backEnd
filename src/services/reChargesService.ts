import * as rechargeRepository from '../repositories/rechargeRepository'
import { validateDate, validateCard, validateIsActiveCard } from './shared'

async function hanleRecharge(cardId: number) {
  const card = await validateCard(cardId)

  validateIsActiveCard(card.password)

  validateDate(card.expirationDate)
}

async function insert(cardId: number, amount: number) {
  await rechargeRepository.insert({ cardId, amount })
}

export default { hanleRecharge, insert }
