const adminAuth =(req,res,next)=>{
    const token="xyz";
    const isadminAuth= token === "xyz";
    if(!isadminAuth){
        res.status(401).send("Unauthorized reqiest");

    }else{
        next();
    }
};

const userAuth =(req,res,next)=>{
    const token="xyz";
    const isadminAuth= token === "xyzq";
    if(!isadminAuth){
        res.status(401).send("Unauthorized reqiest");

    }else{
        next();
    }
};

module.exports={
    adminAuth,
    userAuth
}