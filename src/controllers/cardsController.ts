import { Request, Response } from 'express'
import cardsService from '../services/cardsService'
import { TransactionTypes } from '../repositories/cardRepository'

export async function createCard(req: Request, res: Response) {
  const { employeeId, type }: { employeeId: number; type: TransactionTypes } =
    req.body

  const cardholderName: string = await cardsService.hanleEmployee(
    employeeId,
    type
  )

  const number: string = cardsService.creditCardNumber()
  const securityCode: string = cardsService.creditCardCVV()
  const expirationDate: string = cardsService.expirationDate()

  const payload = {
    employeeId,
    number,
    cardholderName,
    securityCode,
    expirationDate,
    password: undefined,
    isVirtual: false,
    originalCardId: undefined,
    isBlocked: false,
    type
  }

  await cardsService.insert(payload)

  return res.sendStatus(201)
}

export async function activate(req: Request, res: Response) {
  const {
    cardId,
    securityCode,
    password
  }: { cardId: number; securityCode: string; password: string } = req.body

  await cardsService.hanleCard(cardId, securityCode)

  const cryptPassword = cardsService.cryptPassword(password)

  const cardData = { password: cryptPassword }

  await cardsService.update(cardId, cardData)

  return res.sendStatus(200)
}

export async function get(req: Request, res: Response) {
  const { employeeId, password }: { employeeId: number; password: string } =
    req.body

  const cardsEmployee = await cardsService.getAllCardsByEmployee(
    employeeId,
    password
  )

  return res.status(200).send(cardsEmployee)
}

export async function blocked(req: Request, res: Response) {
  const { cardId, password }: { cardId: number; password: string } = req.body

  await cardsService.hanleBlocked(cardId, password)

  await cardsService.blocked(cardId)

  return res.sendStatus(200)
}

export async function unlock(req: Request, res: Response) {
  const { cardId, password }: { cardId: number; password: string } = req.body

  await cardsService.hanleUnlock(cardId, password)

  await cardsService.unlock(cardId)

  return res.sendStatus(200)
}
