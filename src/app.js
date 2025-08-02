const express= require("express");
const app= express();
const connectDB=require("./config/database");
const cookieParser=require("cookie-parser");
const cors = require("cors");

app.use(express.json());
app.use(cookieParser());
require("dotenv").config();
app.use(
    cors({
        origin: "http://localhost:5173",
        origin:"http://localhost:5174",
        credentials: true,
    })
);

const authRouter=require("./routes/auth");
const profileRouter=require("./routes/profile");
const requsetRouter=require("./routes/request");
const userRouter = require("./routes/user");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requsetRouter);
app.use("/",userRouter);



connectDB()
    .then(()=>{
        console.log("database connection eascotablish.....");
        app.listen(process.env.PORT,()=>{
            console.log(`server is sucessfully listening to port no '${process.env.PORT}'`);
        });

    })
    .catch((err)=>{
        console.log("database cannot connected", err);
    });