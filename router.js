import express from 'express'
import Service from './service.js'
import Pagination from './pagination.js'

class Routes{
    constructor(){
        this.router = express.Router()
        this.getRoutes()
        this.postRoutes()
    }
    getRoutes(){
       this.router.get('/getAllMarketing', Service.getAllMarketing)
       this.router.get('/getAllPenjualan', Service.getAllPenjualan)
       this.router.get('/getAllPembayaran', Service.getAllPembayaran)
       this.router.get('/getAllPerhitungan', Service.getAllPerhitungan)
       this.router.get('/getMarketing', Service.getMarketing)
       this.router.get('/getUser', Service.getUser)
       this.router.get('/bayarKredit', Service.bayarKredit)
    }
    postRoutes(){
        this.router.post('/createUser', Service.createUser)
        this.router.post('/createMarketing', Service.createMarketing)
        this.router.post('/createPenjualan', Service.createPenjualan)
        this.router.post('/createPembayaran', Service.createPembayaran)
    }
}

export default new Routes().router