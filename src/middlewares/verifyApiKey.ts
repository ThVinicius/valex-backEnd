import { Request, Response, NextFunction } from 'express'

function verifyApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey: string = req.header('apiKey')

  if (apiKey === undefined || apiKey.trim() === '') return res.sendStatus(401)

  next()
}

export default verifyApiKey
