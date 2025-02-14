//Configurar el servidor express (HTTP)
'use strict'
import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet' 
import cors from 'cors' 
import { limiter } from '../middlewares/rate.limit.js'
import adminRoutes from '../src/admin/admin.routes.js'
import clientRoutes from '../src/client/client.routes.js'

const configs = (app)=>{
    app.use(express.json())
    app.use(express.urlencoded({extended: false}))
    app.use(cors())
    app.use(helmet())
    app.use(limiter)
    app.use(morgan('dev'))
    
}

 
export const initServer = async()=>{
    const app = express()
    try {
        configs(app) 
        routes(app)
        app.listen(process.env.PORT)
        console.log(`Server running in port ${process.env.PORT}`)
        
    } catch (err) {
        console.error('Servidor init failed', err)
    }
}

const routes = (app)=>{
    app.use('/v1/admin', adminRoutes)
    app.use('/v1/client', clientRoutes)
}
