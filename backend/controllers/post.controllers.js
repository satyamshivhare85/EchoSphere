// import Post from "../models/post.models.js";
// import User from "../models/user.model.js"
// import Notification from "../models/notification.model.js"
// import UploadOnCloudinary from "../config/cloudinary.js";


// export const createPost = async (req, res) => {
//   try {
//     const { description } = req.body;

//     const media = [];

//     for (const file of req.files) {
//       const url = await UploadOnCloudinary(file.path);

//       media.push({
//         type: file.mimetype.startsWith("video") ? "video" : "image",
//         url
//       });
//     }

//     const post = await Post.create({
//       author: req.userId,
//       description,
//       media
//     });


//     // 🔹 user ke connections lao
//   const user = await User.findById(userId).select("connections");

//    // 🔔 sab connections ko notification
//   const notifications = user.connections.map((connectionId) => ({
//     receiver: connectionId,
//     sender: userId,
//     type: "new_post",
//     post: post._id,
//   }));

//   if (notifications.length > 0) {
//     await Notification.insertMany(notifications);
//   }
//     res.status(201).json({ success: true, post });

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false });
//   }
// };



// export const getPost = async (req, res) => {
//   try {
//     const posts = await Post.find()
//       .populate("author", "firstname lastname profileImage headline")
//       .populate("like", "firstname lastname profileImage")
//       .populate("comment.user", "firstname lastname profileImage headline")
//       .sort({ createdAt: -1 });

//     return res.status(200).json(posts);
//   } catch (error) {
//     console.error("Get Post Error:", error);
//     return res.status(500).json({ message: "Get post error" });
//   }
// };

// export const like = async (req, res) => {
//   try {
//     const postId = req.params.id;
//     const userId = req.userId; // ✅ EXACT MATCH with isAuth

//     const post = await Post.findById(postId);
//     if (!post) {
//       return res.status(404).json({ message: "Post not found" });
//     }

//     // ensure array
//     if (!post.like) post.like = [];

//     const index = post.like.findIndex(
//       (id) => id.toString() === userId.toString()
//     );

//     let liked = false;

//     if (index !== -1) {
//       // unlike
//       post.like.splice(index, 1);
//     } else {
//       // like (YES, you can like your own post)
//       post.like.push(userId);
//       liked = true;
//     }

//     await post.save();

//     return res.status(200).json({
//       liked,
//       totalLikes: post.like.length,
//     });
//   } catch (error) {
//     console.error("LIKE ERROR:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

// export const comment = async (req, res) => {
//   try {
//     const postId = req.params.id;
//     const userId = req.userId; // ✅ from isAuth
//     const { text } = req.body;

//     if (!text || text.trim() === "") {
//       return res.status(400).json({ message: "Comment cannot be empty" });
//     }

//     const post = await Post.findById(postId);
//     if (!post) {
//       return res.status(404).json({ message: "Post not found" });
//     }

//     const newComment = {
//       user: userId,
//       content: text, // ✅ MUST be `content` (schema required)
//     };

//     post.comment.push(newComment);
//     await post.save();

//     return res.status(200).json({ comment: newComment });
//   } catch (error) {
//     console.error("COMMENT ERROR:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };


import Post from "../models/post.models.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import UploadOnCloudinary from "../config/cloudinary.js";
import { io } from "../socket/socket.js"; // ✅ Socket.IO import

// ================= CREATE POST =================
export const createPost = async (req, res) => {
  try {
    const userId = req.userId;
    const { description } = req.body;

    const media = [];
    for (const file of req.files || []) {
      const url = await UploadOnCloudinary(file.path);
      media.push({
        type: file.mimetype.startsWith("video") ? "video" : "image",
        url,
      });
    }

    const post = await Post.create({
      author: userId,
      description,
      media,
    });

    // Get user's connections
    const user = await User.findById(userId).select("connections");

    // Create notifications for connections
    const notifications = user.connections.map((connectionId) => ({
      receiver: connectionId,
      sender: userId,
      type: "new_post",
      post: post._id,
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    // Populate post author info for frontend
    const populatedPost = await Post.findById(post._id).populate(
      "author",
      "firstname lastname profileImage headline"
    );

    // Emit to all connected clients
    io.emit("newPost", populatedPost);

    res.status(201).json({ success: true, post: populatedPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "firstname lastname profileImage headline")
      .populate("like", "firstname lastname profileImage")
      .populate("comment.user", "firstname lastname profileImage headline")
      .sort({ createdAt: -1 });

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Get Post Error:", error);
    return res.status(500).json({ message: "Get post error" });
  }
};

export const like = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (!post.like) post.like = [];

    const index = post.like.findIndex((id) => id.toString() === userId.toString());
    let liked = false;

    if (index !== -1) {
      post.like.splice(index, 1);
    } else {
      post.like.push(userId);
      liked = true;
    }

    await post.save();

    // ✅ Emit like update in real-time
    io.emit("postLiked", { postId, userId, liked, totalLikes: post.like.length });

    return res.status(200).json({
      liked,
      totalLikes: post.like.length,
    });
  } catch (error) {
    console.error("LIKE ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



export const comment = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const newComment = { user: userId, content: text };
    post.comment.push(newComment);
    await post.save();

    // Fetch full user info for the comment
    const user = await User.findById(userId).select("firstname lastname profileImage headline");
    const fullComment = { ...newComment, user };

    // Emit real-time comment event
    io.emit("postCommented", { postId, comment: fullComment });

    return res.status(200).json({ comment: fullComment });
  } catch (error) {
    console.error("COMMENT ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

