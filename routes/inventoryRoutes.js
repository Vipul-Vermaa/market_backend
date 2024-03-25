import express from 'express'
import singleUpload from '../middlewares/multer.js'
import {isAuthenticated,isSubscribed} from '../middlewares/auth.js'
import {catchAsyncError} from '../middlewares/catchAsyncError.js'
import { createInventory, deleteInventory, getAllInventory } from '../controllers/inventoryController.js'

const router=express.Router()

router.route('/createinventory').post(isAuthenticated,isSubscribed,createInventory)

router.route('/inventory/:id').delete(isAuthenticated,isSubscribed,deleteInventory)

router.route('/inventory').get(getAllInventory)

export default router