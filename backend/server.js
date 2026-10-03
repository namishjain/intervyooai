require("dotenv").config()
const app = require("../backend/src/app")
const connectToDB = require("../backend/src/config/database")

connectToDB()

app.listen(3000, ()=>{
    console.log("Server is running on port 3000")
})