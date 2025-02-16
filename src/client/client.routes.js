// rutas de cliente

import { Router } from 'express'
import {updateUser, deleteUser, updatePass, registerUser, loginUser, test } from './client.controller.js'
import { validateJwtClient } from '../../middlewares/validate.jwt.js'
import {newPasswordValidation, registerValidatorC} from '../../helpers/validators.js'
import {uploadProfilePictureC } from '../../middlewares/multer.upload.js'
import { loginValidator } from '../../helpers/validators.js'
import { deleteFileOnError } from '../../middlewares/delete.file.error.js'

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

export default api