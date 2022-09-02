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
