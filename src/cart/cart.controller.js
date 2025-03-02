//Controlador de Carrito
import Cart from './cart.model.js'
import  Product from '../product/product.model.js'
import mongoose from "mongoose";

// Agregar producto al carrito (asociado al usuario del token)
export const addToCart = async (req, res) => {
    try {
      
      const userId = req.user.id; 
  
    
      const { productId, quantity } = req.body;
  
      
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).send({ message: 'Product not found', success: false });
      }
  
      
      if (product.stock < quantity) {
        return res.status(400).send({ message: 'Not enough stock available', success: false });
      }
  
      
      let cart = await Cart.findOne({ userId });
  
      if (!cart) {
        cart = new Cart({ userId, items: [] });
      }
  
     
      const existingItem = cart.items.find(item => item.productId.toString() === productId);
  
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
       
        cart.items.push({ productId, quantity });
      }
  
      
      product.stock -= quantity;
  
      await product.save();
      await cart.save();
  
      return res.send({ success: true, message: 'Product added to cart', cart });
  
    } catch (err) {
      console.error('Error adding product to cart:', err);
      return res.status(500).send({ message: 'General error', success: false });
    }
  };

// Eliminar producto del carrito
export const removeFromCart = async (req, res) => {
        try {
          const productId = req.params.productId;
          
         
          if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).send({ message: 'Invalid product ID format', success: false });
          }
      
          
          const cart = await Cart.findOne({ userId: req.userId }); 
          if (!cart) {
            return res.status(404).send({ message: 'Cart not found', success: false });
          }
      
          
          const productIndex = cart.items.findIndex(item => item.productId.toString() === productId);
      
          if (productIndex === -1) {
            return res.status(404).send({ message: 'Product not found in cart', success: false });
          }
      
         
          cart.items.splice(productIndex, 1);
          await cart.save();
      
          
          return res.send({
            success: true,
            message: 'Product removed from cart successfully',
            updatedCart: cart 
          });
      
        } catch (error) {
          console.error('Error deleting product from cart:', error);
          return res.status(500).send({
            message: 'Error deleting product from cart',
            error,
            success: false
          });
        }
      };

//Actualizar el carrito
export const updateCart = async (req, res) => {
    try {
      const { productId, quantity } = req.body; 
      const { cartId } = req.params; 
  
      
      if (quantity < 1) {
        return res.status(400).send({ message: 'Quantity must be at least 1', success: false });
      }
  

      let cart = await Cart.findById(cartId); 
      if (!cart) {
        return res.status(404).send({ message: 'Cart not found', success: false });
      }
  
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).send({ message: 'Product not found', success: false });
      }
  
      if (product.stock < quantity) {
        return res.status(400).send({ message: 'Not enough stock available', success: false });
      }
  
      const productIndex = cart.items.findIndex(item => item.productId.toString() === productId);
  
      if (productIndex !== -1) {
       
        const previousQuantity = cart.items[productIndex].quantity;
  
        
        cart.items[productIndex].quantity = quantity;
  
       
        const stockChange = quantity - previousQuantity;
        product.stock -= stockChange;
  
       
  
       
        if (product.stock < 0) {
          return res.status(400).send({ message: 'Not enough stock available after the update', success: false });
        }
  
        
        await product.save();  
      } else {
       
        cart.items.push({ productId, quantity });
  
        product.stock -= quantity;
  
       
  

        if (product.stock < 0) {
          return res.status(400).send({ message: 'Not enough stock available for this product', success: false });
        }
  
     
        await product.save();  
  
       
      }
  
      await cart.save();
      return res.send({
        success: true,
        message: 'Cart updated successfully',
        updatedCart: cart
      });
    } catch (error) {
      console.error('Error updating cart:', error);
      return res.status(500).send({
        message: 'Error updating cart',
        error,
        success: false
      });
    }
  };
  
  




          
export const getCart = async (req, res) => {
    try {
         const userId = req.user.id;
          
            const cart = await Cart.findOne({ userId: userId });
          
              
              if (!cart || cart.items.length === 0) {
                return res.status(404).send({ message: "Cart doesn't have Items", success: false });
              }
              return res.send({
                success: true,
                message: 'Cart retrieved successfully',
                cart: cart
              });
            } catch (error) {
              console.error('Error retrieving cart:', error);
              return res.status(500).send({
                message: 'Error retrieving cart',
                error,
                success: false
              });
            }
          };