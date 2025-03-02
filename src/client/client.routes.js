// rutas de cliente

import { Router } from 'express'
import {updateUser, deleteUser, updatePass, registerUser, loginUser, test } from './client.controller.js'
import { validateJwtClient } from '../../middlewares/validate.jwt.js'
import {cartValidator, newPasswordValidation, registerValidatorC} from '../../helpers/validators.js'
import {uploadProfilePictureC } from '../../middlewares/multer.upload.js'
import { loginValidator } from '../../helpers/validators.js'
import { deleteFileOnError } from '../../middlewares/delete.file.error.js'
import { getTopSellingProducts, getProduct, getProductsByCategory } from '../product/product.controller.js'
import { addToCart, getCart, removeFromCart, updateCart } from '../cart/cart.controller.js'
import { completePurchase, getPurchaseHistory } from '../purchase/purchase.controller.js'
const api = Router()

api.get('/test', validateJwtClient, test)


// Rutas públicas

api.post(
    '/register', 
    [
        uploadProfilePictureC.single('profilePictureC'),
        registerValidatorC, 
        deleteFileOnError
    ], 
    registerUser
)

api.post(
    '/login', 
    [
        loginValidator
    ], 
    loginUser
)

// Interracciones con productos
api.get(
    '/getTopSellingProducts/',
    [validateJwtClient],
    getTopSellingProducts
)

api.get(
    '/getCartItems/',
    [validateJwtClient],
    getCart
)

api.get(
   '/getPurchaseHistory/',
   [validateJwtClient],
   getPurchaseHistory
)

api.post(
    '/completePurchase/:cartId',
    [validateJwtClient],
    completePurchase
)


api.get('/product/:name', 
    [validateJwtClient], 
    getProduct
)

api.get('/getProductsByCategory/:name', [validateJwtClient], getProductsByCategory);

api.post(
    '/addToCart/',
    [validateJwtClient, cartValidator],
    addToCart
)

//Rutas privadas (Require el estar logeado)

api.put('/:id',
    [validateJwtClient],
    updateUser
)

api.delete('/:id',
    [validateJwtClient],
    deleteUser
)
 api.put('/update-pass/:id',
    [validateJwtClient],
    [newPasswordValidation],
    updatePass
)

api.put(
    '/updateUserSettings/:id',
    [validateJwtClient],
    updateUser
)

api.delete('/deleteMyAccount/:id',
    [validateJwtClient],
    deleteUser
)


// Rutas Carrito
api.delete(
    '/deleteCartProduct/:productId',
    [validateJwtClient],
    removeFromCart
)

api.put(
    '/updateCart/:cartId',
    [validateJwtClient],
    updateCart
)


export default api