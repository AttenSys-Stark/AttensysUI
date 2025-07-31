// Note: OpenAI client will be used server-side via API routes
// This prevents exposing API keys in the browser

export interface VideoAnalysisResult {
  transcription: string;
  questions: Question[];
  analysisId: string;
  videoUrl: string;
  courseId: string;
  lectureName: string;
  createdAt: Date;
}

export interface Question {
  id: string;
  question: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
}

export interface TranscriptionResult {
  text: string;
  segments: Array<{
    start: number;
    end: number;
    text: string;
  }>;
}

/**
 * Transcribes video audio using OpenAI Whisper via server API
 */
export const transcribeVideo = async (
  videoUrl: string,
): Promise<TranscriptionResult> => {
  try {
    console.log("Starting video transcription for:", videoUrl);

    const response = await fetch("/api/transcribe-video", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ videoUrl }),
    });

    if (!response.ok) {
      throw new Error(`Transcription failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error transcribing video:", error);
    throw error;
  }
};

/**
 * Generates 10 contextual questions based on transcription using GPT-4 via server API
 */
export const generateQuestions = async (
  transcription: string,
  courseName: string,
  lectureName: string,
): Promise<Question[]> => {
  try {
    console.log("Generating questions for:", lectureName);

    const response = await fetch("/api/generate-questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transcription,
        courseName,
        lectureName,
      }),
    });

    if (!response.ok) {
      throw new Error(`Question generation failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result.questions.map((q: any, index: number) => ({
      id: `q_${Date.now()}_${index}`,
      ...q,
    }));
  } catch (error) {
    console.error("Error generating questions:", error);
    throw error;
  }
};

/**
 * Complete video analysis: transcription + question generation
 */
export const analyzeVideoContent = async (
  videoUrl: string,
  courseId: string,
  courseName: string,
  lectureName: string,
): Promise<VideoAnalysisResult> => {
  try {
    console.log("Starting complete video analysis for:", lectureName);

    // Step 1: Transcribe video
    const transcriptionResult = await transcribeVideo(videoUrl);

    // Step 2: Generate questions
    const questions = await generateQuestions(
      transcriptionResult.text,
      courseName,
      lectureName,
    );

    // Step 3: Create analysis result
    const analysisResult: VideoAnalysisResult = {
      transcription: transcriptionResult.text,
      questions,
      analysisId: `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      videoUrl,
      courseId,
      lectureName,
      createdAt: new Date(),
    };

    return analysisResult;
  } catch (error) {
    console.error("Error in complete video analysis:", error);
    throw error;
  }
};

/**
 * Store analysis results in Firebase
 */
export const storeVideoAnalysis = async (
  analysisResult: VideoAnalysisResult,
  userId: string,
): Promise<void> => {
  try {
    // Import Firebase functions here to avoid circular dependencies
    const { doc, setDoc, collection } = await import("firebase/firestore");
    const { db } = await import("@/lib/firebase/client");

    const analysesRef = collection(db, "videoAnalyses");
    const analysisDocRef = doc(analysesRef);
    await setDoc(analysisDocRef, {
      ...analysisResult,
      userId,
      id: analysisDocRef.id,
    });

    console.log("Video analysis stored successfully");
  } catch (error) {
    console.error("Error storing video analysis:", error);
    // Don't throw error - just log it so the quiz can still work
    // The analysis result is still available in memory
  }
};

/**
 * Retrieve stored analysis results
 */
export const getVideoAnalysis = async (
  courseId: string,
  lectureName: string,
): Promise<VideoAnalysisResult | null> => {
  try {
    const { collection, query, where, getDocs } = await import(
      "firebase/firestore"
    );
    const { db } = await import("@/lib/firebase/client");

    const analysesRef = collection(db, "videoAnalyses");
    const q = query(
      analysesRef,
      where("courseId", "==", courseId),
      where("lectureName", "==", lectureName),
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }

    const docSnapshot = querySnapshot.docs[0];
    return docSnapshot.data() as VideoAnalysisResult;
  } catch (error) {
    console.error("Error retrieving video analysis:", error);
    // Return null instead of throwing - this allows the quiz to still work
    // even if Firebase is not accessible
    return null;
  }
};

/**
 * Check if analysis already exists for a video
 */
export const checkAnalysisExists = async (
  courseId: string,
  lectureName: string,
): Promise<boolean> => {
  try {
    const analysis = await getVideoAnalysis(courseId, lectureName);
    return analysis !== null;
  } catch (error) {
    console.error("Error checking analysis existence:", error);
    return false;
  }
};
