const db = require("../models")
const jwt = require("jsonwebtoken")
const mailer = require("../utils/mailer");

const signin = async (req, res, next)=>{
    try {
        let user = await db.User.findOne({
            email: req.body.email
        })
        if(!user.isVerified){
            let otp = req.body.otp;
            let matchOTP = await db.OTP.findOne({code: otp})
            if(!matchOTP || matchOTP.email !== req.body.email){
                return next({
                    status: 400,
                    message: 'email not verified'
                })
            }
            else{
                user.isVerified = true;
                user.save();
            }
        }

        let {id, email} = user
        let isMatch = await user.comparePassword(req.body.password)
        if (isMatch){
            let token = jwt.sign({id, email}, process.env.SECRET_KEY)

            res.status(200).send({
                id,
                token
            })
        }
        else{
            return next({
                status: 400,
                message: 'Invalid/email password'
            })
        }

    }
    catch(err){
        console.log(err)
        return next({
                status: 400,
                message: err.message
            })
    }
}



const signup = async (req, res, next) =>{
    try {
        let user = await db.User.create(req.body)
        let {id} = user
        let token = jwt.sign({id},process.env.SECRET_KEY)

        let otp = (Math.random() + 1).toString(36).substring(4);
        await db.OTP.create({
            email: user.email,
            code: otp
        })

        let mailDetails = {
            from: 'khaled.youssef2510@gmail.com',
            to: user.email,
            subject: 'OTP',
            text: 'OTP is ' + otp
        };

        mailer.send(mailDetails)
        res.status(200).send({
            id,
            token
        })
    }
    catch(err){
        if(err.code === 11000){
            err.message = "Sorry username or email already taken"
        }
        return next({
            status: 400,
            message: err.message
        })
    }
}



module.exports = {signup, signin}