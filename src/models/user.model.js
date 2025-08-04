import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true, // use 'index' for optimal serching
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String, // using cloud service to upload image and then get url from there and store in it.
    },
    coverImage: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
        // watch history is an array of video id's
      },
    ],
    refreshTokens: {
      type: String,
    },
  },
  { timestamps: true }
);

// saving hashed password to db
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
  // this function only run when pass, modified.
});

//checking hashed password from db,
userSchema.methods.isPasswordCorrect = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error("Password comparison failed");
  }
};

//Generating Access Token
userSchema.methods.generateAccessToken = async function () {
  jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.SECRET_ACCESS_TOKEN,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};



export const User = mongoose.model("User", userSchema);
