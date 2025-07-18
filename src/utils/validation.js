const validator=require("validator");

const validateSignUpData=(req)=>{
    const {firstName,lastName,emailId,password}=req.body;
    if(!firstName||!lastName){
        throw new Error("Username Not Valid !");
    }
    else if(firstName<4&&firstName>50){
        throw new Error("Username should be more than 4 char and less than 50 ");
        
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Email ID not valid");
        
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a strong Password");
        
    }
};

const validateEditProfileData=(req)=>{
    const allowEditFields=[
        "firstName",
        "latstName",
        "emailId",
        "gender",
        "about",
        "skills",
        "photoUrl",
        "age",

    ];

    const isallowEdit=Object.keys(req.body).every((field)=>
        allowEditFields.includes(field)
    );

    return isallowEdit;

}

module.exports={
    validateSignUpData,
    validateEditProfileData,
};