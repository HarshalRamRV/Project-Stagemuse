import express from "express";
import { googleLogin, login, googleSignup } from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/google-login", googleLogin);
router.post("/google-signup", googleSignup);

export default router;
