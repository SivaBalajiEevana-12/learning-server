import mongoose from "mongoose";
export interface ICourse extends mongoose.Document{
    title:string;
    description:string;
    instructor:mongoose.Types.ObjectId;
    price:number;
    category:string;
    published:boolean;
    studentsEnrolled:mongoose.Types.ObjectId[];
    modules:mongoose.Types.ObjectId[];
    countEnrolled:number;
    rating:number;
    comments:mongoose.Types.ObjectId[];
}
const CourseSchema = new mongoose.Schema<ICourse>({
    title:{type:String,required:true},
    description:{type:String,required:true},
    instructor:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    price:{type:Number,required:true},
    category:{type:String,required:true},
    published:{type:Boolean,default:false},
    studentsEnrolled:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
    modules:[{type:mongoose.Schema.Types.ObjectId,ref:'Module'}],
    countEnrolled:{type:Number,default:0},
    rating:{type:Number,default:0},
    comments:[{type:mongoose.Schema.Types.ObjectId,ref:'Comment'}]
})
const Course = mongoose.model<ICourse>('Course',CourseSchema);
export {Course};