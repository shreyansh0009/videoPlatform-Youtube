import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";

// asyncHandler is higher order function, that accepts fun as argument, that's why a callback fun.
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

  //2nd approach, best approach
  if (
    [userName, email, fullName, password].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "All fields are required and cannot be empty!");
  }

  //ii. checking user exists or not?
  //   User.findOne({email}) //only accept one field, what if we want to send many field?
  const isExists = await User.findOne({ $or: [{ userName }, { email }] });
  if (isExists) {
    throw new apiError(409, "User already exists!");
  }

  //iii. Creating user...
  const user = await User.create({
    fullName,
    email,
    password,
    username: userName,
  });

  //iv. validating user created or not?
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new apiError(500, "Something went wrong while registering the user");
  }

  // we can also check, email valid or not and password has length: 8 or not and many more... these are optionals.

  res.status(200).json({
    success: true,
    message: "Details fetched successfully",
    data: createdUser,
  });
});

export { registerUser };
