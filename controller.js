import { Marketing } from './db/schema.js'

class Controller{
    async createMarketing(req, res){
        try{
            await Marketing.create(req.body)
            return res.status(200).json({ msg: "akun berhasil dibuat!" })
        }catch(err){ res.status(400).json({ msg: err.message }) }
    }
}

export default new Controller()