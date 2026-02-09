import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    // 1️⃣ Token exists?
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Login required."
      });
    }
    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ Attach user id to request -->request object me id me user ki id dal do jisse use future me use kr ske user ko khi bhi
    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

export default isAuth;
