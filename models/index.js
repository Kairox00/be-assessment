const mongoose = require('mongoose')
// mongoose.set('debug', true)
mongoose.Promise = Promise 
mongoose.connect(process.env.MONGO_URI,{
    keepAlive: true
});


module.exports.User = require('./User')
module.exports.UrlCheck = require("./UrlCheck")
module.exports.OTP = require("./OTP")
module.exports.Report = require("./Report")
