const express = require("express")
const router = express.Router({ mergeParams: true})
const {create, fetch, destroy, fetchAll, update, getReport} = require("../controllers/urlCheck")
const { ensureCorrectUser, loginRequired } = require("../middleware/auth")
const reportRoutes = require("./report")

router.use("/:id/report", reportRoutes)

router.use("/:id", loginRequired, ensureCorrectUser)
router.route("/:id")
    .get(fetch)
    .put(update)
    .delete(destroy)

router.route("/")
    .get(fetchAll)
    .post(loginRequired, create)





module.exports = router