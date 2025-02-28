const express= require("express");

const app= express();

app.use("/test",(req,res)=>{
    res.send("HelloWorld");
})

app.use("/hi",(req,res)=>{
    res.send("I am Indian!");
})

app.use((req,res)=>{
    res.send("I am Indian");
})

app.listen(7777,()=>{
    console.log("server is sucessfully listening to port no'7777'");
})