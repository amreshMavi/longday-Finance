import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = async (req, res, next) => {
  console.log("req.body is", req.body);
  const { username, email, password } = req.body;

  // try {

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });

  if ([username, email, password].some((field) => field.trim() === "")) {
    throw new ApiError(400, "All fields are required!");
  }

  if (existingUser) {
    return res
      .status(409)
      .json({ message: "Username or email already in use" });
  }

  const coverImageLocalPath = req.files?.coverImage[0]?.path

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image is required")
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if (!coverImage) {
    throw new ApiError(400, "Cover image is required") 
  }  
  const newUser = new User({
    username,
    email,
    password,
    coverImage: coverImage?.url
  });

  const saveUser = await newUser.save();
  
  const createdUser = await User.findById(newUser._id).select(
    "-password -refreshToken"
  )

  if (!createdUser) {
    throw new ApiError(500, "User registration failed")
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully")
  )
  
};

const loginUser = async (req, res, next) => {
  console.log("req.body is", req.body);
  const { email, password, username } = req.body;

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  try {
    if (!existingUser) {
      res.status(401).json({ message: "User does not exist" });
    }

    const isMatch = await existingUser.isPasswordCorrect(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const accessToken =  existingUser.generateAccessToken();
    const refreshToken =  existingUser.generateRefreshToken();

    existingUser.refreshToken = refreshToken;
    await existingUser.save();

    const loggedInUser = await User.findById(existingUser._id).select(
      "-password -refreshToken"
    )
    // console.log("loggedInUser is", loggedInUser);

    // access and refresh tokens cant be updated when both are true
    const options = { 
      httpOnly: true,
      secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          existingUser: loggedInUser, accessToken, refreshToken
        },
        "User Logged in successfully"
      )
    )

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const logoutUser = async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined
      }
    },
    {
      new: true // return the updated document
    }
  )

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200, {}, "User logged out successfully"))
}

export { registerUser, loginUser, logoutUser };
