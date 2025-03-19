const express=require("express");
const userRouter=express.Router();
const {userAuth}=require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User=require("../models/user")

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
        ).populate(
            "toUserID",
            USER_SAFE_DATA
        );
        const data =connectionRequest.map((row)=>{
            if(row.fromUserID._id.toString()===loggedInUser._id.toString()){
                return row.toUserID;
            }

            return row.fromUserID;
        });

        res.json({data});

    } catch (err) {
       res.status(404).send("Error : "+err.message); 
    }
});

userRouter.get("/feed",userAuth ,async(req,res)=>{
  try{
        const page=parseInt(req.query.page)||1;
        let limit=parseInt(req.query.limit)||10;
        limit=50>50?50:limit;
        const skip=(page-1)*limit;

        const loggedInUser=req.user;

        const connectionRequest=await ConnectionRequest.find({
            $or:[{fromUserID:loggedInUser._id},{toUserID:loggedInUser._id}],
        }).select("fromUserID toUserID");

        const hideUserFromFeed=new Set();
        connectionRequest.forEach((req)=>{
            hideUserFromFeed.add(req.fromUserID.toString()),
            hideUserFromFeed.add(req.toUserID.toString())
        });

        const users=await User.find({
            $and:[
                {_id:{$nin: Array.from(hideUserFromFeed)}},
                {_id:{$nin:loggedInUser._id}},
            ],
        }).select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit);

        res.json({users});
    }
    catch(err){
        res.status(404).send("Error : "+err.message)
    }
})

module.exports=userRouter;