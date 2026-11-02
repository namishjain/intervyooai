require("dotenv").config()
const app = require("../backend/src/app")
const connectToDB = require("../backend/src/config/database")

async function startServer(){
    try{
        await connectToDB()
        const port = process.env.PORT || 3000
        app.listen(port, ()=>{
            console.log(`Server is running on port ${port}`)
        })
    } catch(error){
        console.error("Unable to start the server because the database connection failed.", error)
        process.exitCode = 1
    }
}

startServer()