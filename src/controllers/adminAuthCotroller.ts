import {User} from "../models/Users";

const getUsers = async (req: any, res: any) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
const deleteUser = async (req:any,res:any)=>{
    const userId=req.params.id;
    try{
        const user=await User.findById(userId);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        const deltedUser=await User.findByIdAndDelete(userId);
        return res.status(200).json({message:"User deleted successfully",deltedUser});
    }
    catch(err:any){
        return res.status(500).json({ message: err.message });
    }
}