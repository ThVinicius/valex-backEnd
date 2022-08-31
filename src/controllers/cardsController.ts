import { Request, Response } from 'express'
import cardsService from '../services/cardsService.js'
import { TransactionTypes } from '../repositories/cardRepository.js'

export async function createCard(req: Request, res: Response) {
  const { employeeId, type }: { employeeId: number; type: TransactionTypes } =
    req.body

  const cardholderName: string = await cardsService.hanleEmployee(
    employeeId,
    type
  )

  const number = cardsService.creditCardNumber()
  const securityCode = cardsService.creditCardCVV()
  const expirationDate = cardsService.expirationDate()

  const payload = {
    employeeId,
    number,
    cardholderName,
    securityCode,
    expirationDate,
    password: null,
    isVirtual: false,
    originalCardId: null,
    isBlocked: false,
    type
  }

  await cardsService.insert(payload)

  return res.sendStatus(201)
}
