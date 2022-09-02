const cvcRegex = /^\d{3}$/

const passwordRegex = /^\d{4}$/

const numberRegex = /^(\d{4}\s){3}\d{4}$/

const dateRegex = /(?!^(00)|(1[3-9]))^[0-1]\d[/]\d{2}$/

export { cvcRegex, passwordRegex, numberRegex, dateRegex }
