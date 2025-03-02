//Validaciones en relación a la BD

import Admin from '../src/admin/admin.model.js'
import User from '../src/client/client.model.js'
import Category from '../src/category/category.model.js'
import Product from '../src/product/product.model.js'

export const existUsername = async(username)=>{
    const alreadyUsername = await Admin.findOne({username})
    if(alreadyUsername){
        console.error(`Username ${username} is already taken`)
        throw new Error(`Username ${username} is already taken`)
    }
}

export const existUsernameC = async(username)=>{
    const alreadyUsername = await User.findOne({username})
    if(alreadyUsername){
        console.error(`Username ${username} is already taken`)
        throw new Error(`Username ${username} is already taken`)
    }
}

export const existEmailC = async(email)=>{
    const alreadyEmail = await Admin.findOne({email}) 
        if(alreadyEmail){
        console.error(`Email ${email} is already taken`)
        throw new Error(`Email ${email} is already taken`)
    }
}


export const existEmail = async(email)=>{
    const alreadyEmail = await Admin.findOne({email}) 
        if(alreadyEmail){
        console.error(`Email ${email} is already taken`)
        throw new Error(`Email ${email} is already taken`)
    }
}

export const findUser = async(id)=>{
    try{
        const userExist = await Admin.findById(id)
        if(!userExist) return false
        return userExist
    }catch(err){
        console.error(err)
        return false
    }
}

export const findClient = async(id)=>{
    try{
        const userExist = await User.findById(id)
        if(!userExist) return false
        return userExist
    }catch(err){
        console.error(err)
        return false
    }
}

export const existCategory = async(name)=>{
    const alreadyCategory = await Category.findOne({name})
    if(alreadyCategory){
        console.error(`Name ${name} is already taken`)
        throw new Error(`Name ${name} is already taken`)
    }
}

export const existProduct = async(productName)=>{
    const alreadyProduct = await Product.findOne({productName})
    if(alreadyProduct){
        console.error(`Name ${productName} is already taken`)
        throw new Error(`Name ${productName} is already taken`)
    }
}