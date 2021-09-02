import 'dotenv/config'

import express, { Request, Response, NextFunction, Router } from 'express'
const server = express()
const route = Router()
server.use(route)

import mysql from 'mysql2'
const connection = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS,
  database: process.env.DB_NAME || 'gh-action'
})

route.get('/', (req: Request, res: Response) => console.log('hello world!'))
route.get('/posts', (req: Request, res: Response, next: NextFunction) => {
  try {
    connection.query(`SELECT * FROM posts`, (err, result) => {
      return res.send(result)
    })
  } catch (error) {
    return next(error)
  }
})

route.use(async (error: Error, req: Request, res: Response, _: NextFunction) => {
  return res.send(error.message)
})

server.listen(3000, () => console.log(`Server running`))