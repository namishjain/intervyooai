const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const {notFoundHandler, errorHandler} = require("./middlewares/error.middleware")

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    credentials:true
}))
// Require all the routes here
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

// using all the routes here
app.use('/api/auth', authRouter)
app.use('/api/interview', interviewRouter)
app.use(notFoundHandler)
app.use(errorHandler)

module.exports = app
