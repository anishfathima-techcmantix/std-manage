import { Router } from "express";
import { Role } from "@prisma/client";
import { permit, protect } from "../middleware/auth.middleware.ts";
import { getCurrentUser, userLogin, userRegister } from "../controllers/auth.controller.ts";

const authRouter = Router();

// Public route for registering a new user account.
authRouter.post("/register", userRegister);

// Public route for authenticating user credentials and issuing a JWT token.
authRouter.post("/login", userLogin);

// Protected route to get current logged-in user profile using valid JWT token.
authRouter.get("/me", protect, permit(Role.ADMIN), getCurrentUser);

export default authRouter;