const express= require("express");
const app= express();
const connectDB=require("./config/database");
const User =require("./models/user");
const {validateSignUpData}=require("./utils/validation");
const bcrypt=require("bcrypt");
const cookieParser=require("cookie-parser");
const jwt=require("jsonwebtoken");

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
        
        const isStrongPassword=await bcrypt.compare(password,user.password);

        if(isStrongPassword){
            //create JWT token

            const token=await jwt.sign({_id:user._id},"DEV@tinder$790");

            //Add the token to cookie and send the response back to user 
            res.cookie("token",token);
            res.send("login succesfull");
        }else{
            throw new Error("Invalid UserId or Password")
        }
        
    } catch (error) {
        res.status(400).send("Somthing went Wrong : "+error.message);
    }
})

app.get("/profile",async(req,res)=>{
    try{
        const cookies=req.cookies;

        const {token}=cookies;

        //validate token
        if(!token){
            throw new Error("Error 404");
            }

        const decodeMessage=await jwt.verify(token,"DEV@tinder$790") ;
        const {_id}=decodeMessage;

        const user =await User.findById(_id);
        if(!user){
            throw new Error("User not found");
            
        }

        res.send(user);
        //res.send("Reading Cookie ")
    }
    catch(err){
        res.status(200).send("cookie not found : "+err.message);
    }
})

app.get("/feed",async(req,res)=>{
    try{
        const users=await User.find({});
        res.send(users);
    }
    catch(err){
        res.status(404).send("something went wrong...");
    }
})

app.get("/users",async(req,res)=>{
    const userEmail=req.body.emailId;
    try {
        const users=await User.find({emailId:userEmail});
        if(users.length===0){
            res.status(400).send("user not found !");
        }else{
            res.send(users);
        }
        
    } catch (error) {
        res.status(404).send("somthing went wrong");
        
    }
})

app.delete("/user",async(req,res)=>{
    const userID=req.body.userID;
    try {
        const user=await User.findByIdAndDelete({ _id:userID});
        res.send("deleted Succesfully");
        
    } catch (err) {
        res.status(400).send("somthing went Wrong");
        
    }

})

app.patch("/user/:userId",async(req,res)=>{
    const userId=req.params?.userId;
    const data=req.body;
    try {
        const ALLOW_UPDATES=["age","gender","about","skills"];
        const isUpadateallowed=Object.keys(data).every((k)=>
        ALLOW_UPDATES.includes(k),
        );
        if(!isUpadateallowed){
            throw new Error("Update not allowed !");
        }
        if(req.body.skills.length>10){
            throw new Error("Skills More than 10 Not allowed !");
        }
        if(data.about&&data.about.length>100){
            throw new Error("More than 100 word not allowed Not allowed !");
        }
        await User.findByIdAndUpdate({ _id: userId },data,
            {
                returnDocument:"before",
                runValidators:true,
            });
        res.send("Upadated successfully !!");
        
    } catch (error) {
        res.status(400).send("something went wrong : "+error.message);
    }

})

connectDB()
    .then(()=>{
        console.log("database connection eastablish.....");
        app.listen(777,()=>{
            console.log("server is sucessfully listening to port no '777'");
        });

    })
    .catch((err)=>{
        console.log("database cannot connected", err);
    });