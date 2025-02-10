// routes/Auth.js  (or if your folder is named "rotues", adjust accordingly)
import express from "express";
import { Register, Login, GetUser } from "../controllers/AuthController.js";
import upload from "../middleware/multer.js";

const AuthRoutes = express.Router();

AuthRoutes.post("/register", upload.single("profile"), Register);
AuthRoutes.post("/login", Login);
AuthRoutes.get("/get_user", GetUser); // This endpoint will now work correctly

export default AuthRoutes;
