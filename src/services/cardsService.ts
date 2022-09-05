import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'
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
  getStatement,
  validateSecurityCode,
  validateIsVirtualCard,
  cryptConfig
} from './shared'

const cryptr = cryptConfig()

function creditCardNumber() {
  return faker.finance.creditCardNumber('#### #### #### ####')
}

function creditCardCVV() {
  const cvvNumber: string = faker.finance.creditCardCVV()

  const securityCode = cryptr.encrypt(cvvNumber)

  return { securityCode, cvvNumber }
}

function createExpirationDate() {
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
  const { rows } = await cardRepository.insert(payload)

  return rows[0]
}

async function hanleCard(cardId: number, securityCode: string) {
  const card = await validateCard(cardId)

  const error = {
    code: 403,
    message: 'cartões virtuais não precisam ser ativados'
  }

  validateIsVirtualCard(!card.isVirtual, error)

  validateSecurityCode(securityCode, card.securityCode)

  validateDate(card.expirationDate)
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
  const card = await validateCard(cardId)

  if (card.isVirtual) card.id = card.originalCardId!

  return card
}

async function statement(cardId: number) {
  return await getStatement(cardId)
}

async function hanleVirtual(cardId: number, password: string) {
  const card = await validateCard(cardId)

  const error = {
    code: 403,
    message:
      'Cartões virtuais só podem ser vinculados a cartões originais cadastrados'
  }

  validateIsVirtualCard(!card.isVirtual, error)

  validateIsActiveCard(card.password)

  validatePassword(password, card.password!)

  return card
}

async function insertVirtual(card: cardRepository.Card) {
  const { employeeId, cardholderName, password, type, id } = card

  const number = faker.finance
    .creditCardNumber('mastercard')
    .replaceAll('-', ' ')

  const { securityCode, cvvNumber } = creditCardCVV()

  const expirationDate = createExpirationDate()

  const payload = {
    employeeId,
    number,
    cardholderName,
    securityCode,
    expirationDate,
    password,
    isVirtual: true,
    originalCardId: id,
    isBlocked: false,
    type
  }

  const { rows } = await cardRepository.insert(payload)

  const cardData = {
    cardId: rows[0].id,
    originalCardId: id,
    number,
    cardholderName,
    securityCode: cvvNumber,
    expirationDate,
    type
  }

  return cardData
}

async function hanleRemove(cardId: number, password: string) {
  const card = await validateCard(cardId)

  const error = {
    code: 406,
    message: 'somente cartões virtuais podem ser deletados'
  }

  validateIsVirtualCard(card.isVirtual, error)

  validatePassword(password, card.password!)
}

async function remove(cardId: number) {
  await cardRepository.remove(cardId)
}

export default {
  creditCardNumber,
  creditCardCVV,
  hanleEmployee,
  createExpirationDate,
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
  statement,
  hanleVirtual,
  insertVirtual,
  hanleRemove,
  remove
}
