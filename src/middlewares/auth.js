const jwt=require("jsonwebtoken");
const User = require("../models/user");

const userAuth =async (req,res,next)=>{
    try {
        const {token}=req.cookies;
        if(!token){
            throw new Error("token not found");
        }

        const decodedObj=await jwt.verify(token,"DEV@tinder$790");

        const {_id} =decodedObj;

        const user=await User.findById(_id);

        if(!user){
            throw new Error("User not found !!");
        }
        req.user=user;
        next();

    } catch (error) {
        res.status(404).send("ERROR : "+error.message);
    }
    
};

module.exports={
    userAuth
}