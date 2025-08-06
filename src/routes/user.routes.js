import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = Router()

// now here defining routes, and this one file will decide all router comes after /api/v1/user
//register user
router.route("/register").post(registerUser)

//login user
//router.route("/login").post(login)
// define all the routes, and import controller here.
export default router