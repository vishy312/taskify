import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import asyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
  const accessToken =
    req.cookies.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!accessToken) {
    throw new ApiError("Unauthorized request", 401);
  }
  
  const decodedToken = await jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET
  );
  // console.log(decodedToken)
  
  if (!decodedToken) {
    
    throw new ApiError("Access Token is expired", 403);
  }

  const user = await User.findById(decodedToken._id).select("-password -refreshToken");
  if (!user) {
    throw new ApiError("user does not exist", 408);
  }

  req.user = user;
  next();
});

export default verifyJWT