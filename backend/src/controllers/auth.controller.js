const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const tokenBlackListModel = require("../models/blacklist.model")

function getTokenCookieOptions(){
    return {
        httpOnly:true,
        sameSite:"lax",
        secure:process.env.NODE_ENV === "production",
    }
}

function issueSessionCookie(user, res){
    if(!process.env.JWT_SECRET){
        const error = new Error("JWT_SECRET is not configured")
        error.statusCode = 503
        error.userMessage = "Sign-in is temporarily unavailable. Please try again later."
        throw error
    }

    const token = jwt.sign(
        {id:user._id, username: user.username},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )
    res.cookie("token", token, {
        ...getTokenCookieOptions(),
        maxAge: 24 * 60 * 60 * 1000,
    })
}

class GoogleVerificationUnavailableError extends Error {
    constructor(message, options){
        super(message, options)
        this.name = "GoogleVerificationUnavailableError"
    }
}

async function verifyGoogleCredential(credential){
    if(typeof credential !== "string" || credential.length > 8192){
        return null
    }

    const clientId = process.env.GOOGLE_CLIENT_ID
    if(!clientId){
        throw new Error("GOOGLE_CLIENT_ID is not configured")
    }

    const url = new URL("https://oauth2.googleapis.com/tokeninfo")
    url.searchParams.set("id_token", credential)
    let response
    try{
        response = await fetch(url, {signal:AbortSignal.timeout(5000)})
    } catch(error){
        throw new GoogleVerificationUnavailableError("Unable to reach Google's token verification service", {cause:error})
    }
    if(!response.ok){
        if(response.status === 400 || response.status === 401){
            return null
        }
        throw new GoogleVerificationUnavailableError(
            `Google token verification failed with status ${response.status}`,
        )
    }

    let claims
    try{
        claims = await response.json()
    } catch(error){
        throw new GoogleVerificationUnavailableError("Google returned an invalid token verification response", {
            cause:error,
        })
    }
    const expiration = Number(claims.exp)
    if(
        claims.aud !== clientId ||
        !["accounts.google.com", "https://accounts.google.com"].includes(claims.iss) ||
        !claims.sub ||
        !claims.email ||
        !(claims.email_verified === true || claims.email_verified === "true") ||
        !Number.isFinite(expiration) ||
        expiration <= Date.now() / 1000
    ){
        return null
    }

    return claims
}

function createUsernameBase(name, email){
    const nameFromEmail = email.split("@")[0]
    return (name || nameFromEmail)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9._-]/g, "")
        .slice(0, 24) || "user"
}

async function googleLoginController(req,res){
    if(!process.env.JWT_SECRET){
        return res.status(503).json({
            message:"Sign-in is temporarily unavailable. Please try again later."
        })
    }

    if(!process.env.GOOGLE_CLIENT_ID){
        return res.status(503).json({message:"Google sign-in is not configured on the server."})
    }

    let claims
    try{
        claims = await verifyGoogleCredential(req.body?.credential)
    } catch(error){
        if(!(error instanceof GoogleVerificationUnavailableError)){
            throw error
        }
        console.error("Google token verification service is unavailable", error)
        return res.status(503).json({message:"Google sign-in is temporarily unavailable. Please try again."})
    }

    if(!claims){
        return res.status(401).json({message:"Google sign-in could not be verified. Please try again."})
    }

    let user = await userModel.findOne({googleId:claims.sub})
    let isNewUser = false

    if(!user){
        user = await userModel.findOne({email:claims.email})
        if(user){
            if(user.googleId && user.googleId !== claims.sub){
                return res.status(409).json({
                    message:"This email address is linked to a different Google account."
                })
            }
            user.googleId = claims.sub
            try{
                await user.save()
            } catch(error){
                if(error.code === 11000){
                    return res.status(409).json({
                        message:"This Google account is already linked to another user."
                    })
                }
                throw error
            }
        } else {
            const usernameBase = createUsernameBase(claims.name, claims.email)
            const usernameExists = await userModel.exists({username:usernameBase})
            const username = usernameExists
                ? `${usernameBase.slice(0, 15)}-${claims.sub.slice(-8)}`
                : usernameBase

            try{
                user = await userModel.create({
                    username,
                    email:claims.email,
                    googleId:claims.sub,
                })
            } catch(error){
                if(error.code === 11000){
                    return res.status(409).json({
                        message:"An account already exists with these details. Please try signing in again."
                    })
                }
                throw error
            }
            isNewUser = true
        }
    }

    issueSessionCookie(user, res)
    return res.status(isNewUser ? 201 : 200).json({
        message:isNewUser ? "User registered successfully" : "User logged in successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email,
        }
    })
}

async function logoutUserController(req,res){
    const token = req.cookies.token
    if(token) {
        await tokenBlackListModel.create({token})
    }
    res.clearCookie("token", getTokenCookieOptions())
    res.status(200).json({
        message:"User logged out successfully"
    })
}

/**
 * @name getMeController
 * @description get me current logged in user details
 * @access private
 */
async function getMeController(req,res){
    const user = await userModel.findById(req.user.id)
    if(!user){
        return res.status(401).json({
            message: "Your account could not be found. Please sign in again."
        })
    }

    res.status(200).json({
        message: "User details fetched successfully",
        user:{
            id:user._id,
            name:user.username,
            email:user.email
        }
    })
}


module.exports = {
    googleLoginController,
    logoutUserController,
    getMeController
}