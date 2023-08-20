const mongoose = require("mongoose")
const User = require("./User")

const authSchema = new mongoose.Schema({
    username: String,
    password: String
})

const headerSchema = new mongoose.Schema({
    key: String,
    value: String
})

const urlCheckSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        protocol: {
            type: String,
            enum: ["http", "https", "tcp"],
            default: "http"
        },
        ignoreSSL: {
            type: Boolean
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        path:{
            type: String,
            default: null
        },
        port:{
            type: Number,
            default: null
        },
        timeout:{
            type: Number,
            default: 5
        },
        webhook:{
            type: String,
            default: null
        },
        interval:{
            type: Number,
            default: 10
        }, 
        threshold:{
            type: Number,
            default: 1
        },
        authentication: {
            type: authSchema,
            default: null
        },
        httpHeaders: {
            type: headerSchema, 
            default: null
        },
        assert: {
            type: Number,
            default: 200
        },     
        tags:{
            type: [String],
            default: []
        },
        reports: {
            type: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Report"
            }],
            default: []
        }
    }
)

urlCheckSchema.pre("remove", async function(next){
    try {
        let user = await User.findById(this.user)
        user.urlChecks.remove(this._id)
        await user.save()
        return next()
    }
    catch(err){
        return next(err)
    }
})

const UrlCheck = mongoose.model("UrlCheck", urlCheckSchema)
module.exports = UrlCheck