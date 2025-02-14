//Rutas de Administrador
import { Router } from 'express'
import { 
    loginAdmin,
    registerAdmin,
    test
 } from './admin.controller.js'
import { validateJwt } from '../../middlewares/validate.jwt.js'
import { loginValidator, registerValidator } from '../../helpers/validators.js'
import { uploadProfilePicture } from '../../middlewares/multer.upload.js'
import { deleteFileOnError } from '../../middlewares/delete.file.error.js'
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

export default api
