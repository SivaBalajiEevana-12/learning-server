import mongoose  from "mongoose";
export interface Iuser extends mongoose.Document{
    userName:string;
    firstName:string;
    lastName:string;
    email:string;
    role:"user"|"admin"|"instructor";
    phoneNumber?:string;
    password:string;
    jwt?:string;
    Address?:mongoose.Types.ObjectId[];
    otp?:number;
    confirmationEmail:boolean;
   enrolledCourse?:mongoose.Types.ObjectId[]
   publishedCourse?:mongoose.Types.ObjectId[]
}
export interface IAddress{
    userId:mongoose.Types.ObjectId;
    street:string;
    city:string;
    state:string;
    zipCode:string;
}
const AddressSchema = new mongoose.Schema<IAddress>({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    street:{type:String,required:true},
    city:{type:String,required:true},
    state:{type:String,required:true},
    zipCode:{type:String,required:true}
})
const UserAddressSchema = mongoose.model<IAddress>('Address',AddressSchema);

const Userschema =new mongoose.Schema<Iuser>({
    userName:{type:String,required:true,unique:true},
    firstName:{type:String,required:true},
    lastName:{type:String,required:true},
        role:{type:String,enum:["user","admin","instructor"],default:"user"},
    phoneNumber:{type:String},
    jwt:{type:String},
    Address:[{type:mongoose.Schema.Types.ObjectId,ref:'Address'}],
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    otp:{type:Number},
    confirmationEmail:{type:Boolean,default:false},
    enrolledCourse:[{type:mongoose.Schema.Types.ObjectId,ref:'Course'}],
    publishedCourse:[{type:mongoose.Schema.Types.ObjectId,ref:'Course'}]

})
const User =mongoose.model<Iuser>('User',Userschema);
export  {User,UserAddressSchema};
export const getUsers = async (): Promise<Iuser[]> => {
    return await User.find();
}
