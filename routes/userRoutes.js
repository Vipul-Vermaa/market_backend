import  express  from "express";
import { changePassword, changeProfilePicture, getMyProfile, login, logout, register, updateProfile } from "../controllers/userController.js";
import singleUpload from "../middlewares/multer.js";
import {isAuthenticated} from '../middlewares/auth.js'


const router=express.Router()

router.route('/register').post(singleUpload,register)
router.route('/login').post(login)
router.route('/logout').get(logout)

router.route('/updateprofile').put(isAuthenticated,updateProfile)
router.route('/updateprofilepicture').put(isAuthenticated,singleUpload,changeProfilePicture)

router.route('/changepassword').put(isAuthenticated,changePassword)

router.route('/me').get(isAuthenticated,getMyProfile)

export default router