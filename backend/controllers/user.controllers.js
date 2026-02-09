import User from "../models/user.model.js";
import UploadOnCloudinary from "../config/cloudinary.js";
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User
      .findById(req.userId) //req.userId ye isAuth middleware se use ho rha hai
      .select("-password -__v");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found or token invalid"
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });

  } catch (error) {
    console.error("GetCurrentUser Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// export const updateProfile = async (req, res) => {
//   try {
//     const {
//       firstname,
//       lastname,
//       username,
//       headline,
//       about,
//       location,
//       gender,
//     } = req.body;

//     // ---------- SAFE PARSING ----------
//     const skills = req.body.skills ? JSON.parse(req.body.skills) : [];
//     let education = req.body.education ? JSON.parse(req.body.education) : [];
//     let experience = req.body.experience ? JSON.parse(req.body.experience) : [];
//     let projects = req.body.projects ? JSON.parse(req.body.projects) : [];
//     const socialLinks = req.body.socialLinks
//       ? JSON.parse(req.body.socialLinks)
//       : {};

//     // ---------- PROJECTS FIX ----------
//     projects = projects
//       .filter((p) => p.title && p.title.trim() !== "") // 🔥 REQUIRED FIELD FIX
//       .map((proj) => ({
//         title: proj.title.trim(),
//         description: proj.description || "",
//         link: proj.link || "",
//         technologies: Array.isArray(proj.technologies)
//           ? proj.technologies
//           : proj.technologies
//           ? proj.technologies.split(",").map((t) => t.trim())
//           : [],
//       }));

//     // ---------- EDUCATION DATE FIX ----------
//     education = education.map((edu) => ({
//       institution: edu.institution || "",
//       degree: edu.degree || "",
//       fieldOfStudy: edu.fieldOfStudy || "",
//       startDate:
//         edu.startDate && edu.startDate !== ""
//           ? new Date(edu.startDate)
//           : undefined,
//       endDate:
//         edu.endDate && edu.endDate !== ""
//           ? new Date(edu.endDate)
//           : undefined,
//     }));

//     // ---------- EXPERIENCE DATE FIX ----------
//     experience = experience.map((exp) => ({
//       role: exp.role || "",
//       company: exp.company || "",
//       description: exp.description || "",
//       startDate:
//         exp.startDate && exp.startDate !== ""
//           ? new Date(exp.startDate)
//           : undefined,
//       endDate:
//         exp.endDate && exp.endDate !== ""
//           ? new Date(exp.endDate)
//           : undefined,
//     }));

//     // ---------- IMAGES ----------
//     let profileImage;
//     let coverImage;

//     if (req.files?.profileImage) {
//       profileImage = await UploadOnCloudinary(
//         req.files.profileImage[0].path
//       );
//     }

//     if (req.files?.coverImage) {
//       coverImage = await UploadOnCloudinary(
//         req.files.coverImage[0].path
//       );
//     }

//     // ---------- UPDATE ----------
//     const updatedUser = await User.findByIdAndUpdate(
//       req.userId,
//       {
//         firstname,
//         lastname,
//         username,
//         headline,
//         about,
//         location,
//         gender,
//         skills,
//         education,
//         experience,
//         projects,
//         socialLinks,
//         ...(profileImage && { profileImage }),
//         ...(coverImage && { coverImage }),
//       },
//       {
//         new: true,
//         runValidators: true,
//       }
//     ).select("-password");

//     return res.status(200).json({
//       success: true,
//       data: updatedUser,
//     });
//   } catch (error) {
//     console.error("Update profile error ❌", error);
//     return res.status(500).json({
//       success: false,
//       message: "Update profile failed",
//       error: error.message,
//     });
//   }
// };


// ---------------- UPDATE PROFILE ----------------
export const updateProfile = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      username,
      headline,
      about,
      location,
      gender,
    } = req.body;

    // Safe parsing for array/object fields
    const skills = req.body.skills ? JSON.parse(req.body.skills) : [];
    let education = req.body.education ? JSON.parse(req.body.education) : [];
    let experience = req.body.experience ? JSON.parse(req.body.experience) : [];
    let projects = req.body.projects ? JSON.parse(req.body.projects) : [];
    const socialLinks = req.body.socialLinks
      ? JSON.parse(req.body.socialLinks)
      : {};

    // Helper to safely parse date or return null
    const parseDate = (date) => {
      const d = new Date(date);
      return isNaN(d.valueOf()) ? null : d;
    };

    // Format projects
    projects = projects
      .filter((p) => p.title && p.title.trim() !== "")
      .map((proj) => ({
        title: proj.title.trim(),
        description: proj.description || "",
        link: proj.link || "",
        technologies: Array.isArray(proj.technologies)
          ? proj.technologies
          : proj.technologies
          ? proj.technologies.split(",").map((t) => t.trim())
          : [],
      }));

    // Format education
    education = education.map((edu) => ({
      institution: edu.institution || "",
      degree: edu.degree || "",
      fieldOfStudy: edu.fieldOfStudy || "",
      startDate: edu.startDate ? parseDate(edu.startDate) : null,
      endDate: edu.endDate ? parseDate(edu.endDate) : null,
    }));

    // Format experience
    experience = experience.map((exp) => ({
      role: exp.role || "",
      company: exp.company || "",
      description: exp.description || "",
      startDate: exp.startDate ? parseDate(exp.startDate) : null,
      endDate: exp.endDate ? parseDate(exp.endDate) : null,
    }));

    // Handle images
    let profileImage;
    let coverImage;

    if (req.files?.profileImage) {
      profileImage = await UploadOnCloudinary(req.files.profileImage[0].path);
    }
    if (req.files?.coverImage) {
      coverImage = await UploadOnCloudinary(req.files.coverImage[0].path);
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        firstname,
        lastname,
        username,
        headline,
        about,
        location,
        gender,
        skills,
        education,
        experience,
        projects,
        socialLinks,
        ...(profileImage && { profileImage }),
        ...(coverImage && { coverImage }),
      },
      { new: true, runValidators: false } // <-- less strict validation
    ).select("-password");

    return res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error ❌", error);
    return res.status(500).json({
      success: false,
      message: "Update profile failed",
      error: error.message,
    });
  }
};

export const getProfileById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      // Optional: populate posts if needed

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const searchUser = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(200).json({ users: [] });
    }

    const users = await User.find({
      $or: [
        { firstname: { $regex: query, $options: "i" } },
        { lastname: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
      ],
    })
      .select("firstname lastname username profileImage headline")
      .limit(10);

    return res.status(200).json({ users });
  } catch (error) {
    console.error("SEARCH USER ERROR ❌", error);
    return res.status(500).json({
      message: "Search failed",
      error: error.message,
    });
  }
};



export const getSuggestedUsers = async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId).select("connections");

    const suggestedUsers = await User.find({
      _id: {
        $ne: req.userId,
        $nin: currentUser.connections,
      },
    }).select("-password");

    return res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "suggested user error" });
  }
};


// GET all users (for group creation)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.userId } }) // exclude self
      .select("firstname lastname username profileImage headline");
    res.status(200).json({ users });
  } catch (err) {
    console.error("GetAllUsers Error:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};



// //  req.userId = logged-in user
// //  req.params.id = kisi bhi user ka profile-->routes ke sth jati hai
// //  jb search krte hai query jati hai frontend me hi handle kr lete hai bs
