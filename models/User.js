import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const schema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Enter Your Name'],
    },
    email:{
        type:String,
        required:[true,'Enter Your Email'],
        unique:true,
        validate:validator.isEmail
    },
    password:{
        type:String,
        required:[true,'Enter Your Password'],
        minLength:[6,'must be six letter or more'],
        select:false,
    },
    avatar:{
        public_id:String,
        url:String,
    },
    role:{
        type:String,
        enum:['admin','user'],
        default:'user',
    },  
    subscription:{
        id:String,
        status:String
    }
})

schema.pre("save",async function(next){
    if(!this.isModified('password')) return next()
    this.passsword=await bcrypt.hash(this.passsword,10)
    next()
})

schema.methods.getJWTToken=function () {
    return jwt.sign(
        {_id:this._id},
        process.env.JWT_SECRET,
        {expiresIn:"15d"}
        )
}

schema.methods.comparePassword=async function(password){
return await bcrypt.compare(password,this.password)
}

export const User=mongoose.model('User',schema)