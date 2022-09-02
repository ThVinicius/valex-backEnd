import dayjs from 'dayjs'
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

  if (card.password === null)
    throw { code: 403, message: 'Esse cartão não esta ativado' }

  return card
}

export { validateDate, validateCard }
