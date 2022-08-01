import { faker } from "@faker-js/faker"

import { prisma } from "../../src/database.js"

const songTemplate = () => {
    const body = {
        name: "Miley Cyrus - Angels Like You",
        youtubeLink:"https://www.youtube.com/watch?v=Y0ORhLyJWuc",
    }
    return body;
}

const recommendationTemplate = () => {  
    const body = {
        id: expect.any(Number),
        name: expect.any(String),
        youtubeLink: expect.any(String),
        score: expect.any(Number),
    };

    return body;
}

async function createRecommendation() {
    const infos = songTemplate();

    const recommendation = await prisma.recommendation.create({
        data: {
            name: infos.name,
            youtubeLink: infos.youtubeLink,
        },
    });

    return recommendation.id;
}

async function updateScore(id: number, value: number) {
    await prisma.recommendation.update({
        data: {
            score: value,
        },
        where: {
             id 
            },
    });
}

async function checkRecommendation(id: number) {
    const exists = await prisma.recommendation.findUnique({
        where: { id },
    });

    return exists;
}

async function createRandomRecommendation() {
    const infos = {
        name: faker.name.findName(),
        youtubeLink: faker.internet.url(),
    };

    const recommendation = await prisma.recommendation.create({
        data: {
            name: infos.name,
            youtubeLink: infos.youtubeLink,
        },
    });

    return recommendation;
}

export const recommendationsFactory = {
    songTemplate,
    recommendationTemplate,
    createRecommendation,
    checkRecommendation,
    createRandomRecommendation,
    updateScore,
}