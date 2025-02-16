//Rutas de Administrador
import { Router } from 'express'
import { 
    deleteUser,
    getAllClient,
    getClient,
    loginAdmin,
    registerAdmin,
    test,
    updateUser
 } from './admin.controller.js'
import { validateJwt } from '../../middlewares/validate.jwt.js'
import { categoryValidator, loginValidator, registerValidator } from '../../helpers/validators.js'
import { uploadProfilePicture } from '../../middlewares/multer.upload.js'
import { deleteFileOnError } from '../../middlewares/delete.file.error.js'
import { addCategory, deleteCategory, getAllC, getCategory, updateCategory } from '../categories/category.controller.js'
// import { addProduct } from '../product/product.controller.js'
const api = Router()

//Rutas privadas

api.get('/test', validateJwt, test)

api.post(
    '/register', 
    [
        uploadProfilePicture.single('profilePicture'),
        registerValidator,
        deleteFileOnError
    ], 
    registerAdmin
)


api.post(
    '/login', 
    [
        loginValidator
    ], 
    loginAdmin
)

api.put(
    '/updateUser/:id',
    [validateJwt],
    updateUser
)

api.delete(
    '/deleteUser/:id',
    [validateJwt],
    deleteUser
)

api.get('/',
    [validateJwt],
    getAllClient
)

api.get('/C/',
    [validateJwt],
    getAllC
)
api.get(
    '/:id',
    [validateJwt],
    getClient
)

// Categorias (Administrador)

api.post(
    '/addC',
    [
    validateJwt,
    categoryValidator
    ]
    ,
    addCategory
)



api.get('/categorie/:id',
    [validateJwt],
    getCategory
)

api.put(
    '/updateC/:id',
    [validateJwt],
    updateCategory
)

api.delete(
    '/deleteC/:id',
    [validateJwt],
    deleteCategory
)


export default api
