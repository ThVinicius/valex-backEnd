import { Request, Response, NextFunction } from 'express'
import { ObjectSchema } from 'joi'

export default function schemaValidator(schema: ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: true })

    if (error) {
      return res.status(400).send(error.details.map(detail => detail.message))
    }

    return next()
  }
}
