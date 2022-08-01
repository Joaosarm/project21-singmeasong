import { Request, Response } from "express"

import * as testsRepository from "../repositories/testsRepository.js"

export async function resetDatabase(req: Request, res: Response) {
    await testsRepository.resetDatabase();
    res.sendStatus(200);
}

export async function seedRecomendations(req: Request, res: Response) {
    await testsRepository.seedRecommendations();
    res.sendStatus(200);
}