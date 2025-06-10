import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../firebase/client";
import { Review, AverageRating } from "@/types/review";
import { signInUser } from "./authService";

const reviewsCollection = collection(db, "reviews");

export const submitReview = async (
  review: Omit<Review, "id" | "createdAt">,
): Promise<string> => {
  try {
    // Get current user
    const user = auth.currentUser;

    if (!user) {
      throw new Error("User must be authenticated to submit a review");
    }

    // Defensive: Validate rating and videoId
    if (
      typeof review.rating !== "number" ||
      review.rating < 1 ||
      review.rating > 5
    ) {
      throw new Error("Rating must be a number between 1 and 5");
    }
    if (typeof review.videoId !== "string" || !review.videoId.trim()) {
      throw new Error("videoId must be a non-empty string");
    }

    // Defensive: Remove any userId from input
    const { userId, ...reviewData } = review;

    const docRef = await addDoc(reviewsCollection, {
      ...reviewData,
      videoId: review.videoId,
      userId: user.uid, // Ensure the userId matches the authenticated user
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error submitting review:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to submit review",
    );
  }
};

export const getReviewsForVideo = async (
  videoId: string,
): Promise<Review[]> => {
  console.log("Querying reviews for videoId:", videoId);
  // await signInUser();
  console.log("Current auth state:", auth.currentUser?.uid);
  try {
    const q = query(reviewsCollection, where("videoId", "==", videoId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Review[];
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw new Error("Failed to fetch reviews");
  }
};

export const getAverageRatingForVideo = async (
  videoId: string,
): Promise<AverageRating> => {
  try {
    // await signInUser();
    const reviews = await getReviewsForVideo(videoId);
    if (reviews.length === 0) {
      return { average: 0, count: 0 };
    }

    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    const average = total / reviews.length;

    return {
      average: parseFloat(average.toFixed(1)),
      count: reviews.length,
    };
  } catch (error) {
    console.error("Error calculating average rating:", error);
    return { average: 0, count: 0 };
  }
};

export const hasUserReviewed = async (
  videoId: string,
  userId: string,
): Promise<boolean> => {
  try {
    const q = query(
      reviewsCollection,
      where("videoId", "==", videoId),
      where("userId", "==", userId),
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking existing review:", error);
    return false;
  }
};
