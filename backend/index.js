import express from "express"
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cors from "cors"
import UserRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import Connectionrouter from "./routes/connection.routes.js";
import NotificationRouter from "./routes/notification.routes.js";
import Projectrouter from "./routes/project.routes.js";
import Messagerouter from "./routes/message.routes.js";
import StoryRouter from "./routes/story.routes.js";
import { app, server } from "./socket/socket.js";

dotenv.config();
// const app=express(); 
let port=process.env.PORT||5000;
app.use(express.json());    
app.use(cookieParser());     
app.use(express.urlencoded({ extended: true })); 
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

//testing
 app.get('/',(req,res)=>{
    res.send("nice to meet you")
})

//Routes
app.use("/api/auth",authRouter)
app.use("/api/user",UserRouter)
app.use("/api/post",postRouter)
app.use("/api/connections", Connectionrouter);
app.use("/api/notifications",NotificationRouter);
app.use("/api/project",Projectrouter);
app.use('/api/chat',Messagerouter)
app.use('/api/story',StoryRouter)

server.listen(port,async()=>{
   await  connectDb();
    console.log("server started");
})