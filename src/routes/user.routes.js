import { Router } from "express";
import { logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { loginUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

// now here defining routes, and this one file will decide all router comes after /api/v1/user
//register user
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    }, // now we can upload files.
  ]),
  registerUser
);

//login user
//router.route("/login").post(login)
// define all the routes, and import controller here.

router.route("/login").post(loginUser);

// secured routes...
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/refresh-accessToken").post(refreshAccessToken)

export default router;
