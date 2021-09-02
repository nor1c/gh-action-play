import express, { Router } from 'express'

const server = express()

const route = Router()
server.use(route)

route.get('/', (req, res) => console.log('hello world!'))

server.listen(3000, () => console.log(`Server running`))