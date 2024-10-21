import request from 'supertest'
import server from '../../server'

// POST
describe('POST /api/products', () => {
  // test empty form
  test('display validation errors', async () => {
    const response = await request(server).post('/api/products').send({})

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors).toHaveLength(4)

    expect(response.status).not.toBe(404)
    expect(response.body.errors).not.toHaveLength(2)
  })

  // test price > 0
  test('validate price is a number and greater than 0', async () => {
    const response = await request(server).post('/api/products').send({
      name: 'price - test',
      price: 0,
    })

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors).toHaveLength(1)

    expect(response.status).not.toBe(404)
    expect(response.body.errors).not.toHaveLength(2)
  })

  // test price is a number and > 0
  test('validate price is a number and greater than 0', async () => {
    const response = await request(server).post('/api/products').send({
      name: 'price - test',
      price: 'hello',
    })

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors).toHaveLength(2)

    expect(response.status).not.toBe(404)
    expect(response.body.errors).not.toHaveLength(4)
  })

  //   create
  test('create a new product', async () => {
    const response = await request(server).post('/api/products').send({
      name: 'created - testing',
      price: 777,
    })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('data')

    expect(response.status).not.toBe(404)
    expect(response.status).not.toBe(200)
    expect(response.body).not.toHaveProperty('errors')
  })
})

// GET
describe('GET /api/products', () => {
  test('check if api/products url exists', async () => {
    const response = await request(server).get('/api/products')

    expect(response.status).not.toBe(404)
  })
  test('GET a JSON response with products', async () => {
    const response = await request(server).get('/api/products')

    expect(response.status).toBe(200)
    expect(response.headers['content-type']).toMatch(/json/)
    expect(response.body).toHaveProperty('data')
    expect(response.body.data).toHaveLength(1)
    expect(response.status).not.toBe(404)
    expect(response.body).not.toHaveProperty('errors')
  })
})

// GET by ID
describe('GET /api/products/:id', () => {
  test('return a 404 response fir a non-existent product', async () => {
    const productId = 2000
    const response = await request(server).get(`/api/products/${productId}`)

    expect(response.status).toBe(404)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('Product Not Found')
  })

  test('GET a JSON response for a single product', async () => {
    const productId = 1
    const response = await request(server).get(`/api/products/${productId}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('data')
  })

  test('check invalid ID in url', async () => {
    const response = await request(server).get('/api/products/invalid-id')

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].msg).toBe('Not Valid ID')
  })
})

// PUT
describe('PUT /api/products/:id', () => {
  test('check invalid ID in url', async () => {
    const response = await request(server)
      .put('/api/products/invalid-id')
      .send({
        name: 'positive price - test',
        availability: true,
        price: 300,
      })

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].msg).toBe('Not Valid ID')
  })

  test('display validation error message when updating a product', async () => {
    const response = await request(server).put('/api/products/1').send({})

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors).toBeTruthy()
    expect(response.body.errors).toHaveLength(5)

    expect(response.status).not.toBe(200)
    expect(response.body).not.toHaveProperty('data')
  })

  test('validate that the price is greater than 0 when updating a product', async () => {
    const response = await request(server).put('/api/products/1').send({
      name: 'positive price - test',
      availability: true,
      price: -300,
    })

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors).toBeTruthy()
    expect(response.body.errors).toHaveLength(1)

    expect(response.status).not.toBe(200)
    expect(response.body).not.toHaveProperty('data')
  })

  test('return a 404 response for a non-existent product', async () => {
    const productId = 2000
    const response = await request(server)
      .put(`/api/products/${productId}`)
      .send({
        name: '404 response - test',
        availability: true,
        price: 300,
      })

    expect(response.status).toBe(404)
    expect(response.body.error).toBe('Product Not Found')

    expect(response.status).not.toBe(200)
    expect(response.body).not.toHaveProperty('data')
  })

  test('200 response for an existent product', async () => {
    const productId = 1
    const response = await request(server)
      .put(`/api/products/${productId}`)
      .send({
        name: '200 response - test',
        availability: true,
        price: 300,
      })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('data')

    expect(response.status).not.toBe(404)
    expect(response.body).not.toHaveProperty('errors')
  })
})

describe('PATCH /api/products/:id', () => {
  test('return a 404 response for a non-existing product', async () => {
    const productId = 2000
    const response = await request(server).patch(`/api/products/${productId}`)

    expect(response.status).toBe(404)
    expect(response.body.error).toBe('Product Not Found')
    expect(response.status).not.toBe(200)
    expect(response.body).not.toHaveProperty('data')
  })

  test('update product availability', async () => {
    const response = await request(server).patch('/api/products/1')

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('data')
    expect(response.body.data.availability).toBe(false)

    expect(response.status).not.toBe(404)
    expect(response.status).not.toBe(400)
    expect(response.body).not.toHaveProperty('error')
  })
})

describe('DELETE /api/products/:id', () => {
  test('check a valid ID', async () => {
    const response = await request(server).delete('/api/products/not-valid')

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors[0].msg).toBe('Not Valid ID')
  })

  test('return a 404 response for a non-existent product', async () => {
    const productId = 2000
    const response = await request(server).delete(`/api/products/${productId}`)

    expect(response.status).toBe(404)
    expect(response.body.error).toBe('Product Not Found')
    expect(response.status).not.toBe(200)
  })

  test('delete existent product', async () => {
    const productId = 1
    const response = await request(server).delete(`/api/products/${productId}`)

    expect(response.status).toBe(200)
    expect(response.body).not.toHaveProperty('errors')
    expect(response.status).not.toBe(404)
    expect(response.status).not.toBe(400)
  })
})
