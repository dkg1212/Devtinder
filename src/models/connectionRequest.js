const mongoose=require("mongoose");

const connectionRequestSchema=new mongoose.Schema(
    {
        fromUserID:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",//reference to user.js table 
            required:true,
        },
        toUserID:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true

        },
        status:{
            type:String,
            required:true,
            enum:{
                values:["ignored","interested","accepted","rejected"],
                message:`{VALUE} is incorrect status type `,
            }
        },

    },
    {Timestamp:true}
);
connectionRequestSchema.index({fromUserID:1,toUserID:1});

//check and verify if req between User to self 
connectionRequestSchema.pre("save",function(next){
    const connectionRequest=this;
    if(connectionRequest.fromUserID.equals(this.toUserID)){
        throw new Error("Self Love is not valid 😂");
    }
    next();
});


const connectionRequestModel=new mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema
)

module.exports =connectionRequestModel