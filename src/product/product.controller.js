//Controlador de Producto
import Product from './product.model.js'
import productModel from './product.model.js'
import Category from '../category/category.model.js'

//Añadir un producto (Administrador)
export const addProduct = async(req, res) => {
    try {
        let data = req.body
        let product = new Product(data)
 
        await product.save()
        return res.send({success: true,  message: `${product.productName},with id ${product.id} saved successfully`})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'General error when adding product',  success: false})
    }
}

//Oferta de un Producto (Administrador)
export const applyOfferToProduct = async (req, res) => {
  let  id  = req.params.id; 
  let { discount, offerExpiryDate } = req.body; 

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const originalPrice = product.price;
    const discountedPrice = originalPrice - (originalPrice * (discount / 100));

    product.offer = true; 
    product.originalPrice = originalPrice; 
    product.discount = discount;
    product.discountedPrice = discountedPrice; 
    product.offerExpiryDate = new Date(offerExpiryDate); 

    await product.save();

    return res.status(200).json({ message: 'Offer applied successfully', product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error applying offer', error });
  }
};

export const getAllProducts = async(req, res)=>{
    try{
        const { limit = 20, skip = 0 } = req.query
        const product = await Product.find()
            .skip(skip)
            .limit(limit)
 
        if(product.length === 0) return res.status(404).send({message: 'product not found', success: false})
        return res.send(
            {
                success: true,
                message: 'products found: ',
                product,
                total: product.length
            }
        )
    }catch(err){
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error',
                err
            }
        )
    }
}


export const getProduct = async (req, res) => {
    try {
        const { name } = req.params;

        const products = await productModel.find({
            productName: new RegExp(name, 'i') 
        });

        if (products.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No products found',
            });
        }

        return res.send({
            success: true,
            message: 'Products found',
            products,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            message: 'General error',
            error,
            success: false,
        });
    }
};

// Actualizar un producto (Administrador)

export const updateProduct = async(req, res)=>{
    try{      
        let id = req.params.id
        let data = req.body
   
        let updatedProduct = await productModel.findByIdAndUpdate( 
            id,
            data,
            {new: true} 
        )
        if(!updatedProduct) return res.status(404).send({message: 'Product not found and not updated', success: false})
        return res.send({message: 'Product updated successfully', updatedProduct, success: true})
    }catch(error){
        console.error('General error', error)
        return res.status(500).send({message: 'General error', error,  success: false})
    }
}

// Obtener el control de inventario (Administrador)
export const getInventoryControl = async (req, res) => {
    try {
      const products = await Product.find().select('productName stock');
  
      if (!products || products.length === 0) {
        return res.status(404).send({
          message: 'No products found',
          success: false,
        });
      }
  
      return res.send({
        message: 'Inventory control fetched successfully',
        products,
        success: true,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        message: 'Error fetching inventory control',
        error,
        success: false,
      });
    }
  };

// Obtener productos que no tengan Stock o disponibilidad (Administrador)
  export const getOutOfStockProducts = async (req, res) => {
    try {
      const outOfStockProducts = await Product.find({ stock: 0 });
  
      if (outOfStockProducts.length === 0) {
        return res.status(404).send({
          message: 'No out of stock products found',
          success: false
        });
      }
  
      return res.send({
        success: true,
        message: 'Out of stock products found',
        outOfStockProducts
      });
  
    } catch (error) {
      console.error('Error fetching out of stock products:', error);
      return res.status(500).send({
        message: 'Error fetching out of stock products',
        error,
        success: false
      });
    }
  };

// Obtener los productos que han sido más vendidos (Administrador y Cliente)

  export const getTopSellingProducts = async (req, res) => {
    try {
     
      const topSellingProducts = await Product.find()
        .sort({ salesCount: -1 })  
        .limit(10);  
  
      if (topSellingProducts.length === 0) {
        return res.status(404).send({
          message: 'No top-selling products found',
          success: false
        });
      }
  
      return res.send({
        success: true,
        message: 'Top-selling products found',
        topSellingProducts
      });
  
    } catch (error) {
      console.error('Error fetching top-selling products:', error);
      return res.status(500).send({
        message: 'Error fetching top-selling products',
        error,
        success: false
      });
    }
  };

//Eliminar Producto (Administrador)
export const deleteProduct = async(req, res)=>{
    try{
        
        let id = req.params.id

        let deletedProduct = await productModel.findByIdAndDelete({_id: id})
        if(!deletedProduct) return res.status(404).send({message: 'Product not found, not deleted', success: false})
        return res.send({message: 'Deleted Product successfully', deletedProduct,  success: true})
    }catch(error){
        console.error('General error', error)
        return res.status(500).send({message: 'General error', error,  success: false})
    }
}  
  
// Obtener productos filtrados por el nombre de la categoría (Cliente)
export const getProductsByCategory = async (req, res) => {
    try {
      const categoryName = req.params.name; // Obtener el nombre de la categoría desde los parámetros
  

      const category = await Category.findOne({ name: { $regex: new RegExp(`^${categoryName}$`, 'i') } });
  
      if (!category) {
        return res.status(404).send({ message: 'Category not found', success: false });
      }
  
      
      const products = await Product.find({ category: category._id });
  
      if (!products || products.length === 0) {
        return res.status(404).send({ message: 'No products found in this category', success: false });
      }
  
      return res.send({
        success: true,
        message: 'Products retrieved successfully',
        products
      });
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return res.status(500).send({
        message: 'Error fetching products by category',
        error,
        success: false
      });
    }
  };

  



