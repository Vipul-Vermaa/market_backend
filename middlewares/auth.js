import  jwt  from "jsonwebtoken";
import {catchAsyncError} from './catchAsyncError.js'
import ErrorHandler from '../utils/errorHandler.js'
import {User} from '../models/User.js'

// isAuthenticated
export const isAuthenticated=catchAsyncError(async(req,res,next)=>{
    const {token} =req.cookies
    if(!token) return next(new ErrorHandler('Not Logged In',401))
    const decoded=jwt.verify(token,process.env.JWT_SECRET)
    req.user=await User.findById(decoded._id)
    next()
})

// isSubscribed
export const isSubscribed=(req,res,next)=>{
    if(req.user.subscription.status!=='active' && req.user.role!=='admin')
    return next(new ErrorHandler('Only Subscribers can access',403))
    next()
}

// isAdmin
export const isAdmin=(req,res,next)=>{
    if(req.user.role!=="admin")
    return next(new ErrorHandler('Access Denied',403))
    next()
}