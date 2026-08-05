import { Router } from "express";
import { authenticateUser, requireAdmin } from "../middleware/auth.middleware.ts";
import { createStudentProfileController, getAllStudentProfilesController, getStudentProfileByIdController, updateStudentProfileController, deleteStudentProfileController } from "../controllers/student.controller.ts";

const studentRouter = Router();

// Admin route to create a new student profile for a user account.
studentRouter.post("/", authenticateUser, requireAdmin, createStudentProfileController);

// Admin route to fetch all student profiles.
studentRouter.get("/", authenticateUser, requireAdmin, getAllStudentProfilesController);

// Admin route to fetch a single student profile by ID.
studentRouter.get("/:id", authenticateUser, requireAdmin, getStudentProfileByIdController);

// Admin route to update an existing student profile by ID.
studentRouter.put("/:id", authenticateUser, requireAdmin, updateStudentProfileController);

// Admin route to delete a student profile record by ID.
studentRouter.delete("/:id", authenticateUser, requireAdmin, deleteStudentProfileController);

export default studentRouter;