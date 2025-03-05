const mongoose=require("mongoose");

const connectDB =  async()=>{
    await mongoose.connect(
        "mongodb+srv://gogoidimpal546:4PhKLZleAV54A94n@cluster0.ehu5i.mongodb.net/devTnder"
    );
};

module.exports=connectDB;