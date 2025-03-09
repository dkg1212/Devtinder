const express= require("express");
const app= express();
const connectDB=require("./config/database");
const User =require("./models/user");
const {validateSignUpData}=require("./utils/validation");
const bcrypt=require("bcrypt");
const cookieParser=require("cookie-parser");
const jwt=require("jsonwebtoken");
const {userAuth}=require("./middlewares/auth");
const { data } = require("react-router-dom");

app.use(express.json());
app.use(cookieParser());

app.post("/signup",async (req,res)=>{
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

        await user.save()
        res.send("user added Successfully");
   }catch(err){
    res.status(500).send("somthing went Wrong : "+err.message)
   }

});

app.post("/login",async(req,res)=>{
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

            res.send("login succesfull");
        }else{
            throw new Error("Invalid UserId or Password")
        }
        
    } catch (error) {
        res.status(400).send("Somthing went Wrong : "+error.message);
    }
})

app.get("/profile",userAuth,async(req,res)=>{
    try{
        const user=req.user;

        res.send(user);
    }
    catch(err){
        res.status(200).send("cookie not found : "+err.message);
    }
});

app.post("/sendConnectionRequest",userAuth,async(req,res)=>{

    const user =req.user;
    //sending a connection requsest
    console.log("sending connection req ");

    res.send(user.firstName+ " is sending connection requset");

})

connectDB()
    .then(()=>{
        console.log("database connection eascotablish.....");
        app.listen(777,()=>{
            console.log("server is sucessfully listening to port no '777'");
        });

    })
    .catch((err)=>{
        console.log("database cannot connected", err);
    });