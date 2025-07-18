const mongoose=require("mongoose");
const Validator=require("validator");
const jwt = require("jsonwebtoken");
const bcrypt=require("bcrypt");

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
    photoUrl: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
      validate(value) {
        if (!Validator.isURL(value)) {
          throw new Error("Invalid Photo URL: " + value);
        }
      },
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

userSchema.methods.getJWT=async function () {

    const user=this;

    const token=await jwt.sign({_id:user._id},"DEV@tinder$790",{
     expiresIn: "7d",
    });

    return token;
    
};

userSchema.methods.validatePassword=async function (passwordInputByUser) {
    const user=this;
    const passwordHash=user.password
//passwordHash is generated by bcrypt in SignUp api call
    const isPasswordValid=await bcrypt.compare(passwordInputByUser,passwordHash);

    return isPasswordValid;
}

module.exports=mongoose.model("User",userSchema);