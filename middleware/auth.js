const jwt = require("jsonwebtoken")
const db = require("../models/index")

const loginRequired = (req, res, next)=>{
    try {
        const authheaders = req.headers.authorization
        if(authheaders){
            const token = authheaders.split(" ")[1]
            jwt.verify(token, process.env.SECRET_KEY, (err, decoded)=>{
            if (decoded){
                req.user_id = decoded.id;
                return next()
            }
            else{
                return next({
                    status: 401,
                    message: "You need to log in first"
                })
            }})
        }
    }
    catch(err){
        console.log(err)
        return next({
                    status: 401,
                    message: err.message
                })
    }
   
}

const ensureCorrectUser = async (req, res, next)=>{
    try {
        const urlCheck = await db.UrlCheck.findById(req.params.id).populate("user");
        if(urlCheck.user.id.toString() === req.user_id){
            return next();
        }
        throw new Error("You are not authorized")
    }
    catch(err){
        console.log(err)
        return next({
                    status: 401,
                    message: err.message
                })
    }
}

module.exports = {loginRequired, ensureCorrectUser}