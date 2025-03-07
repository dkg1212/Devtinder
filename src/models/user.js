const mongoose=require("mongoose");
const Validator=require("validator");

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4,
    },
    lastName:{
        type:String,
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim: true,
        validate(value){
            if(!Validator.isEmail(value)){
                throw new Error("EmailId is not valid "+value);
            }
        }
    },
    password:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
        required:true,
        min:18,
    },
    gender:{
        type:String,
        required:true,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender is not Valid");
                
            }
        }
    },
    about:{
        type:String,
        default:"This is a default about the user .",
    },
    skills:{
        type:[String],
    }
},
{
    timestamps:true,
}
);

module.exports=mongoose.model("User",userSchema);