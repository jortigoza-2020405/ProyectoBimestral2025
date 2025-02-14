// rutas de cliente

import { Router } from 'express'
import {updateUser, deleteUser, updatePass, registerUser, loginUser } from './client.controller.js'
import { validateJwt } from '../../middlewares/validate.jwt.js'
import {newPasswordValidation} from '../../helpers/validators.js'
import { uploadProfilePicture } from '../../middlewares/multer.upload.js'
import { loginValidator, registerValidator } from '../../helpers/validators.js'
import { deleteFileOnError } from '../../middlewares/delete.file.error.js'

const api = Router()

// Rutas públicas

api.post(
    '/register', 
    [
        uploadProfilePicture.single('profilePicture'),
        registerValidator,
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


//Rutas privadas

api.put('/:id',
    [validateJwt],
    updateUser
)

api.delete('/:id',
    [validateJwt],
    deleteUser
)
 api.put('/update-pass/:id',
    [validateJwt],
    [newPasswordValidation],
    updatePass
)

export default api