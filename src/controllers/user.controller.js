import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadFile } from "../utils/fileUpload.js";
import { apiResponse } from "../utils/apiResponse.js";

// asyncHandler is higher order function, that accepts fun as argument, that's why a callback fun.
//User Registeration...
const registerUser = asyncHandler(async (req, res) => {
  //now steps for register user, data will be fetched from postman.
  /*
    i. get user details.
    ii. check for empty fields: validation.
    iii. check if user already exists: use email or username or both
    iv. check for avatar, uploaded or not
    v. check avatar uploaded on cloud or not.
    vi. now create user object in db.(mongo hava obj, (noSql))
    vii. now remove password and refresh token from response
    viii. check for user created or not
    ix. send user details without pass and refresh token.
    x. else sent error message.
    */

  //i. user details fetching.
  const { userName, email, fullName, password } = req.body;

  //now, for file we can't handle file here, we need to go to routes folder and there we can use multer's middleware to handle uploded files.
  // files will be fetched, multer is called as middleware in user.route.js.

  //ii. checking for empty fields: validation

  //1st approach, but not optimal
  // if(!userName || !email || !fullName || !password) {
  //     throw new apiError(400, "All fields are required!")
  // } else {
  //     res.send({message: "Details fetched!"})
  // }

  //2nd approach, best approach, checking for empty fields
  if (
    [userName, email, fullName, password].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "All fields are required and cannot be empty!");
  }

  //iii. checking user exists or not?
  //   User.findOne({email}) //only accept one field, what if we want to send many field?
  const isExists = await User.findOne({ $or: [{ userName }, { email }] });
  if (isExists) {
    throw new apiError(409, "User already exists!");
  }

  // we can also check, email valid or not and password has length: 8 or not and many more... these are optionals.

  //iv. checking for avatar image or cover image, uploaded or not.
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar file is required");
  }

  const avatarUpload = await uploadFile(avatarLocalPath);

  //iv. checking user uploaded avatar or not
  if (!avatarUpload) {
    throw new apiError(400, "Avatar file upload failed!");
  }

  // defining coverImage as null, because it's optional and url as empty string
  let coverImageUpload = null;
  let coverImageUrl = "";
  if (coverImageLocalPath) {
    coverImageUpload = await uploadFile(coverImageLocalPath);
  }
  if (coverImageUpload) {
    coverImageUrl = coverImageUpload.url;
  }

  //v. now creating user in database.
  const user = await User.create({
    fullName,
    email,
    password,
    username: userName,
    avatar: avatarUpload.url,
    coverImage: coverImageUrl,
  });

  //iv. validating user created or not?
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new apiError(500, "Something went wrong while registering the user");
  }

  res.status(201).json({
    success: true,
    message: "User Registered successfully",
    data: createdUser,
  });
});

//User Validation or login...
const loginUser = asyncHandler(async (req, res) => {
  //1. getting data from body
  const { username, password } = req.body;

  //2. checking for empty fields...
  if ([username, password].some((field) => field?.trim() === "")) {
    throw new apiError(400, "Username and password are required!");
  }

  //3. finding user in database..
  const user = await User.findOne({ username }); // checking for both username or password
  if (!user) {
    throw new apiError(404, "User doesn't exists");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new apiError(401, "Invalid user credentials!");
  }

  //4. Generating Access Token
  const generateAccessAndRefreshToken = async (userId) => {
    try {
      const loggedInUser = await User.findById(userId);
      if (!loggedInUser) {
        throw new apiError(404, "User not found");
      }
      const accessToken = await loggedInUser.generateAccessToken();
      const refreshToken = await loggedInUser.generateRefreshToken();

      loggedInUser.refreshToken = refreshToken;
      await loggedInUser.save({ validateBeforeSave: false });
      return { accessToken, refreshToken };
    } catch (error) {
      throw new apiError(
        500,
        "Something went wrong while generating access and refresh token"
      );
    }
  };
  // we gonna use it many times, that why make a function
  //calling function..
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  // updating 'user' object after generating access and refresh token
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //options for cookies
  const options = {
    // httpOnly: used for, client won't able to edit cookies in his browser, cookies can only editable from server
    httpOnly: true,
    secure: true,
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In successfully!"
      )
    );
});

// loging out user using middleware..
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    // httpOnly: used for, client won't able to edit cookies in his browser, cookies can only editable from server
    httpOnly: true,
    secure: true,
  };
  return res
    .status(201)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, "User logged out successfully!"));
});

export { registerUser, loginUser, logoutUser };
