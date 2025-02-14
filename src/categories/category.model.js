// Modelo de Categoria

import {Schema, model} from 'mongoose'

const categorySchema = Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            maxLength: [25, `Can't be overcome 25 characters`],
        },
        description: {
            type: String,
            required: [true, 'Name is required'],
            maxLength: [25, `Can't be overcome 25 characters`],
        },
    },
    {
        timestamps: true
    }
)

export default model('Category', categorySchema)