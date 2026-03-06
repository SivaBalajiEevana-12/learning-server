import mongoose from "mongoose";
export interface Imodule extends mongoose.Document{
    title:string;
    content:string;
    course:mongoose.Types.ObjectId;
    video:mongoose.Types.ObjectId;
    test:mongoose.Types.ObjectId;
    duration?:number;
}
export interface IVideo extends mongoose.Document{
    module:mongoose.Types.ObjectId;
    url:string;
    title:string;
    description:string;
    duration:number;
} 
export interface ITest extends mongoose.Document{
    module:mongoose.Types.ObjectId;
    questions:{question:string;options:string[];answer:string}[];
}
const TestSchema = new mongoose.Schema<ITest>({
    module:{type:mongoose.Schema.Types.ObjectId,ref:'Module',required:true},
    questions:[{
        question:{type:String,required:true},
        options:[{type:String,required:true}],
        answer:{type:String,required:true}
    }]
})
const Test = mongoose.model<ITest>('Test',TestSchema);

const ModuleSchema = new mongoose.Schema<Imodule>({
    title:{type:String,required:true},
    content:{type:String,required:true},
    course:{type:mongoose.Schema.Types.ObjectId,ref:'Course',required:true},
    video:{type:mongoose.Schema.Types.ObjectId,ref:'Video'},
    duration:{type:Number}
})
const VideoSchema = new mongoose.Schema<IVideo>({
    module:{type:mongoose.Schema.Types.ObjectId,ref:'Module',required:true},
    url:{type:String,required:true},
    title:{type:String,required:true},
    description:{type:String,required:true},
    duration:{type:Number,required:true}
})
const Video = mongoose.model<IVideo>('Video',VideoSchema);  
const Module = mongoose.model<Imodule>('Module',ModuleSchema);
export {Module,Video,Test};