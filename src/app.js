const express= require("express");

const app= express();
const connectDB=require("./config/database");
const User =require("./models/user");
app.use(express.json());

app.post("/signup",async (req,res)=>{
    const user=new User(req.body);
    try{
    await user.save()
    res.send("user added Successfully");
   }
   catch(err){
    res.status(500).send("somthing went Wrong",+err.message)
   }

});

app.get("/feed",async(req,res)=>{
    try{
        const users=await User.find({});
        res.send(users);
    }
    catch(err){
        res.status(404).send("something went wrong...");
    }
})

app.get("/users",async(req,res)=>{
    const userEmail=req.body.emailId;
    try {
        const users=await User.find({emailId:userEmail});
        if(users.length===0){
            res.status(400).send("user not found !");
        }else{
            res.send(users);
        }
        
    } catch (error) {
        res.status(404).send("somthing went wrong");
        
    }
})

app.delete("/user",async(req,res)=>{
    const userID=req.body.userID;
    try {
        const user=await User.findByIdAndDelete({ _id:userID});
        res.send("deleted Succesfully");
        
    } catch (err) {
        res.status(400).send("somthing went Wrong");
        
    }

})

app.patch("/user",async(req,res)=>{
    const userId=req.body.userId;
    const data=req.body;
    console.log(userId);
    try {
        await User.findByIdAndUpdate({ _id: userId },data,{returnDocument:"before"});
        res.send("Upadated successfully !!");
        
    } catch (error) {
        console.log(error);
        res.status(400).send("sometging went wrong");
    }

})

connectDB()
    .then(()=>{
        console.log("database connection eastablish.....");
        app.listen(7777,()=>{
            console.log("server is sucessfully listening to port no '7777'");
        });

    })
    .catch((err)=>{
        console.log("database cannot connected", err);
    });