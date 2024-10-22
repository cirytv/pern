import { Router } from 'express'
import { body, param } from 'express-validator'
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateAvailability,
  updateProduct,
} from './handlers/product'
import { handleInputErrors } from './middleware'

const router = Router()
// Schema - Swagger
/**
 * @swagger
 * components:
 *      schemas:
 *          Product:
 *              type: object
 *              properties:
 *                  id:
 *                      type: integer
 *                      description: The Product ID
 *                      example: 1
 *                  name:
 *                      type: string
 *                      description: The Product name
 *                      example: Mechanic Keyboard Blue Switches
 *                  price:
 *                      type: number
 *                      description: The Product price
 *                      example: 300
 *                  availability:
 *                      type: boolean
 *                      description: The Product availability
 *                      example: true
 */

// DOCUMENTATION EndPoint GET All Products - Swagger
/**
 * @swagger
 * /api/products:
 *      get:
 *          summary: Get a list of products
 *          tags:
 *              - Products
 *          description: Return a list of products
 *          responses:
 *              200:
 *                  description: Successful response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/Product'
 *
 */

// Routing
router.get('/', getProducts)

// DOCUMENTATION EndPoint GET Products By ID - Swagger
/**
 * @swagger
 * /api/products/{id}:
 *    get:
 *        summary: Get a product by ID
 *        tags:
 *            - Products
 *        description: Return a product based on it's unique ID
 *        parameters:
 *          - in: path
 *            name: id
 *            description: The ID of the product to retrieve
 *            required: true
 *            schema:
 *                type: integer
 *        responses:
 *            200:
 *                description: Successful response
 *                content:
 *                    application/json:
 *                        schema:
 *                            $ref:   '#/components/schemas/Product'
 *            404:
 *                description: Item Not Found
 *            400:
 *                description: Bad request - Invalid ID
 *
 *
 *
 *
 *
 *
 *
 */
router.get(
  '/:id',
  param('id').isInt().withMessage('Not Valid ID'),
  handleInputErrors,
  getProductById
)

// DOCUMENTATION EndPoint POST Product - Swagger
/**
 * @swagger
 * /api/products:
 *    post:
 *          summary: Creates a new product
 *          tags:
 *              - Products
 *          description: Returns a new record in the database
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  example: "Monitor Curvo 49 Pulgadas"
 *                              price:
 *                                  type: number
 *                                  example: 399
 *          responses:
 *              201:
 *                  description: Successful response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Product'
 *              400:
 *                  description: Bad Request - invalid input data
 */

router.post(
  '/',
  // Validación
  body('name').notEmpty().withMessage('Product Name Must Be Filled'),
  body('price')
    .isNumeric()
    .withMessage('Not Valid Value')
    .notEmpty()
    .withMessage('Product Price Must Be Filled')
    .custom((value) => value > 0)
    .withMessage('Price Not Valid'),
  handleInputErrors,
  createProduct
)

// DOCUMENTATION EndPoint PUT Product - Swagger
/**
 * @swagger
 * /api/products/{id}:
 *    put:
 *        summary:  Updates a product by ID with user input
 *        tags:
 *            - Products
 *        description: Returns the updated products
 *        parameters:
 *          - in: path
 *            name: id
 *            description: The ID of the product to retrieve
 *            required: true
 *            schema:
 *                type: integer
 *        requestBody:
 *            required: true
 *            content:
 *                application/json:
 *                    schema:
 *                    type: object
 *                    properties:
 *                        name:
 *                            type: string
 *                            example: "Razer Keyboard"
 *                        price:
 *                            type: number
 *                            example: 100
 *                        availability:
 *                            type: boolean
 *                            example: True
 *        responses:
 *            200:
 *                description: Successful response
 *                content:
 *                    application/json:
 *                        schema:
 *                            $ref: '#/components/schemas/Product'
 *            400:
 *                description: Bad request - Invalid ID or Invalid input data
 *            404:
 *                description: Item Not Found
 *
 *
 *
 */
router.put(
  '/:id',
  param('id').isInt().withMessage('Not Valid ID'),
  body('name').notEmpty().withMessage('Product Name Cant Be Empty'),
  body('price')
    .isNumeric()
    .withMessage('Valor no válido')
    .notEmpty()
    .withMessage('Product Price Cant Be Empty')
    .custom((value) => value > 0)
    .withMessage('Price Not Valid'),
  body('availability').isBoolean().withMessage('Not Valid Availability Value'),
  handleInputErrors,
  updateProduct
)

// DOCUMENTATION EndPoint PATCH Product Availability - Swagger
/**
 * @swagger
 * /api/products/{id}:
 *  patch:
 *      summary: Update Product availability
 *      tags:
 *          - Products
 *      description: Returns the updated availability
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad Request - Invalid ID
 *          404:
 *              description: Product Not Found
 */
router.patch(
  '/:id',
  param('id').isInt().withMessage('Not Valid ID'),
  handleInputErrors,
  updateAvailability
)
// DOCUMENTATION EndPoint PATCH Product Availability - Swagger
/**
 * @swagger
 * /api/products/{id}:
 *    delete:
 *        summary: Deletes a product by a given ID
 *        tags:
 *          - Products
 *        description: Returns a confirmation message
 *        parameters:
 *          - in: path
 *            name: id
 *            description: The ID of the product to delete
 *            required: true
 *            schema:
 *                type: integer
 *        responses:
 *            200:
 *                description: Successful response
 *                content:
 *                    application/json:
 *                        schema:
 *                            type: string
 *                            value: 'Producto Eliminado'
 *            400:
 *                description: Bad Request - Invalid ID
 *            404:
 *                description: Product Not Found
 */
router.delete(
  '/:id',
  param('id').isInt().withMessage('Not Valid ID'),
  handleInputErrors,
  deleteProduct
)

export default router
