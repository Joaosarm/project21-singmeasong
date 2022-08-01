import { Router } from "express";

import * as  testsController from "../controllers/testsController.js";

const testsRouter = Router();

testsRouter.post("/resetDatabase", testsController.resetDatabase);
testsRouter.post("/seed/recommendation", testsController.seedRecomendations);

export default testsRouter;