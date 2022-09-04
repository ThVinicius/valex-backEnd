import * as rechargeRepository from '../repositories/rechargeRepository'
import {
  validateDate,
  validateCard,
  validateIsActiveCard,
  validateIsVirtualCard
} from './shared'

async function hanleRecharge(cardId: number) {
  const card = await validateCard(cardId)

  const error = {
    code: 403,
    message: 'Cartões virtuais não podem receber recargas'
  }

  validateIsVirtualCard(!card.isVirtual, error)

  validateIsActiveCard(card.password)

  validateDate(card.expirationDate)
}

async function insert(cardId: number, amount: number) {
  await rechargeRepository.insert({ cardId, amount })
}

export default { hanleRecharge, insert }
