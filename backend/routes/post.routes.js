import express from "express"
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";
import { comment, createPost, getPost, like } from "../controllers/post.controllers.js";
const postRouter=express.Router();
postRouter.post(
  "/create",
  isAuth,
  upload.array("media", 10), // 🔥 max 10 files
  createPost
);
postRouter.get('/getpost', isAuth, getPost);
export default postRouter;

postRouter.put('/like/:id',isAuth,like);
postRouter.post('/comment/:id',isAuth,comment)