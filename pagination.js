import { Marketing } from './db/schema.js'

class Pagination{

    entry(req, res){
        return res.status(200).render('entry', { layout: 'main', title: 'Entry Page', style: 'entry' })
    }

    createMarketing(req, res){ 
        return res.status(200).render('createMarketing', { layout: 'main', title: 'Create Marketing Page', style: 'createMarketing' }) 
    }

    async createPenjualan(req, res){
        const marketings = await Marketing.find()
        return res.status(200).render('createPenjualan', { layout: 'main', title: 'Create Penjualan Page', style: 'createPenjualan', marketings })
    }

    redirect(req, res){
        return res.status(200).redirect('/')
    }
    
}

export default new Pagination()