import { Router } from "express";
import { Role } from "@prisma/client";
import { permit, protect } from "../middleware/auth.middleware.ts";
import { createStudentProfileController, getAllStudentProfilesController, getStudentProfileByIdController, updateStudentProfileController, deleteStudentProfileController } from "../controllers/student.controller.ts";

const studentRouter = Router();

// Admin route to create a new student profile for a user account.
studentRouter.post("/", protect, permit(Role.ADMIN), createStudentProfileController);

// Admin route to fetch all student profiles.
studentRouter.get("/", protect, permit(Role.ADMIN), getAllStudentProfilesController);

// Admin route to fetch a single student profile by ID.
studentRouter.get("/:id", protect, permit(Role.ADMIN), getStudentProfileByIdController);

// Admin route to update an existing student profile by ID.
studentRouter.put("/:id", protect, permit(Role.ADMIN), updateStudentProfileController);

// Admin route to delete a student profile record by ID.
studentRouter.delete("/:id", protect, permit(Role.ADMIN), deleteStudentProfileController);

export default studentRouter;