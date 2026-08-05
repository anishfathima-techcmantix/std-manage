import { Router } from "express";
import { authenticateUser } from "../middleware/auth.middleware.ts";
import { registerController, loginController, getMeController } from "../controllers/auth.controller.ts";

const authRouter = Router();

// Public route for registering a new user account.
authRouter.post("/register", registerController);

// Public route for authenticating user credentials and issuing a JWT token.
authRouter.post("/login", loginController);

// Protected route to get current logged-in user profile using valid JWT token.
authRouter.get("/me", authenticateUser, getMeController);

export default authRouter;