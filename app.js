import express from 'express'
import Routes from './router.js'
import connect from './db/connect.js'
import layout from 'express-ejs-layouts'
import dotenv from 'dotenv'
dotenv.config()

class App{
    constructor(){
        this.port = process.env.PORT || 8000
        this.app = express()
        this.middleware()
        this.connection()
    }
    middleware(){
        // this.app.set('view engine', 'ejs')
        // this.app.use(layout())
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(Routes)
    }
    connection(){
        connect().then(()=> this.app.listen(process.env.PORT, ()=>console.info(`Menjalankan Server dan Database Pada http://localhost:${process.env.PORT}`)))
    }
}

const app = new App().app