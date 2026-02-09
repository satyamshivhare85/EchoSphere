import mongoose from "mongoose";

const connectDb=async()=>{
    try{
        mongoose.connect(process.env.MONGODB_URL,{
            dbname:"echoSphere"
        })
        console.log("DB connected")
    }
    catch(error){
console.log("error in db")
    }
    
}
export default connectDb;