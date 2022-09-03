import dayjs from 'dayjs'
import bcrypt from 'bcrypt'
import Cryptr from 'cryptr'
import dotenv from 'dotenv'
import * as cardsRepository from '../repositories/cardRepository'
import * as rechargeRepository from '../repositories/rechargeRepository'
import * as paymentRepository from '../repositories/paymentRepository'

dotenv.config()

const secretKey: string = process.env.CRYPTR_SECRET!

const cryptr = new Cryptr(secretKey)

function validateDate(expirationDate: string) {
  const now = dayjs().format('MM/YY')
  const dateDiff: number = dayjs(expirationDate, 'MM/YY').diff(
    dayjs(now, 'MM/YY')
  )

  if (dateDiff < 0) throw { code: 406, message: 'cartão expirado' }
}

async function validateCard(cardId: number) {
  const card = await cardsRepository.findById(cardId)

  if (card === undefined) throw { code: 404, message: 'cartão não cadastrado' }

  return card
}

function validateIsActiveCard(password: string | undefined) {
  if (password === null)
    throw { code: 403, message: 'Esse cartão não esta ativado' }
}

function validatePassword(password: string, userPassword: string) {
  const compare = bcrypt.compareSync(password, userPassword!)

  if (!compare) throw { code: 401, message: 'senha incorreta' }
}

function validateBlocked(
  blocked: boolean,
  error: { code: number; message: string }
) {
  if (blocked) throw error
}

async function getStatement(cardId: number) {
  const recharges = await rechargeRepository.findByCardId(cardId)

  const transactions = await paymentRepository.findByCardId(cardId)

  const totalRecharge = recharges.reduce((acc, curr) => acc + curr.amount, 0)

  const totalPayments = transactions.reduce((acc, curr) => acc + curr.amount, 0)

  const balance = totalRecharge - totalPayments

  return { balance, transactions, recharges }
}

function validateSecurityCode(securityCode: string, cardSecurityCode: string) {
  const decrypt: string = cryptr.decrypt(cardSecurityCode)

  if (decrypt !== securityCode)
    throw { code: 401, message: 'código de segurança incorreto' }
}

function validateIsVirtualCard(
  isVirtual: boolean,
  error: { code: number; message: string }
) {
  if (!isVirtual) throw error
}

export {
  validateDate,
  validateCard,
  validateIsActiveCard,
  validateBlocked,
  validatePassword,
  getStatement,
  validateSecurityCode,
  validateIsVirtualCard
}
