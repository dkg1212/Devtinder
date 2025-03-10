const express=require("express");
const authRouter=express.Router();
const {userAuth}=require("../middlewares/auth");


authRouter.post("/sendConnectionRequest",userAuth,async(req,res)=>{

    const user =req.user;
    //sending a connection requsest
    console.log("sending connection req ");

    res.send(user.firstName+ " is sending connection requset");

})

module.exports=authRouter;