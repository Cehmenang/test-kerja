import express from 'express'
import Controller from './controller.js'

class Routes{
    constructor(){
        this.router = express.Router()
        this.getRoutes()
        this.postRoutes()
    }
    getRoutes(){
        this.router.get('/test', (req, res)=>res.json({ test: 'test response!' }))
    }
    postRoutes(){
        this.router.post('/createMarketing', Controller.createMarketing)
    }
}

export default new Routes().router