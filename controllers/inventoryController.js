import {catchAsyncError} from '../middlewares/catchAsyncError.js'
import ErrorHandler from '../utils/errorHandler.js'
import {Inventory} from '../models/Inventory.js'
import cloudinary from 'cloudinary'
import getDataUri from '../utils/dataUri.js'
import {User} from '../models/User.js'


export const createInventory=catchAsyncError(async(req,res,next)=>{
    const {title,description,createdBy}=req.body
    if(!title || !description || !createdBy) return next(new ErrorHandler('Enter all fields',400))

    const file=req.file
    const fileUri=getDataUri(file)
    const mycloud=await cloudinary.v2.uploader.upload(fileUri.content)

    await Inventory.create({
        title,description,createdBy,
        inventoryItem:{
            public_id:mycloud.public_id,
            url:mycloud.secure_url,
        }
    })
})

export const deleteInventory=catchAsyncError(async(req,res,next)=>{
    const {id}=req.params;
    const inventory=await Inventory.findById(id)
    if(!inventory) return next(new ErrorHandler('Not Found',404))
    await inventory.remove()
    res.status().json({
        success:true,
        message:'Deleted'
    })
})

export const getAllInventory=catchAsyncError(async(req,res,next)=>{
    const inventory=await Inventory.find().populate('createdBy').sort({
        createdAt:-1
    })
    res.status(200).json({
        success:true,
        inventory
    })
})