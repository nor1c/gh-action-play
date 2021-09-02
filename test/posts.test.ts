import jest from 'jest'
import supertest from 'supertest'

const apiUrl = 'http://localhost:3000'
const api = supertest.agent(apiUrl)

describe('Post module', () => {
  test('it should return posts data', async () => {
    const posts = await api.get('/posts')

    expect(posts.statusCode).toBe(200)
    expect(posts.body.success).toEqual(true)
  })
})