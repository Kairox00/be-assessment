const db = require("../models")


const create = async (req, res, next)=>{
    try {
        let urlCheck = await db.UrlCheck.create({
            name: req.body.name,
            url: req.body.url,
            user: req.user_id
        })
        let foundUser = await db.User.findById(req.user_id)
        foundUser.urlChecks.push(urlCheck.id)
        await foundUser.save()

        let foundCheck = await db.UrlCheck.findById(urlCheck._id).populate("user", {
            email: true,
        })
        return res.status(200).send(foundCheck)
    }
    catch (err){
        return next(err)
    }

}

const fetch = async (req, res, next)=>{
    try {
        console.log(req.user);
        let urlCheck = await db.UrlCheck.findById(req.params.id)
        return res.status(200).send(urlCheck)
    }
    catch (err){
        return next(err)
    }
}

const update = async (req, res, next)=>{
    try {
        const updatedCheck = await db.UrlCheck.findByIdAndUpdate(req.params.id,  { $set: req.body }, {
            new: true // Return the updated document
        });
        return res.status(200).send(updatedCheck)
    }
    catch (err){
        return next(err)
    }
}

const fetchAll = async (req, res, next)=>{
    try {
        let urlCheck = await db.UrlCheck.find();
        return res.status(200).send(urlCheck)
    }
    catch (err){
        return next(err)
    }
}

const fetchByTag = async (req,res,next)=>{
    try {
        let urlCheck = await db.UrlCheck.find({tags: req.query.tags});
        return res.status(200).send(urlCheck)
    }
    catch (err){
        return next(err)
    }
}

const destroy = async (req, res, next)=>{
    try {
        let urlCheck = await db.UrlCheck.findById(req.params.id)
        await urlCheck.remove()
        return res.status(200).send(urlCheck)
    }
    catch (err){
        return next(err)
    }
}




module.exports = {create, fetch, destroy, fetchAll, update, fetchByTag}