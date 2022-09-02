import { ErrorRequestHandler } from 'express'

export const errorHandling: ErrorRequestHandler = (error, req, res, next) => {
  switch (error.code) {
    case 400:
      return res.status(400).send(error.message)

    case 401:
      return res.status(401).send(error.message)

    case 403:
      return res.status(403).send(error.message)

    case 404:
      return res.status(404).send(error.message)

    case 406:
      return res.status(406).send(error.message)

    case 409:
      return res.status(409).send(error.message)

    default:
      console.log(error)
      return res.status(500).send(error)
  }
}
