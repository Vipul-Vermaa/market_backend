import app from "./app.js";
import { connectDB } from "./config/Database.js";
import {v2 as cloudinary} from 'cloudinary';
import Razorpay from'razorpay'
  
connectDB()

cloudinary.config({ 
  cloud_name:process.env.CLOUDINARY_CLIENT_NAME , 
  api_key:process.env.CLOUDINARY_CLIENT_API , 
  api_secret:process.env.CLOUDINARY_CLIENT_SECRET  
});

export const instance=new Razorpay({
    key_id:process.env.RAZORPAY_API_KEY,
    key_secret:process.env.RAZORPAY_API_SECRET,
})


app.listen(process.env.PORT,()=>{
    console.log(`server is working on port ${process.env.PORT} `)
})


