const express= require("express");
const app= express();
const connectDB=require("./config/database");
const cookieParser=require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const authRouter=require("./routes/auth");
const profileRouter=require("./routes/profile");
const requsetRouter=require("./routes/request")

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requsetRouter);



connectDB()
    .then(()=>{
        console.log("database connection eascotablish.....");
        app.listen(777,()=>{
            console.log("server is sucessfully listening to port no '777'");
        });

    })
    .catch((err)=>{
        console.log("database cannot connected", err);
    });