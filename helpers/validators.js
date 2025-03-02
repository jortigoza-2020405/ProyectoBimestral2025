//Validar campos en las rutas
import { body } from "express-validator" //Capturar todo el body de la solicitud
import { validateErrors, validateErrorWithoutImg } from "./validate.error.js"
import { existUsername, existEmail, existCategory, existUsernameC, existEmailC, existProduct } from "./db.validators.js"

export const registerValidator = [
    body('name', 'Name cannot be empty')
        .notEmpty(),
    body('surname', 'Surname cannot be empty')
        .notEmpty(),
    body('email', 'Email cannot be empty or is not a valid email')
        .notEmpty()
        .isEmail()
        .custom(existEmail),
    body('username', 'Username cannot be empty')
        .notEmpty()
        .toLowerCase()
        .custom(existUsername),
    body('password', 'Password cannot be empty')
        .notEmpty()
        .isStrongPassword()
        .withMessage('The password must be strong')
        .isLength({min: 8}),
    body('phone', 'Phone cannot be empty or is not a valid phone')
        .notEmpty()
        .isMobilePhone(),
    validateErrors
]


export const registerValidatorC = [
    body('name', 'Name cannot be empty')
        .notEmpty(),
    body('surname', 'Surname cannot be empty')
        .notEmpty(),
    body('email', 'Email cannot be empty or is not a valid email')
        .notEmpty()
        .isEmail()
        .custom(existEmailC),
    body('username', 'Username cannot be empty')
        .notEmpty()
        .toLowerCase()
        .custom(existUsernameC),
    body('password', 'Password cannot be empty')
        .notEmpty()
        .isStrongPassword()
        .withMessage('The password must be strong')
        .isLength({min: 8}),
    body('phone', 'Phone cannot be empty or is not a valid phone')
        .notEmpty()
        .isMobilePhone(),
    validateErrors
]

export const loginValidator = [
    body('userLoggin', 'Username or email cannot be empty')
        .notEmpty()
        .toLowerCase(),
    body('password', 'Password cannot be empty')
        .notEmpty()
        .isStrongPassword()
        .withMessage('The password must be strong')
        .isLength({min: 8}),
        validateErrorWithoutImg
]

export const newPasswordValidation = [
    body('newPassword', 'NewPassword cannot be empty').notEmpty().isStrongPassword().isLength({min: 8}),
    validateErrorWithoutImg

]

export const categoryValidator = [
    body('name', 'Name cannot be empty')
        .notEmpty().custom(existCategory),
    body('description', 'Description cannot be empty')
        .notEmpty(),
        validateErrorWithoutImg
]

export const productValidator = [
    body('productName', 'Product name cannot be empty')
        .notEmpty().custom(existProduct),
    body('description', 'Description cannot be empty')
        .notEmpty(),
    body('price', 'Price cannot be empty or is not a valid')
        .notEmpty(),
    body('stock', 'Stock cannot be empty')
        .notEmpty(),
    body('category', 'Category cannot be empty')
        .notEmpty(),
    body('brand', 'Brand cannot be empty')
        .notEmpty(),
    validateErrors
]

export const cartValidator = [
    body('productId', 'Product ID cannot be empty')
        .notEmpty(),
    body('quantity', 'Description cannot be empty')
        .notEmpty(),
    validateErrorWithoutImg
]