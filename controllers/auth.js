import mongoose from "mongoose"
import User from "../models/User.js"
import bcrypt from "bcryptjs"
import { createError } from "../error.js";
import jwt from "jsonwebtoken"



export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    
    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Create the user in the database
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    // Generate a token using the secret key
    const secretKey = process.env.JWT_SECRET || 'defaultSecretKey'; 
    const token = jwt.sign({ id: newUser._id }, secretKey);

    res
      .cookie('access_token', token, {
        httpOnly: true,
      })
      .status(201)
      .send('User has been created!');
  } catch (err) {
    next(err);
  }
};



  
 export const signin = async (req,res,next)=>{

    try{
          const user =await User.findOne({name:req.body.name})
          if(!user) return next(createError(404,"User not Found"));
       
         const isCorrect= await bcrypt.compare(req.body.password,user.password)
         
        if(!isCorrect) return next(createError(400,"Wrong Credentials!"))
          
          const token =jwt.sign({id:user._id},process.env.JWT)
          const {password,...others} =user._doc
             res
             .cookie("access_token",token,{
              maxAge:3600000,
              httpOnly:true,
              
             })
             .status(200)
             .json(others);
        }catch(err){
      next(err)
    }
 }

 export const googleAuth = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT);
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(user._doc);
    } else {
      const newUser = new User({
        ...req.body,
        fromGoogle: true,
      });
      const savedUser = await newUser.save();
      const token = jwt.sign({ id: savedUser._id }, process.env.JWT);
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(savedUser._doc);
    }
  } catch (err) {
    next(err);
  }
};


export const logout = (req, res) => {
  try {
    
    res.clearCookie("access_token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};





