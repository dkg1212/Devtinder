const express=require("express");
const authRouter=express.Router();
const {userAuth}=require("../middlewares/auth");

authRouter.get("/profile",userAuth,async(req,res)=>{
    try{
        const user=req.user;

        res.send(user);
    }
    catch(err){
        res.status(200).send("cookie not found : "+err.message);
    }
});

module.exports=authRouter

