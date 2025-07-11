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

    const accessToken = existingUser.generateAccessToken();
    const refreshToken = existingUser.generateRefreshToken();

    existingUser.refreshToken = refreshToken;
    await existingUser.save();

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export { registerUser, loginUser };
