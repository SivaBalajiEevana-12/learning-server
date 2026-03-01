import mongoose from 'mongoose';

const connectDB= async()=>{
    mongoose.connect(process.env.MONGO_URI)
    mongoose.connection.on('connected',()=>{
        console.log("connected to mongoDB");
    })
    mongoose.connection.on('error',(err)=>{
        console.log(err);
    })
}
export default connectDB;