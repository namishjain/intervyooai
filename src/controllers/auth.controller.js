const userModel = require("../models/user.model")
/**
 * @route registerUserController
 * @description register a new user
 * @access Public
 */

async function registerUserController(req,res){
    const {username, email, body} = req.body
    if(!username || !email || !password){
        return res.status(400).json({
            message: "Please provide username, email and password"
        })
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{username}, {email}]
    })
    if(isUserAlreadyExists){
        return res.status(400).json({
            message: "Account already exists with this email address or username"
        })
    }
}

module.exports = {
    registerUserController
}