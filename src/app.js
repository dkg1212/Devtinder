const express= require("express");

const app= express();

const {adminAuth,userAuth}=require("./middlewares/auth");

app.use("/admin",adminAuth);

app.use("/user/data",userAuth,(req,res)=>{
    res.send("user data sent ");
});

app.use("/user/login",(req,res)=>{
    res.send("user Login Successfully ");
});

app.get("/admin/getData",(req,res)=>{
    res.send("user get data");
});


app.listen(7777,()=>{
    console.log("server is sucessfully listening to port no'7777'");
});