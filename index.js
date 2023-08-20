require('dotenv').config()
const express = require("express")
const app = express()
const cors = require("cors")
const errorHandler = require("./utils/errorHandler")
const authRoutes = require("./routes/auth")
const mailer = require("./utils/mailer")
const checksRoutes = require("./routes/urlCheck")
// const {loginRequired, ensureCorrectUser} = require("./middleware/auth")
const db = require('./models/index')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}));

app.use("/api/auth", authRoutes)
app.use("/api/checks", checksRoutes)
// app.use("/api/users/:user_id/checks", checksRoutes)
// app.use("/api/users/:id/messages",
//     loginRequired,
//     ensureCorrectUser,
//     messagesRoutes)

app.use((req, res, next)=>{
    let err = new Error("Not found");
    err.status = 404
    next(err)
})

app.use(errorHandler)

// let mailDetails = {
//     from: 'kainode804@gmail.com',
//     to: 'khaledmromeh@gmail.com',
//     subject: 'Test mail',
//     text: 'Node.js testing mail for GeeksforGeeks'
// };

// mailer.send(mailDetails);


app.listen(process.env.PORT, ()=>{
    console.log(`Server starting on port ${process.env.PORT}`)
})