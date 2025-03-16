const express=require("express");
const userRouter=express.Router();
const {userAuth}=require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const USER_SAFE_DATA="firstName lastName age gender about skill"

userRouter.get("/user/requests/recieved",userAuth,async(req,res)=>{
    try {
        const loggedInUser=req.user;
        
        const connectionRequests=await ConnectionRequest.find({
            toUserID:loggedInUser._id,
            status :"interested",
        }).populate("fromUserID"
            ,USER_SAFE_DATA
        );

        res.json({
            message :"Data fetched Succesfully",
            data :connectionRequests,
        })

    } catch (err) {
        res.status(400).send("Error : "+err.message);
    }
})

userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try {
        const loggedInUser=req.user

        const connectionRequest=await ConnectionRequest.find({
            $or:[
                {toUserID:loggedInUser._id,status:"accepted"},
                {fromUserID:loggedInUser._id,status:"accepted"},
            ]
        }).populate(
            "fromUserID",
            USER_SAFE_DATA
        );
        const data =connectionRequest.map((row)=>row.fromUserID);

        res.json({data});

    } catch (err) {
       res.status(404).send("Error : "+err.message); 
    }
});

module.exports=userRouter;