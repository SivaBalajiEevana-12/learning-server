import { User, UserAddressSchema } from "../models/Users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer"
// import {setCookie,getCookie} from "cookie";

const registerUser = async (req: any, res: any) => {
  try {
    const {
      userName,
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      Address,
    } = req.body;

    // 🔹 Check existing user (parallel)
    const [existingEmail, existingUsername] = await Promise.all([
      User.findOne({ email }),
      User.findOne({ userName }),
    ]);

    if (existingEmail) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    if (existingUsername) {
      return res
        .status(400)
        .json({ message: "User with this username already exists" });
    }

    // 🔹 Hash password (safe rounds)
    const passwordHash = await bcrypt.hash(password, 10);

    // 🔹 Create user
    const newUser = new User({
      userName,
      firstName,
      lastName,
      email,
      password: passwordHash,
      phoneNumber,
      Address: [],
    });

    await newUser.save();

    // 🔹 Create address only if provided
    if (Address) {
      const userAddress = await UserAddressSchema.create({
        userId: newUser._id,
        street: Address.street,
        city: Address.city,
        state: Address.state,
        zipCode: Address.zipCode,
      });

      newUser.Address = [userAddress._id];
      await newUser.save();
    }
    console.log(process.env.BREVOUSER,process.env.PASSWORD);
    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.BREVOUSER,
          pass: process.env.PASSWORD,
        },
      });
    const subject = 'Book Issue Confirmation';
    const link=`http://localhost:8081/api/auth/confirm-email?id=${newUser._id}`;
      const mailOptions = {
        from: `"Your Team" <${process.env.EMAIL}>`,
        to:email,
        subject:'Confirm your email',
        html: `
          <h3>Hello!</h3>
          <p>Please click the link below:</p>
          <a href="${link}">${link}</a>
        `,
      };
    
      try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        // res.status(200).json({ message: 'Email sent successfully!' });
      } catch (err) {
        console.error('Email error:', err);
        // res.status(500).json({ error: 'Failed to send email' });
      }
    

    return res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
const loginUser = async(req:any,res:any)=>{
    const {email,password}=req.body;
    console.log("secret",process.env.JWT_SECRET_KEY);
  
    try{
        const user =await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid email or password"});
        }
        if(!user.confirmationEmail){
          return res.status(400).json({message:"Please confirm your email before logging in"});
        }
        const isMatch= await bcrypt.compare(password,user.password);
        if(isMatch){
            const token=jwt.sign({id:user._id},process.env.JWT_SECRET_KEY as string) ;
            res.cookie("token",token,{httpOnly:true,secure:false,sameSite:"lax"});
            return res.status(200).json({user:user,message:"Login successful"});
        }
    }
    catch(err:any){
      console.error(err);
        return res.status(500).json({ message: err.message });
    } 
}
const logoutUser = async(req:any,res:any)=>{
  User.deleteOne({email:'eevanasivabalaji@gmail.com'}).then(()=>{
    console.log("user deleted");
  })
    res.clearCookie("token");
    return res.status(200).json({message:"Logout successful"});
}
const confirmEmail=async (req:any,res:any)=>{
  const id=req.query.id;
  try{
    const user=await User.findById(id);
    if(!user){
      return res.status(400).json({message:"Invalid user"});
    }
    user.confirmationEmail=true;
    await user.save();
    return res.status(200).json({message:"Email confirmed successfully"});
  }
  catch(err:any){
    return res.status(500).json({ message: err.message });
  }
}
const forgotPassword=async(req:any,res:any)=>{
  const {email}=req.body;
  try{
      const user = await User.findOne({email});
      if(!user){
          return res.status(400).json({message:"User with this email does not exist"});
      }
      // const yourpassword=user.password;
      const otp=Math.floor(100000+Math.random()*900000);
      user.otp=otp;
      await user.save();
       const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.BREVOUSER,
          pass: process.env.PASSWORD,
        },
      });
    const subject = 'Book Issue Confirmation';
    // const link=`http://localhost:8081/api/auth/confirm-email?id=${newUser._id}`;
      const mailOptions = {
        from: `"Your Team" <${process.env.EMAIL}>`,
        to:email,
        subject:'Confirm your email',
        html: `
          <h3>Hello!</h3>
          <p>Please click the link below:</p>
          <h1>${otp}</h1>
        `,
      };
    
      try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        res.status(200).json({ message: 'Email sent successfully!' });
      } catch (err) {
        console.error('Email error:', err);
        res.status(500).json({ error: 'Failed to send email' });
      }

  }
  catch(err:any){
    return res.status(500).json({ message: err.message });
  }
}
const changePassword=async(req:any,res:any)=>{
  const {email,otp,newPassword}=req.body;
  try{
      const user = await User.findOne({email});
      if(!user){
          return res.status(400).json({message:"User with this email does not exist"});
      }
      if(user.otp!==otp){
        return res.status(400).json({message:"Invalid OTP"});
      }
      const passwordHash = await bcrypt.hash(newPassword, 10);
      user.password=passwordHash;
      user.otp=undefined;
      await user.save();
      return res.status(200).json({message:"Password changed successfully"});
  }
  catch(err:any){
    return res.status(500).json({ message: err.message });
  }
}

export { registerUser,loginUser,logoutUser,confirmEmail,forgotPassword,changePassword };