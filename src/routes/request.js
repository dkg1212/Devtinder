const express=require("express");
const requestRouter=express.Router();
const {userAuth}=require("../middlewares/auth");
const ConnectionRequest= require("../models/connectionRequest");
const User=require("../models/user");


requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
    try {
        const fromUserID=req.user._id;
        const toUserID=req.params.toUserId;
        const status=req.params.status;

        const allowedStatus=["interested","ignored"];
        if(!allowedStatus.includes(status)){
            return res
            .status(400)
            .json({message : "invalid status type : " + status });
        }

        const toUser=await User.findById(toUserID);
        if(!toUser){
            return res
            .status(400)
            .json({message : "User Not Found !"});
        }

        const existingConnectionRequest =await ConnectionRequest.findOne({
            $or:[
                {fromUserID,toUserID},
                {fromUserID:toUserID,toUserID:fromUserID},
            ],
        });
        if(existingConnectionRequest){
            return res.status(400).json({message:"Connection Already Sent !"})
        }

        const connectionRequest= new ConnectionRequest({
            fromUserID,
            toUserID,
            status
        });
        
        const data = await connectionRequest.save();

        res.json({
            message:req.user.firstName + " is "+status+" in "+toUser.firstName,
            data,
        });

    } catch (err) {
        res.status(400).send("Error : "+err.message);
    }

})

requestRouter.post("/request/review/:status/:requestId",userAuth,async (req,res)=>{
    try {
        const loggedInUser=req.user;
        const {status,requestId}=req.params;

        const allowedStatus=["accepted","rejected"];
        if(!allowedStatus){
            return res.status(400).json({message:" Status not Allowed "});

        }

        const connectionRequest=await ConnectionRequest.findOne({
            _id:requestId,
            toUserID:loggedInUser,
            status:"interested",

        });

        if(!connectionRequest){
            res.status(404).json({message :" Connection request not found "});
        }

        connectionRequest.status=status;

        const data = await connectionRequest.save();

        res.json({
            message: " Connection request "+status,
            data,
        });



    } catch (err) {
        
    }

});


module.exports=requestRouter;