// import express from "express";
// import {
//   createProject,
//   getAllProjects,
//   getMatchedProjects,
//   getProjectById,
//   requestJoinProject,
//   handleJoinRequest,
//   getJoinRequests
// } from "../controllers/project.controllers.js";
// import isAuth from "../middlewares/isAuth.js";

// const Projectrouter = express.Router();

// // ================= PROJECT CREATION =================
// Projectrouter.post("/create", isAuth, createProject);

// // ================= GET PROJECTS =================
// Projectrouter.get("/all", getAllProjects);
// Projectrouter.get("/project/:projectId", isAuth, getProjectById);
// Projectrouter.get("/ai/match", isAuth, getMatchedProjects);

// // ================= JOIN REQUEST SYSTEM =================
// Projectrouter.post("/request/:projectId", isAuth, requestJoinProject); // send join request
// Projectrouter.post("/handle-request", isAuth, handleJoinRequest);      // owner approves/rejects
// Projectrouter.get("/requests/:projectId", isAuth, getJoinRequests);   // owner sees pending requests

// export default Projectrouter;


import express from "express";
import {
  createProject,
  getAllProjects,
  getMatchedProjects,
  getProjectById,
  requestJoinProject,
  handleJoinRequest,
  getJoinRequests
} from "../controllers/project.controllers.js";
import isAuth from "../middlewares/isAuth.js";

const Projectrouter = express.Router();

// CREATE PROJECT
Projectrouter.post("/create", isAuth, createProject);

// GET ALL PROJECTS
Projectrouter.get("/all", getAllProjects);

// GET PROJECT BY ID
Projectrouter.get("/project/:projectId", isAuth, getProjectById);

// AI MATCHES
Projectrouter.get("/ai/match", isAuth, getMatchedProjects);

// JOIN REQUESTS
Projectrouter.post("/request/:projectId", isAuth, requestJoinProject);
Projectrouter.post("/handle-request", isAuth, handleJoinRequest);
Projectrouter.get("/requests/:projectId", isAuth, getJoinRequests);

export default Projectrouter;
