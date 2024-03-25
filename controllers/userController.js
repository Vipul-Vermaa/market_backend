import {User} from '../models/User.js' 
import cloudinary from 'cloudinary'
import {catchAsyncError} from '../middlewares/catchAsyncError.js'
import singleUpload from '../middlewares/multer.js'
import ErrorHandler from '../utils/errorHandler.js'
import getDataUri from '../utils/dataUri.js'
import crypto from 'crypto'
import {sendToken} from '../utils/sendToken.js'
import DataURIParser from 'datauri/parser.js'


export const register=catchAsyncError(async(req,res,next)=>{
    const {name,email,password}=req.body
    const file=req.file
    if(!name || !email || !password || !file) return next(new ErrorHandler('Enter all fields',400))
    let user =await User.findOne({email})
    if(user) return next(new ErrorHandler('User already exist'),409)
    const fileUri=getDataUri(file)
    const mycloud=await cloudinary.v2.uploader.upload(fileUri.content)
    user=await User.create({
        name,email,password,
        avatar:{
        public_id:mycloud.public_id,
            url:mycloud.secure_url,
        },
    })
    sendToken(res,user,'Registered',201)
})


export const login=catchAsyncError(async(req,res,next)=>{
    const {email,password}=req.body
    if(!email || !password) return next(new ErrorHandler('Enter all fields',400))
    const user=await User.findOne({email}).select("+password")
    if(!user) return next(new ErrorHandler('Incorrect',401))
    const isMatch=await user.comparePassword(password)
    if(!isMatch) return next(new ErrorHandler('Incorrect',401))
    sendToken(res,user,"Logged In",200)
})


export const logout=catchAsyncError(async(req,res,next)=>{
    res.status(200).cookie(
        'token',null,{
            expires:new Date(Date.now()),
            httpOnly:true,
            secure:true,
            sameSite:"none",
        }
    ).json({
        success:true,
        message:'Logged out'
    })
})



export const updateProfile=catchAsyncError(async(req,res,next)=>{
    const {name,email}=req.body
    const user=await User.findById(req.user._id)
    if(name) user.name=name
    if(email) user.email=email
    await user.save()
    res.status(200).json({
        success:true,
        message:'Profile Updated'
    })
})


export const changeProfilePicture=catchAsyncError(async(req,res,next)=>{
    const file=req.file
    const user=await User.findById(req.user._id)
    const fileUri=getDataUri(file)
    const mycloud=await cloudinary.v2.uploader.upload(fileUri.content)
    await cloudinary.v2.uploader.destroy(user.avatar.public_id)
    user.avatar={
        public_id:mycloud.public_id,
        url:mycloud.secure_url
    }
    await user.save()
    res.status(200).json({
        success:true,
        message:'Profile Picture Updated'
    })
})


export const changePassword=catchAsyncError(async(req,res,next)=>{
    const {oldPassword,newPassword}=req.body
    if(!oldPassword || !newPassword) return next(new ErrorHandler('Enter all fields',400))
    const user=await User.findById(req.user._id).select("+password")
    const isMatch=await user.comparePassword(oldPassword)
    if (!isMatch) return next(new ErrorHandler("Incorrect Old Password", 400))
    user.password=newPassword
    await user.save()
    res.status(200).json({
        success: true,
        message: "Password Changed"
    })
})


export const getMyProfile=catchAsyncError(async(req,res,next)=>{
    const user=await User.findById(req.user._id)
    res.status(200).json({
        success:true,
        user,
    })
})