// import Project from "../models/project.models.js";
// import User from "../models/user.model.js"

// // export const createProject = async (req, res) => {
// //   try {
// //     if (!req.userId) {
// //       return res.status(401).json({ msg: "User not authenticated" });
// //     }

// //     const { name, description, requiredSkills, maxMembers } = req.body;

// //     // Basic validation
// //     if (
// //       !name ||
// //       !description ||
// //       !Array.isArray(requiredSkills) ||
// //       requiredSkills.length === 0 ||
// //       !maxMembers
// //     ) {
// //       return res.status(400).json({ msg: "All fields are required" });
// //     }

// //     const project = await Project.create({
// //       name,
// //       description,
// //       requiredSkills,
// //       maxMembers,
// //       owner: req.userId,
// //       members: [{ userId: req.userId, role: "owner" }]
// //     });

// //     res.status(201).json(project);
// //   } catch (err) {
// //     console.error("❌ CREATE PROJECT ERROR:", err);
// //     res.status(500).json({ error: err.message });
// //   }
// // };

// export const createProject = async (req, res) => {
//   try {
//     if (!req.userId) {
//       return res.status(401).json({ msg: "User not authenticated" });
//     }

//     const { name, description, requiredSkills, maxMembers, githubLink } = req.body;

//     // Basic validation
//     if (
//       !name ||
//       !description ||
//       !Array.isArray(requiredSkills) ||
//       requiredSkills.length === 0 ||
//       !maxMembers
//     ) {
//       return res.status(400).json({ msg: "All fields are required" });
//     }

//     // Optional: validate GitHub URL if provided
//     if (githubLink && !/^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+\/?$/.test(githubLink)) {
//       return res.status(400).json({ msg: "Invalid GitHub URL" });
//     }

//     const project = await Project.create({
//       name,
//       description,
//       requiredSkills,
//       maxMembers,
//       githubLink,              // ✅ Save GitHub link
//       owner: req.userId,
//       members: [{ userId: req.userId, role: "owner" }]
//     });

//     res.status(201).json(project);
//   } catch (err) {
//     console.error("❌ CREATE PROJECT ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// };


// export const joinProject = async (req, res) => {
//   try {
//     if (!req.userId) {
//       return res.status(401).json({ msg: "Unauthorized" });
//     }

//     const project = await Project.findById(req.params.projectId);
//     if (!project) {
//       return res.status(404).json({ msg: "Project not found" });
//     }

//     // ❌ Project already closed
//     if (project.status === "closed") {
//       return res.status(403).json({ msg: "Project is closed" });
//     }

//     // ❌ Already joined
//     const alreadyJoined = project.members.some(
//       m => String(m.userId) === String(req.userId)
//     );
//     if (alreadyJoined) {
//       return res.status(400).json({ msg: "Already joined" });
//     }

//     // ❌ Max members reached BEFORE joining
//     if (project.members.length >= project.maxMembers) {
//       project.status = "closed";
//       await project.save();
//       return res.status(403).json({ msg: "Project is full" });
//     }

//     // ✅ Add member
//     project.members.push({ userId: req.userId });

//     // 🔥 AUTO CLOSE AFTER JOIN IF LIMIT REACHED
//     if (project.members.length >= project.maxMembers) {
//       project.status = "closed";
//     }

//     await project.save();

//     // ✅ Update user document
//     await User.findByIdAndUpdate(req.userId, {
//       $push: {
//         enrolledProjects: {
//           projectId: project._id,
//           role: "contributor"
//         }
//       }
//     });

//     res.json({
//       msg: "Joined project successfully",
//       status: project.status
//     });
//   } catch (err) {
//     console.error("❌ JOIN PROJECT ERROR:", err);
//     res.status(500).json({ msg: err.message });
//   }
// };

// export const getAllProjects = async (req, res) => {
//   try {
//     const projects = await Project.find()
//       .populate("owner", "firstname lastname username profileImage")
//       .sort({ createdAt: -1 });

//     res.json(projects);
//   } catch (err) {
//     console.error("❌ GET PROJECTS ERROR:", err);
//     res.status(500).json({ msg: err.message });
//   }
// };


// export const getMatchedProjects = async (req, res) => {
//   try {
//     const userId = req.userId;

//     const user = await User.findById(userId).select("skills");
//     if (!user || !user.skills?.length) {
//       return res.json([]);
//     }

//     const projects = await Project.find({
//       owner: { $ne: userId },                 // ❌ not owner
//       "members.userId": { $ne: userId },      // ❌ not already joined
//       status: { $ne: "closed" }               // ❌ closed projects
//     });

//     const userSkills = user.skills.map(s => s.toLowerCase());

//     const matchedProjects = projects.map(project => {
//       const requiredSkills = project.requiredSkills.map(s =>
//         s.toLowerCase()
//       );

//       const matchedSkills = requiredSkills.filter(skill =>
//         userSkills.includes(skill)
//       );

//       const matchScore = Math.round(
//         (matchedSkills.length / requiredSkills.length) * 100
//       );

//       return {
//         projectId: project._id,
//         name: project.name,
//         matchScore,
//         matchedSkills,
//         requiredSkills
//       };
//     })
//     .filter(p => p.matchScore > 0)     // remove zero match
//     .sort((a, b) => b.matchScore - a.matchScore); // best first

//     res.json(matchedProjects);
//   } catch (err) {
//     console.error("AI MATCH ERROR:", err);
//     res.status(500).json({ msg: err.message });
//   }
// };

// export const getProjectById = async (req, res) => {
//   try {
//     const { projectId } = req.params;

//     const project = await Project.findById(projectId)
//       .populate("owner", "firstname lastname username profileImage")
//       .populate("members.userId", "firstname lastname username profileImage");

//     if (!project) {
//       return res.status(404).json({ msg: "Project not found" });
//     }

//     res.json(project);
//   } catch (err) {
//     console.error("❌ GET PROJECT BY ID ERROR:", err);
//     res.status(500).json({ msg: err.message });
//   }
// };

// export const requestJoinProject = async (req, res) => {
//   try {
//     if (!req.userId) {
//       return res.status(401).json({ msg: "Unauthorized" });
//     }

//     const project = await Project.findById(req.params.projectId);
//     if (!project) return res.status(404).json({ msg: "Project not found" });

//     // Already a member
//     if (project.members.some(m => String(m.userId) === req.userId)) {
//       return res.status(400).json({ msg: "You are already a member" });
//     }

//     // Already requested
//     if (project.joinRequests.some(r => String(r.userId) === req.userId)) {
//       return res.status(400).json({ msg: "Join request already sent" });
//     }

//     // Add request
//     project.joinRequests.push({ userId: req.userId });
//     await project.save();

//     res.json({ msg: "Join request sent successfully" });
//   } catch (err) {
//     console.error("❌ REQUEST JOIN ERROR:", err);
//     res.status(500).json({ msg: err.message });
//   }
// };

// export const handleJoinRequest = async (req, res) => {
//   try {
//     const { projectId, userId, action } = req.body; // action = "approve" | "reject"

//     const project = await Project.findById(projectId);
//     if (!project) return res.status(404).json({ msg: "Project not found" });

//     // Only owner can approve/reject
//     if (String(project.owner) !== req.userId) {
//       return res.status(403).json({ msg: "Not authorized" });
//     }

//     const requestIndex = project.joinRequests.findIndex(
//       r => String(r.userId) === userId
//     );

//     if (requestIndex === -1) {
//       return res.status(404).json({ msg: "Request not found" });
//     }

//     if (action === "approve") {
//       // Add to members
//       project.members.push({ userId, role: "contributor" });

//       // Remove from joinRequests
//       project.joinRequests.splice(requestIndex, 1);

//       // Auto-close if maxMembers reached
//       if (project.members.length >= project.maxMembers) {
//         project.status = "closed";
//       }

//       await project.save();

//       // Optionally update user's enrolledProjects
//       await User.findByIdAndUpdate(userId, {
//         $push: { enrolledProjects: { projectId, role: "contributor" } }
//       });

//       return res.json({ msg: "Request approved, user added to project" });
//     } else if (action === "reject") {
//       project.joinRequests.splice(requestIndex, 1);
//       await project.save();
//       return res.json({ msg: "Request rejected" });
//     } else {
//       return res.status(400).json({ msg: "Invalid action" });
//     }
//   } catch (err) {
//     console.error("❌ HANDLE REQUEST ERROR:", err);
//     res.status(500).json({ msg: err.message });
//   }
// };


// export const getJoinRequests = async (req, res) => {
//   try {
//     const project = await Project.findById(req.params.projectId)
//       .populate("joinRequests.userId", "firstname lastname username profileImage");

//     if (!project) return res.status(404).json({ msg: "Project not found" });

//     if (String(project.owner) !== req.userId) {
//       return res.status(403).json({ msg: "Not authorized" });
//     }

//     res.json(project.joinRequests);
//   } catch (err) {
//     console.error("❌ GET REQUESTS ERROR:", err);
//     res.status(500).json({ msg: err.message });
//   }
// };


import Project from "../models/project.models.js";
import User from "../models/user.model.js";

// ================= CREATE PROJECT =================
export const createProject = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ msg: "User not authenticated" });
    }

    const { name, description, requiredSkills, maxMembers, githubLink } = req.body;

    // Basic validation
    if (
      !name ||
      !description ||
      !Array.isArray(requiredSkills) ||
      requiredSkills.length === 0 ||
      !maxMembers
    ) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Optional: validate GitHub URL if provided
    if (githubLink && !/^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+\/?$/.test(githubLink)) {
      return res.status(400).json({ msg: "Invalid GitHub URL" });
    }

    const project = await Project.create({
      name,
      description,
      requiredSkills,
      maxMembers,
      githubLink,              // ✅ Save GitHub link
      owner: req.userId,
      members: [{ userId: req.userId, role: "owner" }]
    });

    res.status(201).json(project);
  } catch (err) {
    console.error("❌ CREATE PROJECT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ================= REQUEST TO JOIN PROJECT =================
export const requestJoinProject = async (req, res) => {
  try {
    if (!req.userId) return res.status(401).json({ msg: "Unauthorized" });

    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ msg: "Project not found" });

    // Already a member
    if (project.members.some(m => String(m.userId) === req.userId)) {
      return res.status(400).json({ msg: "You are already a member" });
    }

    // Already requested
    if (project.joinRequests.some(r => String(r.userId) === req.userId)) {
      return res.status(400).json({ msg: "Join request already sent" });
    }

    // Add request
    project.joinRequests.push({ userId: req.userId });
    await project.save();

    res.json({ msg: "Join request sent successfully" });
  } catch (err) {
    console.error("❌ REQUEST JOIN ERROR:", err);
    res.status(500).json({ msg: err.message });
  }
};

// ================= HANDLE JOIN REQUEST (APPROVE/REJECT) =================
export const handleJoinRequest = async (req, res) => {
  try {
    const { projectId, userId, action } = req.body; // action = "approve" | "reject"

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ msg: "Project not found" });

    // Only owner can approve/reject
    if (String(project.owner) !== req.userId) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    const requestIndex = project.joinRequests.findIndex(r => String(r.userId) === userId);
    if (requestIndex === -1) return res.status(404).json({ msg: "Request not found" });

    if (action === "approve") {
      // Add to members
      project.members.push({ userId, role: "contributor" });

      // Remove from joinRequests
      project.joinRequests.splice(requestIndex, 1);

      // Auto-close if maxMembers reached
      if (project.members.length >= project.maxMembers) project.status = "closed";

      await project.save();

      // Update user's enrolledProjects
      await User.findByIdAndUpdate(userId, {
        $push: { enrolledProjects: { projectId, role: "contributor" } }
      });

      return res.json({ msg: "Request approved, user added to project" });
    } else if (action === "reject") {
      project.joinRequests.splice(requestIndex, 1);
      await project.save();
      return res.json({ msg: "Request rejected" });
    } else {
      return res.status(400).json({ msg: "Invalid action" });
    }
  } catch (err) {
    console.error("❌ HANDLE REQUEST ERROR:", err);
    res.status(500).json({ msg: err.message });
  }
};

// ================= GET ALL JOIN REQUESTS (OWNER ONLY) =================
// export const getJoinRequests = async (req, res) => {
//   try {
//     const project = await Project.findById(req.params.projectId)
//       .populate("joinRequests.userId", "firstname lastname username profileImage");

//     if (!project) return res.status(404).json({ msg: "Project not found" });
//     if (String(project.owner) !== req.userId) return res.status(403).json({ msg: "Not authorized" });

//     res.json(project.joinRequests);
//   } catch (err) {
//     console.error("❌ GET REQUESTS ERROR:", err);
//     res.status(500).json({ msg: err.message });
//   }
// };
export const getJoinRequests = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)
      .populate("joinRequests.userId", "firstname lastname username profileImage");

    if (!project) return res.status(404).json({ msg: "Project not found" });

    // Only owner can view
    if (String(project.owner) !== req.userId) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    res.json(project.joinRequests); // ✅ sends array with populated user info
  } catch (err) {
    console.error("❌ GET REQUESTS ERROR:", err);
    res.status(500).json({ msg: err.message });
  }
};


// ================= GET ALL PROJECTS =================
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("owner", "firstname lastname username profileImage")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    console.error("❌ GET PROJECTS ERROR:", err);
    res.status(500).json({ msg: err.message });
  }
};

// ================= GET PROJECT BY ID =================
export const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId)
      .populate("owner", "firstname lastname username profileImage")
      .populate("members.userId", "firstname lastname username profileImage");

    if (!project) return res.status(404).json({ msg: "Project not found" });

    res.json(project);
  } catch (err) {
    console.error("❌ GET PROJECT BY ID ERROR:", err);
    res.status(500).json({ msg: err.message });
  }
};

// ================= GET MATCHED PROJECTS =================
export const getMatchedProjects = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select("skills");
    if (!user || !user.skills?.length) return res.json([]);

    const projects = await Project.find({
      owner: { $ne: userId },                 // not owner
      "members.userId": { $ne: userId },      // not already joined
      status: { $ne: "closed" }               // exclude closed
    });

    const userSkills = user.skills.map(s => s.toLowerCase());

    const matchedProjects = projects.map(project => {
      const requiredSkills = project.requiredSkills.map(s => s.toLowerCase());

      const matchedSkills = requiredSkills.filter(skill => userSkills.includes(skill));

      const matchScore = Math.round((matchedSkills.length / requiredSkills.length) * 100);

      return {
        projectId: project._id,
        name: project.name,
        matchScore,
        matchedSkills,
        requiredSkills
      };
    })
    .filter(p => p.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);

    res.json(matchedProjects);
  } catch (err) {
    console.error("AI MATCH ERROR:", err);
    res.status(500).json({ msg: err.message });
  }
};
