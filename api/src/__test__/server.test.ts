import request from 'supertest'
import server, { connectDB } from '../server'
import db from '../config/db' // estancia sequelize

describe('GET /api', () => {
  test('should send back a json response', async () => {
    const res = await request(server).get('/api')

    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toMatch(/json/)
    expect(res.body.msg).toBe('from api')

    expect(res.status).not.toBe(404)
    expect(res.body.msg).not.toBe('From api')
  })
})

jest.mock('../config/db')
describe('connectDB', () => {
  test('handle database connection error', async () => {
    jest
      .spyOn(db, 'authenticate')
      .mockRejectedValueOnce(new Error('Hubo un error al conectar a la BD'))
    const consoleSpy = jest.spyOn(console, 'log')

    await connectDB()

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Hubo un error al conectar a la BD')
    )
  })
})
