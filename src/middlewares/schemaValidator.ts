import { Request, Response, NextFunction } from 'express'
import { ObjectSchema } from 'joi'

export default function schemaValidator(
  schema: ObjectSchema,
  params: boolean = false
) {
  let payload

  return (req: Request, res: Response, next: NextFunction) => {
    if (params) payload = req.params
    else payload = req.body

    const { error } = schema.validate(payload, { abortEarly: true })

    if (error) {
      return res.status(400).send(error.details.map(detail => detail.message))
    }

    return next()
  }
}
