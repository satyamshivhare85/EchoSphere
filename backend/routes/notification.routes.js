import express from 'express'
import isAuth from '../middlewares/isAuth.js'
import { getNotifications, markAsRead } from '../controllers/notification.controllers.js'

const NotificationRouter=express.Router()

NotificationRouter.get('/',isAuth,getNotifications)
NotificationRouter.patch('/:id/read',isAuth,markAsRead)
export default NotificationRouter