import e from "express";
import { Course } from "../models/Course";
import { User } from "../models/Users";
import { Module,Video,Test} from "models/Module";

const createCourse = async(req:any,res:any)=>{
    const id=req.user._id;
    const {title,description,instructor,price,category}=req.body;
    const user=await User.findById(id);
    if(!user){
        return res.status(404).json({message:"User not found"});
    }
    if(user.role!=="instructor"){
        return res.status(403).json({message:"Only instructors can create courses"});
    }
    try{
        const course = new Course({
            title,description,instructor:id,price,category
        })
        const savedCourse=await course.save();
        user.publishedCourse?.push(savedCourse._id);
        await user.save();
        return res.status(201).json({message:"Course created successfully",course:savedCourse
        })
    }
    catch(err:any){ 
        return res.status(500).json({ message: err.message });
    }
}
export {createCourse};