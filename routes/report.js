const express = require("express")
const router = express.Router({ mergeParams: true})
const {getReports, createReport} = require("../controllers/report")

router.route("/")
    .get(getReports)
    .post(createReport)


module.exports = router