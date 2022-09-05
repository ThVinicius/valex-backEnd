import dotenv from 'dotenv'
import pg, { PoolConfig } from 'pg'
dotenv.config()

const { Pool } = pg

const configDatabase: PoolConfig = {
  connectionString: process.env.DATABASE_URL
}

if (process.env.MODE === 'PROD') {
  configDatabase.ssl = {
    rejectUnauthorized: false
  }
}

export const connection = new Pool(configDatabase)
