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

// Routing
router.get('/', getProducts)
router.get(
  '/:id',
  param('id').isInt().withMessage('Not Valid ID'),
  handleInputErrors,
  getProductById
)

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

router.patch(
  '/:id',
  param('id').isInt().withMessage('Not Valid ID'),
  handleInputErrors,
  updateAvailability
)

router.delete(
  '/:id',
  param('id').isInt().withMessage('Not Valid ID'),
  handleInputErrors,
  deleteProduct
)

export default router
