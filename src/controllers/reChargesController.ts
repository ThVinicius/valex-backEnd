import { Request, Response } from 'express'
import reChargesService from '../services/reChargesService'

export async function reCharges(req: Request, res: Response) {
  const { cardId, amount }: { cardId: number; amount: number } = req.body

  await reChargesService.hanleRecharge(cardId)

  await reChargesService.insert(cardId, amount)

  return res.sendStatus(201)
}
