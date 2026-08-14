import { Router } from "express";
import { protect } from "../middleware/auth.middleware.ts";
import { getCurrentUser, userLogin, userRegister } from "../controllers/auth.controller.ts";

const authRouter = Router();

// Public route for registering a new user account.
authRouter.post("/register", userRegister);

// Public route for authenticating user credentials and issuing a JWT token.
authRouter.post("/login", userLogin);

// Protected route to get current logged-in user profile using valid JWT token.
authRouter.get("/me", protect, getCurrentUser);

export default authRouter;