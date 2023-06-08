import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

export default async function(){
    try{
        mongoose.set('strictQuery', false)
        return await mongoose.connect(process.env.MONGO_URI)
    }catch(err){ 
        console.error(err.message)
        return process.exit(1)
    }
}