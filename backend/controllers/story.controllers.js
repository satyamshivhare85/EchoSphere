// import Story from "../models/story.model.js";

// // Create a new story
// export const createStory = async (req, res) => {
//   try {
//     const { content } = req.body;
//     if (!content) return res.status(400).json({ msg: "Story content is required" });

//     const story = await Story.create({ content });
//       // ✅ Emit new story to all connected clients

//     res.status(201).json(story);
//   } catch (err) {
//     res.status(500).json({ msg: "Server error", error: err.message });
//   }
// };

// // Get all stories (latest first)
// export const getStories = async (req, res) => {
//   try {
//     const stories = await Story.find().sort({ createdAt: -1 });
//     res.json(stories);
//   } catch (err) {
//     res.status(500).json({ msg: "Server error", error: err.message });
//   }
// };

// // Add a reply to a story
// export const addReply = async (req, res) => {
//   try {
//     const { storyId } = req.params;
//     const { content } = req.body;
//     if (!content) return res.status(400).json({ msg: "Reply content is required" });

//     const story = await Story.findById(storyId);
//     if (!story) return res.status(404).json({ msg: "Story not found" });

//     story.replies.push({ content });
//     await story.save();

//     res.json(story);
//   } catch (err) {
//     res.status(500).json({ msg: "Server error", error: err.message });
//   }
// };


import Story from "../models/story.model.js";
import { io } from "../socket/socket.js"; 

// Create a new story
export const createStory = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ msg: "Story content is required" });

    const story = await Story.create({ content });

    // ✅ Emit new story to all connected clients
    io.emit("newStory", story);

    res.status(201).json(story);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Get all stories (latest first)
export const getStories = async (req, res) => {
  try {
    const stories = await Story.find().sort({ createdAt: -1 });
    res.json(stories);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Add a reply to a story
export const addReply = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { content } = req.body;
    if (!content) return res.status(400).json({ msg: "Reply content is required" });

    const story = await Story.findById(storyId);
    if (!story) return res.status(404).json({ msg: "Story not found" });

    const newReply = { content };
    story.replies.push(newReply);
    await story.save();

    // ✅ Emit new reply to all connected clients
    io.emit("newReply", { storyId, reply: newReply });

    res.json(story);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
