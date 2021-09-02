import 'dotenv/config'

import express, { Request, Response, NextFunction, Router, json } from 'express'
const server = express()
const route = Router()
server.use(route)
server.use(json())

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
      return res.status(200).json({
        success: true,
        data: result
      })
    })
  } catch (error) {
    return next(error)
  }
})

route.use(async (error: Error, req: Request, res: Response, _: NextFunction) => {
  return res.status(500).json({
    success: false,
    message: 'INTERNAL SERVER ERROR',
    error: error.message
  })
})

server.listen(3000, '0.0.0.0', () => console.log(`Server running`))