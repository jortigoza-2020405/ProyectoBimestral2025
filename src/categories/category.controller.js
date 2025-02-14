import Category from '../categories/category.model.js'
import categoryModel from '../categories/category.model.js'

//Crear una categoria (Administrador)
export const addCategory = async(req, res) => {
    try {
        const data = req.body
        const category = new Category(data)
 
        await category.save()
        return res.send({success: true,  message: `${category.name} saved successfully`})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'General error when adding category',  success: false})
    }
}

export const getAllC = async(req, res)=>{
    try{
        const { limit = 20, skip = 0 } = req.query
        const category = await Category.find()
            .skip(skip)
            .limit(limit)
 
        if(category.length === 0) return res.status(404).send({message: 'category not found', success: false})
        return res.send(
            {
                success: true,
                message: 'category found: ',
                category,
                total: category.length
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

export const getCategory = async(req, res)=>{
    try {
        const { id } = req.params
        const category = await categoryModel.findById(id)
    if(!category) return res.status(404).send(
        {
            success: false,
            message: 'Category not found',  success: false
        }
    )
    return res.send(
        {
            success: true,
            message: 'Category found',success: true,
            category
        }
    )
} catch (error) {
        console.error(error)
            return res.status(500).send({message: 'General error', error,  success: false})
    }
}

// Actualizar categoria (Administrador)

export const updateCategory = async(req, res)=>{
    try{      
        let id = req.params.id
        let data = req.body
   
        let updatedCategory = await categoryModel.findByIdAndUpdate( 
            id,
            data,
            {new: true} 
        )
        if(!updatedCategory) return res.status(404).send({message: 'Category not found and not updated', success: false})
        return res.send({message: 'Category updated successfully', updatedCategory, success: true})
    }catch(error){
        console.error('General error', error)
        return res.status(500).send({message: 'General error', error,  success: false})
    }
}

//Eliminar categoria (Administrador)
export const deleteCategory = async(req, res)=>{
    try{
        
        let id = req.params.id

        let deletedCategory = await categoryModel.findByIdAndDelete({_id: id})
        if(!deletedCategory) return res.status(404).send({message: 'Categorie not found, not deleted', success: false})
        return res.send({message: 'Deleted Categorie successfully', deletedCategory,  success: true})
    }catch(error){
        console.error('General error', error)
        return res.status(500).send({message: 'General error', error,  success: false})
    }
}