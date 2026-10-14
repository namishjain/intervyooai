require("dotenv").config()
const app = require("../backend/src/app")
const connectToDB = require("../backend/src/config/database")
const invokeGeminiAi = require("./src/services/ai.service")
connectToDB()
invokeGeminiAi()
app.listen(3000, ()=>{
    console.log("Server is running on port 3000")
})