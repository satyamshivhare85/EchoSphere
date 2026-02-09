import User from "../models/user.model.js";
import genToken from "../config/token.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    // 1️⃣ Take input
    const { firstname, lastname, username, email, password } = req.body;

    if (!firstname || !lastname || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // 2️⃣ Check email
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already in use." });
    }

    // 3️⃣ Check username
    const existingUsername = await User.findOne({ username: username.toLowerCase() });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken." });
    }

    // 4️⃣ Strong password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
      });
    }

    // 5️⃣ Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 6️⃣ Create & save user
    const newUser = await User.create({
      firstname,
      lastname,
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    // 7️⃣ Generate JWT
    const token = genToken(newUser._id);

    // 8️⃣ Store JWT in cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "none",
      secure: process.env.NODE_ENVIRONMENT === "production",
    });

    // 9️⃣ Response
    res.status(201).json({
      message: "User registered successfully",
      userId: newUser._id,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};



export const login = async (req, res) => {
  try {
    // 1️⃣ Take input
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // 2️⃣ Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // 3️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // 4️⃣ Generate JWT
    const token = genToken(user._id);

    // 5️⃣ Store token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: process.env.NODE_ENVIRONMENT === "production",
    });

    // 6️⃣ Send response (NEVER send password)
    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login error" });
  }
};


export const logout=async (req,res)=>{
    try{
        res.clearCookie("token")
        res.status(200).json({message: "user succesfully logout"})

    }
    catch(error){
        console.log(error);
        return res.status(400).json({message:"logout error"});

    }
}
