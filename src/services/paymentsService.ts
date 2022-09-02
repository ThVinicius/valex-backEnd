import bcrypt from 'bcrypt'
import { validateCard, validateDate } from './shared'
import * as businessRepository from '../repositories/businessRepository'
import * as rechargeRepository from '../repositories/rechargeRepository'
import * as paymentsRepository from '../repositories/paymentRepository'

async function hanlePayment(
  cardId: number,
  password: string,
  businessId: number,
  paymentAmount: number
) {
  const card = await validateCard(cardId)

  validatePassword(password, card.password!)

  validateDate(card.expirationDate)

  validateBlockedCard(card.isBlocked)

  const business = await getBusiness(businessId)

  validateCardType(card.type, business.type)

  const balance = await getBalance(cardId)

  validateAmount(paymentAmount, balance)
}

function validateBlockedCard(blocked: boolean) {
  if (blocked) throw { code: 401, message: 'cartão bloqueado' }
}

function validatePassword(password: string, userPassword: string) {
  const compare = bcrypt.compareSync(password, userPassword)

  if (!compare) throw { code: 401, message: 'senha incorreta' }
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

async function getBalance(cardId: number) {
  const recharge = await rechargeRepository.findByCardId(cardId)

  const payments = await paymentsRepository.findByCardId(cardId)

  const totalRecharge = recharge.reduce((acc, curr) => acc + curr.amount, 0)

  const totalPayments = payments.reduce((acc, curr) => acc + curr.amount, 0)

  const balance = totalRecharge - totalPayments

  return balance
}

function validateAmount(paymentAmount: number, balance: number) {
  if (balance < paymentAmount)
    throw { code: 402, message: 'saldo insuficiente' }
}

async function insert(cardId: number, businessId: number, amount: number) {
  await paymentsRepository.insert({ cardId, businessId, amount })
}

export default { hanlePayment, insert }
