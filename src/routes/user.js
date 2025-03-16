const express=require("express");
const userRouter=express.Router();
const {userAuth}=require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

userRouter.get("/user/requests/recieved",userAuth,async(req,res)=>{
    try {
        const loggedInUser=req.user;
        
        const connectionRequests=await ConnectionRequest.find({
            toUserID:loggedInUser._id,
            status :"interested",
        }).populate("fromUserID"
            ,"firstName lastName "
        );
        console.log(connectionRequests);

        res.json({
            message :"Data fetched Succesfully",
            data :connectionRequests,
        })

    } catch (err) {
        res.status(400).send("Error : "+err.message);
    }
})


module.exports=userRouter;