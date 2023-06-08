import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
const mongoURI = `mongodb+srv://Cehmenang:aOMmmXqRk601FEVP@cehmenang.0fs07tp.mongodb.net/Dummy?retryWrites=true&w=majority`

export default async function(){
    try{
        mongoose.set('strictQuery', false)
        return await mongoose.connect(process.env.MONGO_URI || mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    }catch(err){ 
        console.error(err.message)
        return process.exit(1)
    }
}