import { Router } from "express";
import { getCountries } from "../controllers/countries.controller";

const countryRouter = Router();

countryRouter.get("/", getCountries);

export default countryRouter;