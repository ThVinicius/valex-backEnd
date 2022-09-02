import { faker } from '@faker-js/faker'
import Cryptr from 'cryptr'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import dayjs from 'dayjs'
import * as employeeRepository from '../repositories/employeeRepository'
import * as cardRepository from '../repositories/cardRepository'
import {
  TransactionTypes,
  CardInsertData,
  CardUpdateData
} from '../repositories/cardRepository'
import {
  validateDate,
  validateBlocked,
  validateCard,
  validatePassword,
  validateIsActiveCard,
  getStatement
} from './shared'

dotenv.config()

const secretKey: string = process.env.CRYPTR_SECRET!

const cryptr = new Cryptr(secretKey)

function creditCardNumber() {
  return faker.finance.creditCardNumber('#### #### #### ####')
}

function creditCardCVV() {
  const cvvNumber: string = faker.finance.creditCardCVV()

  return cryptr.encrypt(cvvNumber)
}

function expirationDate() {
  return dayjs().add(5, 'year').format('MM/YY')
}

async function hanleEmployee(employeeId: number, type: TransactionTypes) {
  const employee = await employeeRepository.findById(employeeId)

  if (employee === undefined)
    throw { code: 404, message: 'empregado não cadastrado' }

  const cardEmployee = await cardRepository.findByTypeAndEmployeeId(
    type,
    employeeId
  )

  if (cardEmployee !== undefined)
    throw {
      code: 409,
      message: 'Empregados não podem ter mais de um cartão do mesmo tipo'
    }
  const fullNameArr: string[] = employee.fullName.split(' ')

  const lastName: string | undefined = fullNameArr.pop()
  const [firstName, ...rest] = fullNameArr

  let surname: string = ''
  for (const name of rest) {
    if (name.length >= 3) {
      surname += name[0]
    }
  }

  const cardHolderName: string =
    `${firstName} ${surname} ${lastName}`.toUpperCase()

  return cardHolderName
}

async function insert(payload: CardInsertData) {
  await cardRepository.insert(payload)
}

async function hanleCard(cardId: number, securityCode: string) {
  const card = await validateCardAndReturn(cardId)

  validateSecurityCode(securityCode, card.securityCode)

  validateDate(card.expirationDate)
}

function validateSecurityCode(securityCode: string, cardSecurityCode: string) {
  const decrypt: string = cryptr.decrypt(securityCode)

  if (decrypt !== cardSecurityCode)
    throw { code: 401, message: 'código de segurança incorreto' }
}

async function validateCardAndReturn(cardId: number) {
  const card = await cardRepository.findById(cardId)

  if (card === undefined) throw { code: 404, message: 'cartão não cadastrado' }

  if (card.password !== null)
    throw { code: 403, message: 'Esse cartão já esta ativado' }

  return card
}

function cryptPassword(password: string) {
  const saltRounds: number = 10

  return bcrypt.hashSync(password, saltRounds)
}

async function update(cardId: number, cardData: CardUpdateData) {
  await cardRepository.update(cardId, cardData)
}

async function getAllCardsByEmployee(employeeId: number, password: string) {
  const allCards = (await cardRepository.find()).filter(
    card => card.password !== null
  )

  const cardsEmployee = allCards.filter(
    card =>
      card.employeeId === employeeId &&
      bcrypt.compareSync(password, card.password!)
  )

  const cards = cardsEmployee.map(
    ({ number, cardholderName, expirationDate, securityCode }) => {
      const decrypt: string = cryptr.decrypt(securityCode)

      return { number, cardholderName, expirationDate, securityCode: decrypt }
    }
  )

  return { cards }
}

async function hanleBlocked(cardId: number, password: string) {
  const card = await validateCard(cardId)

  validateIsActiveCard(card.password)

  validatePassword(password, card.password!)

  validateDate(card.expirationDate)

  const error = { code: 409, message: 'esse cartão já esta bloqueado' }

  validateBlocked(card.isBlocked, error)
}

async function hanleUnlock(cardId: number, password: string) {
  const card = await validateCard(cardId)

  validateIsActiveCard(card.password)

  validatePassword(password, card.password!)

  validateDate(card.expirationDate)

  validateUnlock(card.isBlocked)
}

function validateUnlock(isBlocked: boolean) {
  if (!isBlocked)
    throw { code: 409, message: 'esse cartão já esta desbloqueado' }
}

async function unlock(cardId: number) {
  await cardRepository.update(cardId, { isBlocked: false })
}

async function blocked(cardId: number) {
  await cardRepository.update(cardId, { isBlocked: true })
}

async function hanleStatement(cardId: number) {
  await validateCard(cardId)
}

async function statement(cardId: number) {
  return await getStatement(cardId)
}

export default {
  creditCardNumber,
  creditCardCVV,
  hanleEmployee,
  expirationDate,
  insert,
  hanleCard,
  cryptPassword,
  update,
  getAllCardsByEmployee,
  hanleBlocked,
  blocked,
  hanleUnlock,
  unlock,
  hanleStatement,
  statement
}
