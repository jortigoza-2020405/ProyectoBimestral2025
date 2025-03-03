import Order from "./purchase.model.js";
import Cart from "../cart/cart.model.js";
import Product from "../product/product.model.js";


//Proceso de compras (Cliente)
export const completePurchase = async (req, res) => {
  try {
    const { paymentMethod, shippingAddress, NIT } = req.body;
  
    if (!paymentMethod || !shippingAddress || !NIT ) {
      return res.status(400).send({ message: "Payment method and shipping address are required", success: false });
    }
  
    const cart = await Cart.findById(req.params.cartId); 
  
    if (!cart || cart.items.length === 0) {
      return res.status(400).send({ message: "Cart is empty", success: false });
    }
  
    let total = 0;
    const productsDetails = [];  
    for (let item of cart.items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).send({ message: "Product not found", success: false });
      }
  
      if (product.stock < item.quantity) {
        return res.status(400).send({ message: `Not enough stock for ${product.productName}`, success: false });
      }
  
      const productTotal = product.price * item.quantity;
      total += productTotal;
  
      productsDetails.push({
        productName: product.productName,
        quantity: item.quantity,
        price: product.price,
        productTotal,
      });
  
      // Disminuir el stock del producto
      product.stock -= item.quantity;
      // Actualizar el salesCount de los productos comprados
      product.salesCount += item.quantity;
      await product.save(); // Guardar el producto con la nueva cantidad de ventas
    }
  
    const taxPercentage = 12;
  
    const order = new Order({
      cartId: cart._id,
      total: total,
      paymentMethod,
      shippingAddress,
      NIT
    });
  
    await order.save();
  
    // Vaciar el carrito después de la compra
    cart.items = [];
    await cart.save();
  
    return res.send({
      success: true,
      message: "Purchase completed successfully",
      order,
      productsDetails,
      taxPercentage, 
      totalWithTax: total.toFixed(2),
    });
  } catch (error) {
    console.error("Error completing purchase:", error);
    return res.status(500).send({
      message: "Error completing purchase",
      error,
      success: false,
    });
  }
}  

// Historial de compras (Cliente)

export const getPurchaseHistory = async (req, res) => {
  try {
    const userId = req.user.id;  

    const orders = await Order.find({ userId }).sort({ orderDate: -1 }); // Ordenar por fecha de la compra, de la más reciente a la más antigua
    
    if (orders.length === 0) {
      return res.status(404).send({
        message: "No purchase history found",
        success: false
      });
    }

    return res.send({
      success: true,
      message: "Purchase history retrieved successfully",
      orders
    });
  } catch (error) {
    console.error("Error retrieving purchase history:", error);
    return res.status(500).send({
      message: "Error retrieving purchase history",
      error,
      success: false
    });
  }
};

export const editInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;  // ID de la orden a editar
    const { items } = req.body;  // Nuevos productos y cantidades para la orden
    
    // Buscamos la orden
    let order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).send({ message: "Order not found", success: false });
    }

    // Recorremos los nuevos items y validamos stock
    let totalAmount = 0;
    for (const item of items) {
      const { productId, quantity } = item;
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).send({ message: `Product ${productId} not found`, success: false });
      }

      // Verificar si el stock es suficiente
      if (product.stock < quantity) {
        return res.status(400).send({
          message: `Not enough stock for product ${productId}. Available: ${product.stock}, Requested: ${quantity}`,
          success: false
        });
      }

      // Actualizar el stock del producto
      product.stock -= quantity;
      await product.save();

      // Calcular el total de la factura
      totalAmount += product.price * quantity;
    }

    // Actualizamos los productos de la orden
    order.items = items;
    order.total = totalAmount;  // Calculamos el nuevo total
    await order.save();

    return res.send({
      success: true,
      message: "Invoice updated successfully",
      order
    });

  } catch (error) {
    console.error("Error editing invoice:", error);
    return res.status(500).send({ message: "Error editing invoice", error, success: false });
  }
};

// Obtener facturas por usuarios especificos (Administrador)
export const getUserInvoices = async (req, res) => {
    try {
      const userId = req.user.id;  
      
      const orders = await Order.find({ userId }).sort({ orderDate: -1 });  // Ordenamos por fecha descendente
      
      if (orders.length === 0) {
        return res.status(404).send({ message: "No invoices found for this user", success: false });
      }
  
      return res.send({
        success: true,
        message: "Invoices retrieved successfully",
        orders
      });
    } catch (error) {
      console.error("Error fetching invoices:", error);
      return res.status(500).send({ message: "Error fetching invoices", error, success: false });
    }
  };
  