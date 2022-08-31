import { Request, Response, NextFunction } from 'express'
import { findByApiKey } from '../repositories/companyRepository.js'

async function verifyApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey: string = req.header('x-api-key')

  if (apiKey === undefined || apiKey.trim() === '')
    throw { code: 400, message: 'api key inválido ou inexistente' }

  const key = await findByApiKey(apiKey)

  if (key === undefined) throw { code: 401, message: 'api key não cadastrada' }

  res.locals.apiKey = key

  next()
}

export default verifyApiKey
