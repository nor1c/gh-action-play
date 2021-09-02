import jest from 'jest'
import supertest from 'supertest'

const apiUrl = 'http://127.0.0.1:8000'
const api = supertest.agent(apiUrl)

describe('Post module', () => {
  test('it should return posts data', async () => {
    const posts = await api.get('/posts')

    expect(posts.statusCode).toBe(200)
    expect(posts.body.success).toEqual(true)
  })
})