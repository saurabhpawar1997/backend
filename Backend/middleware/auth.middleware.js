const jwt = require("jsonwebtoken");

const auth = (req,res,next)=>{
    const token = req.headers.authorization;
    if(token){
        jwt.verify(token,"masai",(err,decoded)=>{
            if(decoded){
                req.body.userID=decoded.userID;
                next();
            }else{
                res.send({"msg":"Please Login First!"})
            }
        })
    }else{
        res.send({"msg":"User already exist, please login"})
    }
}

module.exports={auth};