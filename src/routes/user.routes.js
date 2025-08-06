import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

// now here defining routes, and this one file will decide all router comes after /api/v1/user
//register user
router.route("/register").post(upload.fields([
    {
        name: "avatar",
        maxCount: 1
    },
    {
        name: "cover image",
        maxCount: 1
    }  // now we can upload files.
]),registerUser)

//login user
//router.route("/login").post(login)
// define all the routes, and import controller here.
export default router