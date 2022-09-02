import {
  validateCard,
  validateIsActiveCard,
  validateDate,
  validatePassword,
  getStatement
} from './shared'
import * as businessRepository from '../repositories/businessRepository'
import * as paymentsRepository from '../repositories/paymentRepository'

async function hanlePayment(
  cardId: number,
  password: string,
  businessId: number,
  paymentAmount: number
) {
  const card = await validateCard(cardId)

  validateIsActiveCard(card.password)

  validatePassword(password, card.password!)

  validateDate(card.expirationDate)

  validateBlockedCard(card.isBlocked)

  const business = await getBusiness(businessId)

  validateCardType(card.type, business.type)

  const { balance } = await getStatement(cardId)

  validateAmount(paymentAmount, balance)
}

function validateBlockedCard(blocked: boolean) {
  if (blocked) throw { code: 401, message: 'cartão bloqueado' }
}

async function getBusiness(businessId: number) {
  const business = await businessRepository.findById(businessId)

  if (business === undefined)
    throw { code: 404, message: 'estabelecimento não cadastrado' }

  return business
}

function validateCardType(cardType: string, businessType: string) {
  if (cardType !== businessType)
    throw {
      code: 401,
      message: `os cartões do tipo ${cardType} só transacionar com estabelecimentos do mesmo tipo`
    }
}

function validateAmount(paymentAmount: number, balance: number) {
  if (balance < paymentAmount)
    throw { code: 402, message: 'saldo insuficiente' }
}

async function insert(cardId: number, businessId: number, amount: number) {
  await paymentsRepository.insert({ cardId, businessId, amount })
}

export default { hanlePayment, insert }
