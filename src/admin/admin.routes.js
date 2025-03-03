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
import { categoryValidator, loginValidator, productValidator, registerValidator } from '../../helpers/validators.js'
import { uploadProfilePicture, uploadProductPicture } from '../../middlewares/multer.upload.js'
import { deleteFileOnError } from '../../middlewares/delete.file.error.js'
import { addCategory, deleteCategory, getAllCategories, getCategory, updateCategory } from '../category/category.controller.js'
import { addProduct, applyOfferToProduct, deleteProduct, getAllProducts, getInventoryControl, getOutOfStockProducts, getProduct, getTopSellingProducts, updateProduct } from '../product/product.controller.js'
import { editInvoice, getUserInvoices } from '../purchase/purchase.controller.js'
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

// Productos (Administrador)
api.post(
    '/addProduct',
    [
    validateJwt,
    uploadProductPicture.single('productPicture'),
    productValidator,
    deleteFileOnError
    ],
    addProduct
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

// Obtener todos 

api.get('/allClients/',
    [validateJwt],
    getAllClient
)

api.get('/allCategories/',
    [validateJwt],
    getAllCategories
)

api.get('/allProducts/',
    [validateJwt],
    getAllProducts
)

api.get(
    '/getOutOfStockProducts/',
    [validateJwt],
    getOutOfStockProducts
)

api.get(
    '/getTopSellingProducts/',
    [validateJwt],
    getTopSellingProducts
)


api.get(
    '/getOne/:id',
    [validateJwt],
    getClient
)

// Categorias (Administrador)

api.post(
    '/addCategory',
    [
    validateJwt,
    categoryValidator
    ]
    ,
    addCategory
)

// Busquedas por nombre categorias y productos

api.get('/category/:name',
    [validateJwt],
    getCategory
)

api.get('/product/:name', 
    [validateJwt], 
    getProduct
)



api.put(
    '/updateCategory/:id',
    [validateJwt],
    updateCategory
)

api.delete(
    '/deleteCategory/:id',
    [validateJwt],
    deleteCategory
)

// Productos (Administrador)

api.put(
    '/addProductOffer/:id',
    [validateJwt],
    applyOfferToProduct
)

api.put(
    '/updateProduct/:id',
    [validateJwt],
    updateProduct
)

api.get(
    '/getInventaryControl/',
    [validateJwt],
    getInventoryControl
)

api.delete(
    '/deleteProduct/:id',
    [validateJwt],
    deleteProduct
)

// Funciones de factura (Administrador)
api.put(
    '/editInvoice/:orderId',
    [validateJwt],
    editInvoice
)

api.get(
    '/getUserInvoices/:userId',
    [validateJwt],
    getUserInvoices
)



export default api
