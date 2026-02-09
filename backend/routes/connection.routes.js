import express from "express";
import isAuth from "../middlewares/isAuth.js"
import {acceptConnection, getConnectionRequests, getConnectionStatus, getUserConnections, rejectConnection, removeConnection, sendRequest} from "../controllers/connection.controllers.js"
const Connectionrouter = express.Router();

Connectionrouter.post("/send/:userId", isAuth, sendRequest);
Connectionrouter.post("/accept/:connectionId", isAuth, acceptConnection);
Connectionrouter.post("/reject/:connectionId", isAuth, rejectConnection);
Connectionrouter.delete("/remove/:userId", isAuth, removeConnection);
Connectionrouter.get("/status/:userId", isAuth, getConnectionStatus);
Connectionrouter.get("/requests", isAuth, getConnectionRequests);
Connectionrouter.get("/my", isAuth, getUserConnections);

export default Connectionrouter;
