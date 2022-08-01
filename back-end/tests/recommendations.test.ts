import supertest from "supertest"

import { prisma } from "../src/database.js"
import app from "../src/app.js"
import { recommendationsFactory } from "./factories/recommendationsFactory.js"

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations`
})

describe("POST /recommendations", () => {
    it("should answer with 201 when recommendation is created", async () => {
        const body = recommendationsFactory.songTemplate();

        const response = await supertest(app)
            .post("/recommendations")
            .send(body);

        expect(response.status).toBe(201);
    })

    it("should answer with 422 when information is missing", async () => {
        const response = await supertest(app).post("/recommendations").send();

        expect(response.status).toBe(422);
    })

    it("should answer with 409 when sending already existing information", async () => {
        await recommendationsFactory.createRecommendation();

        const response = await supertest(app)
            .post("/recommendations")
            .send(recommendationsFactory.songTemplate());

        expect(response.status).toBe(409);
    })
})

describe("POST /recommendations/:id/upvote", () => {
    it("should answer with 200 when id exists", async () => {
        const id = await recommendationsFactory.createRecommendation();

        const response = await supertest(app)
            .post(`/recommendations/${id}/upvote`)
            .send();

        expect(response.status).toBe(200);
    })

    it("should answer with 404 when id doesn't exist", async () => {
        const response = await supertest(app)
            .post(`/recommendations/9999/upvote`)
            .send();

        expect(response.status).toBe(404);
    })
})

describe("POST /recommendations/:id/downvote", () => {
    it("should answer with 200 when id exists", async () => {
        const id = await recommendationsFactory.createRecommendation();

        const response = await supertest(app)
            .post(`/recommendations/${id}/downvote`)
            .send();

        expect(response.status).toBe(200);
    })

    it("should answer with 404 when id doesn't exist", async () => {
        const response = await supertest(app)
            .post(`/recommendations/9999/downvote`)
            .send();

        expect(response.status).toBe(404);
    })

    it("should delete recomendation when score is under -5", async () => {
        const id = await recommendationsFactory.createRecommendation();

        await recommendationsFactory.updateScore(id, -5);
        await supertest(app).post(`/recommendations/${id}/downvote`).send();
        const exists = await recommendationsFactory.checkRecommendation(
            id
        );

        expect(exists).toBe(null);
    })
})

describe("GET /recommendations", () => {
    it("should answer with last 10 recommendations", async () => {
        const recommendations = [];

        for (let i = 0; i <= 10; i++) {
            recommendations.push(
                await recommendationsFactory.createRandomRecommendation()
            );
        };
        const response = await supertest(app).get(`/recommendations`).send();

        expect(response.body).toStrictEqual([
            recommendations[10],
            recommendations[9],
            recommendations[8],
            recommendations[7],
            recommendations[6],
            recommendations[5],
            recommendations[4],
            recommendations[3],
            recommendations[2],
            recommendations[1],
        ]);
    });
})

describe("GET /recommendations/:id", () => {
    it("should answer with recommendation info when existing id", async () => {
        const recommendation = await recommendationsFactory.createRandomRecommendation();

        const response = await supertest(app)
            .get(`/recommendations/${recommendation.id}`)
            .send();

        expect(response.body).toStrictEqual(recommendation);
    })

    it("should answer with 404 if id doesn't exist", async () => {
        const response = await supertest(app).get(`/recommendations/9999`).send();
        
        expect(response.status).toBe(404);
    })
})

describe("GET /recommendations/random", () => {
    it("should answer with random recommendation", async () => {
        for (let i = 0; i <= 4; i++) {
            await recommendationsFactory.createRandomRecommendation();
        }

        const recommendationTemplate = recommendationsFactory.recommendationTemplate();

        const response = await supertest(app)
            .get(`/recommendations/random`)
            .send();

        expect(response.body).toStrictEqual(recommendationTemplate);
    })

    it("should answer with 404 when there is no recommendations", async () => {
        const response = await supertest(app)
            .get(`/recommendations/random`)
            .send();

        expect(response.status).toBe(404);
    })
})

describe("GET /recommendations/top/:amount", () => {
    it("should answer with the top 5 recommendations in order of score", async () => {
        let number = 10;
        const recommendations = [];

        for (let i = 0; i <= 7; i++) {
            recommendations.push(
                await recommendationsFactory.createRandomRecommendation()
            )
            await recommendationsFactory.updateScore(recommendations[i].id,number);
            recommendations[i].score = number;
            number--;
        }

        const response = await supertest(app)
            .get(`/recommendations/top/5`)
            .send();

        expect(response.body).toStrictEqual([
            recommendations[0],
            recommendations[1],
            recommendations[2],
            recommendations[3],
            recommendations[4],
        ])
    })
})