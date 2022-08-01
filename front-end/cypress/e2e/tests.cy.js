/// <reference types='cypress'/>
beforeEach(() => {
    cy.resetDatabase();
    cy.seedDatabase();
})

describe("Create recommendations", () => {
    it("should create new recommendation", () => {
        cy.visit("/");

        cy.get("#name").type("Miley Cyrus - Angels Like You");
        cy.get("#link").type("https://www.youtube.com/watch?v=Y0ORhLyJWuc");
        cy.get("button").click();
        cy.contains("Miley Cyrus - Angels Like You").should("be.visible");
    })

    it("should throw error when creating aleady existing recommendation", () => {
        cy.visit("/");

        cy.get("#name").type("girl in red - we fell in love in october");
        cy.get("#link").type("https://www.youtube.com/watch?v=iggmiF7DNoM");
        cy.get("button").click();

        cy.on("window:alert", (str) => {
            expect(str).to.equal(`Error creating recommendation!`);
        })
    })

    it("should throw error when creating recommendation with missing information", () => {
        cy.visit("/");

        cy.get("button").click();
        cy.on("window:alert", (str) => {
            expect(str).to.equal(`Error creating recommendation!`);
        })
    })
})

describe("Show recommendations", () => {
    it("should show recommendations at the top of the page", () => {
        cy.visit("/");

        cy.get("#name").type("Miley Cyrus - Angels Like You");
        cy.get("#link").type("https://www.youtube.com/watch?v=Y0ORhLyJWuc");
        cy.get("button").click();

        cy.visit("/top");

        cy.contains("Miley Cyrus - Angels Like You").should("be.visible");
        cy.contains("girl in red - we fell in love in october").should("be.visible");
    })

    it("should show a random recommendation in random page", () => {
        cy.visit("/");

        cy.get("#name").type("Miley Cyrus - Angels Like You");
        cy.get("#link").type("https://www.youtube.com/watch?v=Y0ORhLyJWuc");

        cy.get("button").click();

        cy.visit("/random");
        cy.contains(/(Miley|girl)/g).should("be.visible");
    })
})

describe("score", () => {
    it("should increase score count", () => {
        cy.visit("/");

        cy.get("#upvote").click();
        cy.contains("-2").should("be.visible");
    })

    it("should decrease score count", () => {
        cy.visit("/");

        cy.get("#downvote").click();
        cy.contains("-4").should("be.visible");
    })

    it("should delete recommendation when score is above -5", () => {
        cy.visit("/");

        cy.get("#downvote").click();
        cy.get("#downvote").click();
        cy.get("#downvote").click();
        cy.contains("No recommendations yet! Create your own :)").should("be.visible");
    })
})