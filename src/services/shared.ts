import dayjs from 'dayjs'
import bcrypt from 'bcrypt'
import * as cardsRepository from '../repositories/cardRepository'

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

export {
  validateDate,
  validateCard,
  validateIsActiveCard,
  validateBlocked,
  validatePassword
}
