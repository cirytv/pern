import { serve } from './../node_modules/@types/swagger-ui-express/index.d'
import express from 'express'
import colors from 'colors'
import router from './router'
import db from './config/db'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec, { swaggerUiOptions } from './config/swagger'

// Conectar a base de datos
export async function connectDB() {
  try {
    await db.authenticate()
    db.sync()
    // console.log(colors.blue('Conexión exitosa a la BD'))
  } catch (error) {
    // console.log(error)
    console.log(colors.red.bold('Hubo un error al conectar a la BD'))
  }
}
connectDB()

// Instancia de express
const server = express()

// Leer datos de formularios
server.use(express.json())

server.use('/api/products', router)

// Swagger Docs Router
server.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerUiOptions)
)

export default server
