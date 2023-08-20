const mongoose = require("mongoose")
const UrlCheck = require("./UrlCheck")

const reportSchema = new mongoose.Schema({
        status: {
            type: Number,
            required: true,
            default: -1
        },
        availability: {
            type: Number,
            required: true,
            default: -1
        },
        outages: {
            type: Number,
            required: true,
            default: -1
        },
        downtime: {
            type: Number,
            required: true,
            default: -1
        },
        uptime: {
            type: Number,
            required: true,
            default: -1
        },
        responseTime: {
            type: Number,
            required: true,
            default: -1
        },
        history:{
            type: [String],
            required: true,
            default: []
        },
        urlCheck: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UrlCheck",
            default: null,
            required: true
        }
    }
)

reportSchema.pre("remove", async function(next){
    try {
        let urlCheck = await UrlCheck.findById(this.urlCheck)
        urlCheck.reports.remove(this._id)
        await urlCheck.save()
        return next()
    }
    catch(err){
        return next(err)
    }
})

const Report = mongoose.model("Report", reportSchema)
module.exports = Report