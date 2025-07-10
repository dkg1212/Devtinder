const express=require("express");
const authRouter=express.Router();
const {validateSignUpData}=require("../utils/validation");
const User =require("../models/user");
const bcrypt=require("bcrypt");

authRouter.post("/signup",async (req,res)=>{
    try{
        //validation of data
        validateSignUpData(req);
        
        const {firstName,lastName,emailId,password,age,gender}=req.body;

        //encrypt the password
        const passwordHash=await bcrypt.hash(password,10);

        //creating a new instance of User Model
        const user=new User({
            firstName,
            lastName,
            emailId,
            password:passwordHash,
            age,
            gender,
        });

        const savedUser=await user.save();
        const token=await user.getJWT();
        res.cookie("token",token,{
            expires:new Date(Date.now()+1*90000000),
        });

        res.json({
            message:"User created successfully",
            data:savedUser,
        });
   }catch(err){
    res.status(500).send("somthing went Wrong : "+err.message)
   }

});
authRouter.post("/login",async(req,res)=>{
    try {
        const {emailId,password}=req.body;
        const user=await User.findOne({emailId:emailId});

        if(!user){
            throw new Error("Invalid UserId or Password");
        }
        //take the password by user and give it to User.js
        const isPasswordValid=await user.validatePassword(password);
        
        if(isPasswordValid){
            //create JWT token

            const token=await user.getJWT();

            //Add the token to cookie and send the response back to user 
            res.cookie("token",token,{
                expires:new Date(Date.now()+1*90000000),
            });

            res.send(user);
        }else{
            throw new Error("Invalid UserId or Password")
        }
        
    } catch (error) {
        res.status(400).send("Somthing went Wrong : "+error.message);
    }
})

authRouter.post("/logout",async(req,res)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now()),
    })
    res.send("logout succsefully !");
})

module.exports=authRouter;