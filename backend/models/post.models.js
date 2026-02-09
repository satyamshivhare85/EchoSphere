import mongoose from "mongoose";

// Subdocument schema for comments
const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

// Media schema (image / video)
const mediaSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ["image", "video"],
    required: true
  }
});

// Main Post schema
const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  description: {
    type: String,
    default: "",
    required:"true",
    trim: true
  },

  media: {
    type: [mediaSchema], // 👈 multiple images & videos
    default: []
  },

  like: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  comment: {
    type: [commentSchema],
    default: []
  }

}, { timestamps: true });

// index for latest posts
postSchema.index({ createdAt: -1 });

const Post = mongoose.model("Post", postSchema);
export default Post;




// { example how things will store in Db
//   "author": "65abc123...",
//   "description": "My travel memories 🌍",
//   "media": [
//     {
//       "url": "https://cloudinary.com/image1.jpg",
//       "type": "image"
//     },
//     {
//       "url": "https://cloudinary.com/video1.mp4",
//       "type": "video"
//     },
//     {
//       "url": "https://cloudinary.com/image2.jpg",
//       "type": "image"
//     }
//   ],
//   "like": [],
//   "comment": []
// }
