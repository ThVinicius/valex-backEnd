import { faker } from '@faker-js/faker'
import dayjs from 'dayjs'
import * as employeeRepository from '../repositories/employeeRepository.js'
import * as cardRepository from '../repositories/cardRepository.js'
import {
  TransactionTypes,
  CardInsertData
} from '../repositories/cardRepository.js'

function creditCardNumber() {
  return faker.finance.creditCardNumber('################')
}

function creditCardCVV() {
  return faker.finance.creditCardCVV()
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

  const lastName: string = fullNameArr.pop()
  const [firstName, ...rest] = fullNameArr

  let surname: string = ''
  for (const name of rest) {
    console.log(name)
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

export default {
  creditCardNumber,
  creditCardCVV,
  hanleEmployee,
  expirationDate,
  insert
}
