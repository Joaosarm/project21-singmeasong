import { prisma } from "../database.js"

export async function resetDatabase() {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations`
}

export async function seedRecommendations() {
    await prisma.recommendation.create({
        data: {
            name: "girl in red - we fell in love in october",
            youtubeLink: "https://www.youtube.com/watch?v=iggmiF7DNoM",
            score: -3,
        },
    })
}
