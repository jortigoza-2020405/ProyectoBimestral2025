// Modelo de Carrito de Compras

import { Schema, model } from 'mongoose';

const cartSchema = new Schema({
  items: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1']
      }
    }
  ]
}, { timestamps: true });

export default model('Cart', cartSchema);

