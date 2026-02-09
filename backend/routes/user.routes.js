import express, { Router } from "express"
import { getAllUsers, getCurrentUser,getProfileById,getSuggestedUsers,searchUser,updateProfile } from "../controllers/user.controllers.js";
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";
const UserRouter=express.Router();

UserRouter.get('/currentuser',isAuth,getCurrentUser);
UserRouter.put(
  "/updateprofile",
  isAuth,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
 updateProfile
);
UserRouter.get("/searchuser", isAuth, searchUser);
UserRouter.get('/suggestedusers',isAuth,getSuggestedUsers)
UserRouter.get("/:id",isAuth, getProfileById); 
UserRouter.get("/", isAuth, getAllUsers);
export default UserRouter;