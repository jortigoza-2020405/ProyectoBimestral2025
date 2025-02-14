//Validaciones en relación a la BD

import Admin from '../src/admin/admin.model.js'

export const existUsername = async(username)=>{
    const alreadyUsername = await Admin.findOne({username})
    if(alreadyUsername){
        console.error(`Username ${username} is already taken`)
        throw new Error(`Username ${username} is already taken`)
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