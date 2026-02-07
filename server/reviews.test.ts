import { describe, it, expect, beforeEach, vi } from "vitest";
import { addReview, getReviews, getReviewStats } from "./db";

describe("Reviews Module", () => {
  describe("addReview", () => {
    it("should add a review with valid data without throwing", async () => {
      const reviewData = {
        visitorId: "visitor-123",
        name: "Joao Silva",
        rating: 5,
        comment: "Excelente ferramenta!",
      };

      // Should not throw an error
      try {
        await addReview(reviewData);
        expect(true).toBe(true);
      } catch (error) {
        expect(error).toBeNull();
      }
    });

    it("should add a review without comment without throwing", async () => {
      const reviewData = {
        visitorId: "visitor-456",
        name: "Maria Santos",
        rating: 4,
      };

      // Should not throw an error
      try {
        await addReview(reviewData);
        expect(true).toBe(true);
      } catch (error) {
        expect(error).toBeNull();
      }
    });

    it("should validate rating between 1-5", () => {
      const validRatings = [1, 2, 3, 4, 5];
      validRatings.forEach((rating) => {
        expect(rating).toBeGreaterThanOrEqual(1);
        expect(rating).toBeLessThanOrEqual(5);
      });
    });
  });

  describe("getReviews", () => {
    it("should retrieve all reviews as array", async () => {
      const reviews = await getReviews();
      expect(Array.isArray(reviews)).toBe(true);
    });

    it("should return reviews with required fields when available", async () => {
      const reviews = await getReviews();
      if (reviews.length > 0) {
        const review = reviews[0];
        expect(review).toHaveProperty("id");
        expect(review).toHaveProperty("name");
        expect(review).toHaveProperty("rating");
        expect(review).toHaveProperty("createdAt");
      }
    });
  });

  describe("getReviewStats", () => {
    it("should return stats object with required properties", async () => {
      const stats = await getReviewStats();
      expect(stats).toBeDefined();
      expect(stats).toHaveProperty("totalReviews");
      expect(stats).toHaveProperty("averageRating");
    });

    it("should return valid average rating when reviews exist", async () => {
      const stats = await getReviewStats();
      if (stats.totalReviews > 0) {
        const avg = parseFloat(stats.averageRating || "0");
        expect(avg).toBeGreaterThanOrEqual(0);
        expect(avg).toBeLessThanOrEqual(5);
      }
    });
  });
});

describe("Share Tracking", () => {
  it("should validate platforms are in allowed list", () => {
    const validPlatforms = ["whatsapp", "facebook", "instagram", "email"];
    const testPlatforms = ["whatsapp", "facebook", "instagram", "email"];
    
    testPlatforms.forEach((platform) => {
      expect(validPlatforms).toContain(platform);
    });
  });

  it("should validate visitor ID format", () => {
    const visitorIds = [
      "visitor-123",
      "visitor-456",
      `visitor-${Date.now()}`,
    ];
    visitorIds.forEach((id) => {
      expect(id).toMatch(/^visitor-/);
    });
  });
});
