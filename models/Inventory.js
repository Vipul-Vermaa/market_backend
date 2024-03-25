import mongoose from "mongoose";
const schema=new mongoose.Schema({
    
    title:{
        type:String,
        required:true,
    },

    description:{
        type:String,
        required:true,
    },

    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required:true, 
    },

    inventoryItem: {
        type: String,
        required: true
    },
    
    createdAt:{
        type:Date,
        default:Date.now,
    },
    
})

export const Inventory=mongoose.model("Inventory",schema)