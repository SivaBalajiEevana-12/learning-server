import jwt from "jsonwebtoken";
import { User } from "../models/Users";
 const authMiddleware=async(req:any,res:any,next:any)=>{
    const token=req.cookies.token;
    if(!token){
        return res.status(401).json({message:"Unauthorized"});
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY as string);
        console.log("decoded",decoded);
        req.userId=(decoded as any).id;
        next();
    }
    catch(err:any){
         return res.status(401).json({message:"Invalid token"});
    }
 }
 const adminMiddleware=async(req:any,res:any,next:any)=>{
    const token=req.cookies.token;
    if(!token){
        return res.status(401).json({message:"Unauthorized"});
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY as string);
        console.log("decoded",decoded);
        req.userId=(decoded as any).id;
        const user=await User.findById(req.userId);
        if(user?.role!=="admin"){
            return res.status(403).json({message:"Forbidden"});
        }
        next();
    }
    catch(err:any){
         return res.status(401).json({message:"Invalid token"});
    }
 }
    export default authMiddleware;