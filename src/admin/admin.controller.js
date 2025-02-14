//Controlador de Administrador
import { checkPassword, encrypt } from '../../utils/encrypt.js'
import { generateJwt } from '../../utils/jwt.js'
import Admin from '../admin/admin.model.js'
import userModel from '../client/client.model.js'

//test
export const test = (req, res)=>{
    console.log('test is running')
    return res.send({message: 'Test is running'})
}

//Registro de un usuario (Administrador)
export const registerAdmin = async(req, res)=>{
    try{
        let data = req.body
        let admin = new Admin(data)

        admin.password = await encrypt(admin.password)
        await admin.save()
        return res.send({message: `Registered successfully, can be logged with username: ${admin.username} welcome to our company`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'General error with registering user', err})
    }
}

//Login (Administrador)
export const loginAdmin = async(req, res)=>{
    try{

        let { userLoggin, password } = req.body
        let admin = await Admin.findOne(
            {
                $or: [
                    {email: userLoggin},
                    {username: userLoggin}
                ]
            }
        )
        if(Admin && await checkPassword(admin.password, password)) {
            let loggedUser = {
                uid: admin._id,
                name: admin.name,
                username: admin.username,
                role: admin.role
            }
            let token = await generateJwt(loggedUser)

            return res.send(
                {
                    message: `Welcome ${admin.name}`,
                    loggedUser,
                    token
                }
            )
        }
        return res.status(400).send({message: 'Wrong email or password'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'General error with login function'})
    }
}

// Editar usuario (Administrador)

export const updateUser = async(req, res)=>{
    try{      
        let id = req.params.id
        let data = req.body
   
        let updatedUser = await userModel.findByIdAndUpdate( 
            id,
            data,
            {new: true} 
        )
        if(!updatedUser) return res.status(404).send({message: 'User not found and not updated', success: false})
        return res.send({message: 'User updated successfully', updatedUser})
    }catch(error){
        console.error('General error', error)
        return res.status(500).send({message: 'General error', error,  success: false})
    }
}

//Eliminar
export const deleteUser = async(req, res)=>{
    try{
        
        let id = req.params.id

        let deletedUser = await userModel.findByIdAndDelete({_id: id})
        if(!deletedUser) return res.status(404).send({message: 'User not found, not deleted',  success: false})
        return res.send({message: 'Deleted user successfully', deletedUser})
    }catch(error){
        console.error('General error', error)
        return res.status(500).send({message: 'General error', error,  success: false})
    }
}