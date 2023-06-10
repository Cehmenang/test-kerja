import express from 'express'
import Routes from './router.js'
import connect from './db/connect.js'
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()

// Class yang memuat base aplikasi, seperti server, middleware, dan menjalankan routing
class App{
    constructor(){
        this.port = process.env.PORT || 8000
        this.app = express()
        this.middleware()
        this.connection()
    }
    // Fungsi atau Method yang memuat berbagai Middleware yang akan dijalankan sebelum menjalankan server
    middleware(){
        this.app.use(cors({ origin: '*', credentials: true }))
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(Routes)
    }
    // Fungsi atau Method yang memanggil koneksi database sekaligus menjalankan server
    connection(){
        connect().then(()=> this.app.listen(process.env.PORT, ()=>console.info(`Menjalankan Server dan Database Pada http://localhost:${process.env.PORT}`)))
    }
}

const app = new App().app