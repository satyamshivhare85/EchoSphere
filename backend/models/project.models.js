// import mongoose from "mongoose";

// const projectSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true
//     },

//     description: {
//       type: String,
//       required: true
//     },

//     owner: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true
//     },

//     // REQUIRED SKILLS (no level now)
//     requiredSkills: {
//       type: [String], // simple array of skills
//       required: true,
//       validate: {
//         validator: function (arr) {
//           return arr.length > 0;
//         },
//         message: "At least one required skill is needed"
//       }
//     },

//     status: {
//       type: String,
//       enum: ["upcoming", "active", "completed", "closed"],
//       default: "active"
//     },

//     maxMembers: {
//       type: Number,
//       required: true,
//       min: 1
//     },

//     members: [
//       {
//         userId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "User"
//         },
//         role: {
//           type: String,
//           default: "contributor"
//         }
//       }
//     ]
//   },
//   { timestamps: true }
// );



// const Project = mongoose.model("Project", projectSchema);

// export default Project;
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // GitHub link of the owner
    githubLink: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          // Simple regex to validate GitHub URLs
          return !v || /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+\/?$/.test(v);
        },
        message: props => `${props.value} is not a valid GitHub URL!`
      }
    },

    // REQUIRED SKILLS (no level now)
    requiredSkills: {
      type: [String], // simple array of skills
      required: true,
      validate: {
        validator: function (arr) {
          return arr.length > 0;
        },
        message: "At least one required skill is needed"
      }
    },

    status: {
      type: String,
      enum: ["upcoming", "active", "completed", "closed"],
      default: "active"
    },

    maxMembers: {
      type: Number,
      required: true,
      min: 1
    },

    members: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        role: {
          type: String,
          default: "contributor"
        }
      }
    ],
    joinRequests: [
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    requestedAt: {
      type: Date,
      default: Date.now
    }
  }
]
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
