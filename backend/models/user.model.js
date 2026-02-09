import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
 firstname: {
    type: String,
    required: true,
    trim: true,
  },
  lastname:{
      type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage:{
    type: String, // URL
    default: "",
  },
 coverImage:{
    type: String, // URL
    default: "",
  },
  headline:{
     type:String,
        default:""
  },
  about: {
    type: String,
    maxlength: 2500,
  },
 
  skills: [
    {
      type: String,
      trim: true,
    },
  ],
  projects: [
    {
      title: { type: String, required: true },
      description: { type: String },
      link: { type: String },
      technologies: [String],
      createdAt: { type: Date, default: Date.now },
    },
  ],
   location: {
    type: String,
    default:"India"
  },
  gender:{
    type:String,
    enum:['male','female','other']
  },
  connections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  experience: [
    {
      role: String,
      company: String,
      startDate: Date,
      endDate: Date,
      description: String,
    },
  ],
  education: [
    {
      institution: String,
      degree: String,
      fieldOfStudy: String,
      startDate: Date,
      endDate: Date,
    },
  ],
  socialLinks: {
    linkedin: String,
    github: String,
    portfolio: String,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
