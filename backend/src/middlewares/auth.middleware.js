const jwt = require("jsonwebtoken")
const tokenBlackListModel = require("../models/blacklist.model")

async function authUser(req,res,next){
    if(!process.env.JWT_SECRET){
        return res.status(503).json({
            message: "Authentication is temporarily unavailable. Please try again later."
        })
    }

    const token = req.cookies?.token
    if(!token){
        return res.status(401).json({
            message: "Your session cookie was not received. Please sign in again."
        })
    }
    const isTokenBlackListed = await tokenBlackListModel.findOne({
        token
    })
    if(isTokenBlackListed){
        return res.status(401).json({
            message: "Token is invalid"
        })
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
    }
    catch(err){
        if(err.name === "JsonWebTokenError" || err.name === "TokenExpiredError" || err.name === "NotBeforeError"){
            return res.status(401).json({
                message: "Your session is invalid or has expired. Please sign in again."
            })
        }
        return next(err)
    }
    return next()
}
module.exports = authUser