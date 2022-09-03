import {
  validateCard,
  validateIsActiveCard,
  validateDate,
  validatePassword,
  getStatement,
  validateSecurityCode,
  validateIsVirtualCard
} from './shared'
import * as businessRepository from '../repositories/businessRepository'
import * as paymentsRepository from '../repositories/paymentRepository'
import * as cardsRepository from '../repositories/cardRepository'

async function hanlePayment(
  cardId: number,
  password: string,
  businessId: number,
  paymentAmount: number
) {
  const card = await validateCard(cardId)

  const error = {
    code: 406,
    message: 'Cartões virtuais não podem ser utilizados em compras POS'
  }

  validateIsVirtualCard(!card.isVirtual, error)

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
      message: `os cartões do tipo ${cardType} só transacionam com estabelecimentos do mesmo tipo`
    }
}

function validateAmount(paymentAmount: number, balance: number) {
  if (balance < paymentAmount)
    throw { code: 402, message: 'saldo insuficiente' }
}

async function insert(cardId: number, businessId: number, amount: number) {
  await paymentsRepository.insert({ cardId, businessId, amount })
}

async function hanlePaymentOnline(
  number: string,
  cardholderName: string,
  expirationDate: string,
  securityCode: string,
  businessId: number,
  amount: number
) {
  const card = await validateCardPaymentOnline(
    number,
    cardholderName,
    expirationDate
  )

  validateSecurityCode(securityCode, card.securityCode)

  validateDate(card.expirationDate)

  validateBlockedCard(card.isBlocked)

  const business = await getBusiness(businessId)

  validateCardType(card.type, business.type)

  const { balance } = await getStatement(card.id)

  validateAmount(amount, balance)

  return { cardId: card.id }
}

async function validateCardPaymentOnline(
  number: string,
  cardholderName: string,
  expirationDate: string
) {
  const card = await cardsRepository.findByCardDetails(
    number,
    cardholderName,
    expirationDate
  )

  if (card === undefined)
    throw { code: 404, message: 'cartão não cadastrado ou dados incorretos' }

  return card
}

export default { hanlePayment, insert, hanlePaymentOnline }
