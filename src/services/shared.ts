import dayjs from 'dayjs'

function validateDate(expirationDate: string) {
  const now = dayjs().format('MM/YY')
  const dateDiff: number = dayjs(expirationDate, 'MM/YY').diff(
    dayjs(now, 'MM/YY')
  )

  if (dateDiff < 0) throw { code: 406, message: 'cartão expirado' }
}

export { validateDate }
