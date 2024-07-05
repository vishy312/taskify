import asyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { cookieOptions } from "../constants.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError("user does not exist", 408);
    }

    
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    
    
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const tokens = { accessToken, refreshToken };
    
    return tokens;
  } catch (error) {
    throw new ApiError("something went wrong while generating tokens", 403);
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, fullname, password } = req.body;

  if (
    [username, email, fullname, password].some((field) => field.trim() === "")
  ) {
    throw new ApiError(
      "username, email, fullname, password are required fields",
      400
    );
  }

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError("User already exists", 409);
  }

  const user = await User.create({
    username,
    email,
    fullname,
    password
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError("something went wrong while creating new user", 500);
  }

  return res
    .status(201)
    .json(new ApiResponse("user created successfully", 201, createdUser));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    username,
  });

  if (!user) {
    throw new ApiError("user does not exist", 408);
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError("password is not valid", 407);
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse("user is logged in", 200, {
        user: loggedInUser,
        accessToken,
        refreshToken,
      })
    );
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError("user does not exist", 408);
  }

  const currentUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .json(new ApiResponse("logged in user fetched", 200, currentUser));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.header.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError("Unauthorized request", 401);
  }

  
  const decodedToken = await jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  
  const user = await User.findById(decodedToken._id);
  if (!user) {
    throw new ApiError("Invalid Token", 401);
  }
  
  if (user.refreshToken !== incomingRefreshToken) {
    throw new ApiError("Refresh Token is expired or used", 401);
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  console.log({
    accessToken,
    refreshToken,
  })

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse("access token is refreshed", 200, {
        accessToken,
        refreshToken,
      })
    );
});

const getDetails = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError("user not found", 401)
  }

  const userId = user._id;
  const userDetails = await User.aggregate([
    {
      $match: {
        _id: {$in: [userId]}
      }
    },
  
    {
      $lookup: {
        from: 'projects',
        pipeline: [
          {
            $match: {
              $or: [
                {admins: {$in: [userId]}},
                {members: {$in: [userId]}}
              ]
            }
          },
          {
            $lookup: {
              from: "users",
              localField: "admins",
              foreignField: "_id",
              as: "admins"
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "members",
              foreignField: "_id",
              as: "members"
            }
          }
        ],
        as: "projects"
      }
    },
  
    {
      $lookup: {
        from: "tasks",
        pipeline: [
          {
            $match: {
              $and: [
                {assignedTo: {$in: [userId]}},
                {
                  $or: [
                    {status: "Todo"},
                    {status: "In-progress"}
                  ]
                }
              ]
            }
          },
          {
            $lookup: {
              from: "users",
              localField: "assignedTo",
              foreignField: "_id",
              as: "assignedTo"
            }
          },

          {
            $lookup: {
              from: "users",
              localField: "assigner",
              foreignField: "_id",
              as: "assigner"
            }
          }
          
        ],
        as: "pendingTasks"
      }
    },
  
    {
      $project: {
        projects: 1,
        pendingTasks: 1
      }
    }
  ]);

  if (!userDetails) {
    throw new ApiError("something went wrong", 500);
  }
  
  return res
  .status(200)
  .json(
    new ApiResponse("details fetched successfully", 200, userDetails)
  );
})

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select([
    "-password", "-refreshToken"
  ])

  if (!users) {
    throw new ApiError("something went wrong", 500)
  }

  return res
  .status(200)
  .json(
    new ApiResponse("All users fetched", 200, users)
  )
})

const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $set: {
      refreshToken: undefined
    }
  })

  return res
  .status(200)
  .clearCookie("accessToken", cookieOptions)
  .clearCookie("refreshToken", cookieOptions)
  .json(
    new ApiResponse("user logged out", 200, {})
  )
})

export { registerUser, loginUser, getCurrentUser, refreshAccessToken, getDetails, getAllUsers, logout };
