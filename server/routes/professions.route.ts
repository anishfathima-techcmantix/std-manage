import { Router } from "express";
import { getProfessions } from "../controllers/professions.controller";

const professionsRouter = Router();

professionsRouter.get("/", getProfessions);

export default professionsRouter;