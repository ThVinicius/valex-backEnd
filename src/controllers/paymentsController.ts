import { Request, Response } from 'express'
import paymentsService from '../services/paymentsService'

export async function create(req: Request, res: Response) {
  const {
    cardId,
    businessId,
    password,
    amount
  }: { cardId: number; businessId: number; password: string; amount: number } =
    req.body

  await paymentsService.hanlePayment(cardId, password, businessId, amount)

  await paymentsService.insert(cardId, businessId, amount)

  return res.sendStatus(201)
}

export async function online(req: Request, res: Response) {
  const {
    number,
    cardholderName,
    expirationDate,
    securityCode,
    businessId,
    amount
  }: {
    number: string
    cardholderName: string
    expirationDate: string
    securityCode: string
    businessId: number
    amount: number
  } = req.body

  const { cardId } = await paymentsService.hanlePaymentOnline(
    number,
    cardholderName,
    expirationDate,
    securityCode,
    businessId,
    amount
  )

  await paymentsService.insert(cardId, businessId, amount)

  return res.sendStatus(201)
}
