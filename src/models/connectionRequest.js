const mongoose=require("mongoose");

const connectionRequestSchema=new mongoose.Schema(
    {
        fromUserID:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
        },
        toUserID:{
            type:mongoose.Schema.Types.ObjectId,
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

const connectionRequestModel=new mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema
)

module.exports =connectionRequestModel