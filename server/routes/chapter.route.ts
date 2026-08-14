import { Router } from "express";
import { protect, permit } from "../middleware/auth.middleware";
import { createChapter, getAllChapters, getChapterById, updateChapter, deleteChapter } from "../controllers/chapter.controller";

const chapterRouter = Router();

chapterRouter.get("/", protect, getAllChapters);
chapterRouter.get("/:id", protect, getChapterById);
chapterRouter.post("/", protect, permit("ADMIN"), createChapter);
chapterRouter.put("/:id", protect, permit("ADMIN"), updateChapter);
chapterRouter.delete("/:id", protect, permit("ADMIN"), deleteChapter);

export default chapterRouter;