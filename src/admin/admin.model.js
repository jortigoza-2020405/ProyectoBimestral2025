//Modelo de administrador

import { Schema, model } from 'mongoose'

const adminSchema = Schema(
    {  
        name: {
            type: String,
            required: [true, 'Name is required'],
            maxLength: [25, `Can't be overcome 25 characters`],
        },
        surname: {
            type: String,
            required: [true, 'Surname is required'],
            maxLength: [25, `Can't be overcome 25 characters`],
        },
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            maxLength: [15, `Can't be overcome 15 characters`],
        },
        email: {
            type: String,
            //Vamos a ver que pasa si no es único
            unique: true,
            required: [true, 'Email is required'],
            //match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minLength: [8, 'Password must be 8 characters'],
            maxLength: [100, `Can't be overcome 100 characters`],
            //match: [/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm]
        },
        profilePicture : {
            type: String
        },
        phone: {
            type: String,
            required: [true, 'Phone is required'],
            maxLength: [13, `Can't be overcome 8 numbers`],
            minLength: [8, 'Phone must be 8 numbers']
        },
        role: {
            type: String,
            required: [true, 'Role is required'],
            uppercase: true,
            enum: ['ADMIN', 'CLIENT']
        },
        status: {
            type: Boolean,
            default: true
        }
    }
)

adminSchema.methods.toJSON = function(){
    const { __v, password, ...admin} = this.toObject() 
    return admin
}

//Crear y exportar el modelo
export default model('Admin', adminSchema)