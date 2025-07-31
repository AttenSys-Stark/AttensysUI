import React, { useState, useEffect } from "react";
import { Question, VideoAnalysisResult } from "@/lib/services/aiVideoAnalysis";
import { generateMockQuestions } from "@/lib/services/mockQuizGenerator";
import LoadingSpinner from "../ui/LoadingSpinner";
import { HiBadgeCheck, HiX } from "react-icons/hi";
import { IoIosStar } from "@react-icons/all-files/io/IoIosStar";

interface VideoQuizProps {
  courseId: string;
  lectureName: string;
  courseName: string;
  videoUrl: string;
  onAnalysisComplete?: (result: VideoAnalysisResult) => void;
}

interface QuizState {
  currentQuestionIndex: number;
  selectedAnswers: { [questionId: string]: string };
  showResults: boolean;
  score: number;
  totalQuestions: number;
}

const VideoQuiz: React.FC<VideoQuizProps> = ({
  courseId,
  lectureName,
  courseName,
  videoUrl,
  onAnalysisComplete,
}) => {
  const [analysisResult, setAnalysisResult] =
    useState<VideoAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    selectedAnswers: {},
    showResults: false,
    score: 0,
    totalQuestions: 0,
  });

  // Import the AI analysis functions
  const {
    analyzeVideoContent,
    getVideoAnalysis,
    storeVideoAnalysis,
    checkAnalysisExists,
  } = React.useMemo(() => require("@/lib/services/aiVideoAnalysis"), []);

  useEffect(() => {
    loadOrGenerateAnalysis();
  }, [courseId, lectureName]);

  const loadOrGenerateAnalysis = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // First, check if analysis already exists
      const existingAnalysis = await getVideoAnalysis(courseId, lectureName);

      if (existingAnalysis) {
        console.log("Using existing analysis for:", lectureName);
        setAnalysisResult(existingAnalysis);
        setQuizState((prev) => ({
          ...prev,
          totalQuestions: existingAnalysis.questions.length,
        }));
        onAnalysisComplete?.(existingAnalysis);
        return;
      }

      // Generate new analysis
      console.log("Generating new analysis for:", lectureName);
      const newAnalysis = await analyzeVideoContent(
        videoUrl,
        courseId,
        courseName,
        lectureName,
      );

      // Store the analysis (don't fail if this doesn't work)
      try {
        const { auth } = await import("@/lib/firebase/client");
        if (auth.currentUser) {
          await storeVideoAnalysis(newAnalysis, auth.currentUser.uid);
        }
      } catch (storageError) {
        console.warn("Failed to store analysis in Firebase:", storageError);
        // Continue anyway - the analysis is still available in memory
      }

      setAnalysisResult(newAnalysis);
      setQuizState((prev) => ({
        ...prev,
        totalQuestions: newAnalysis.questions.length,
      }));
      onAnalysisComplete?.(newAnalysis);
    } catch (err) {
      console.error("Error in analysis:", err);

      // Provide more specific error messages
      let errorMessage = "Failed to analyze video content. Please try again.";
      let useMockQuestions = false;

      if (err && typeof err === "object" && "message" in err) {
        const message = String(err.message);
        if (message.includes("413") || message.includes("too large")) {
          errorMessage =
            "This video is too large for AI analysis. Using sample questions instead.";
          useMockQuestions = true;
        } else if (
          message.includes("Failed to download video") ||
          message.includes("other side closed") ||
          message.includes("terminated") ||
          message.includes("SocketError") ||
          message.includes("ENOTFOUND") ||
          message.includes("ECONNREFUSED") ||
          message.includes("timeout") ||
          message.includes("AbortError")
        ) {
          errorMessage =
            "Unable to access the video file. Using sample questions instead.";
          useMockQuestions = true;
        } else if (message.includes("Transcription failed")) {
          errorMessage =
            "Unable to transcribe this video. Using sample questions instead.";
          useMockQuestions = true;
        } else if (
          message.includes("rate_limit") ||
          message.includes("quota")
        ) {
          errorMessage =
            "AI service is temporarily unavailable. Using sample questions instead.";
          useMockQuestions = true;
        }
      }

      if (useMockQuestions) {
        // Generate mock questions as fallback
        const mockQuestions = generateMockQuestions(courseName, lectureName);
        const mockAnalysis: VideoAnalysisResult = {
          transcription: "Sample transcription (AI analysis unavailable)",
          questions: mockQuestions,
          analysisId: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          videoUrl,
          courseId,
          lectureName,
          createdAt: new Date(),
        };

        setAnalysisResult(mockAnalysis);
        setQuizState((prev) => ({
          ...prev,
          totalQuestions: mockQuestions.length,
        }));
        onAnalysisComplete?.(mockAnalysis);

        // Show a toast notification about using mock questions
        const { toast } = await import("react-toastify");
        toast.info(
          "Using sample questions due to technical limitations. For AI-generated questions, try with a shorter video (under 25MB) or try again later.",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          },
        );
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setQuizState((prev) => ({
      ...prev,
      selectedAnswers: {
        ...prev.selectedAnswers,
        [questionId]: answer,
      },
    }));
  };

  const handleNextQuestion = () => {
    if (
      quizState.currentQuestionIndex <
      (analysisResult?.questions.length || 0) - 1
    ) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }));
    }
  };

  const handlePreviousQuestion = () => {
    if (quizState.currentQuestionIndex > 0) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
      }));
    }
  };

  const handleSubmitQuiz = () => {
    if (!analysisResult) return;

    let score = 0;
    analysisResult.questions.forEach((question) => {
      const selectedAnswer = quizState.selectedAnswers[question.id];
      if (selectedAnswer === question.correctAnswer) {
        score++;
      }
    });

    setQuizState((prev) => ({
      ...prev,
      score,
      showResults: true,
    }));
  };

  const handleRetakeQuiz = () => {
    setQuizState({
      currentQuestionIndex: 0,
      selectedAnswers: {},
      showResults: false,
      score: 0,
      totalQuestions: analysisResult?.questions.length || 0,
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-600 bg-green-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "hard":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl border border-gray-200">
        <LoadingSpinner size="lg" colorVariant="primary" />
        <p className="mt-4 text-gray-600">Analyzing video content...</p>
        <p className="text-sm text-gray-500">This may take a few minutes</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl border border-red-200">
        <HiX className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-red-600 font-medium">{error}</p>
        <button
          onClick={loadOrGenerateAnalysis}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!analysisResult) {
    return null;
  }

  const currentQuestion =
    analysisResult.questions[quizState.currentQuestionIndex];
  const selectedAnswer = quizState.selectedAnswers[currentQuestion.id];

  if (quizState.showResults) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Quiz Results
          </h3>
          <div
            className={`text-4xl font-bold ${getScoreColor(quizState.score, quizState.totalQuestions)}`}
          >
            {quizState.score}/{quizState.totalQuestions}
          </div>
          <p className="text-gray-600 mt-2">
            {((quizState.score / quizState.totalQuestions) * 100).toFixed(1)}%
            Score
          </p>
        </div>

        <div className="space-y-4">
          {analysisResult.questions.map((question, index) => {
            const userAnswer = quizState.selectedAnswers[question.id];
            const isCorrect = userAnswer === question.correctAnswer;

            return (
              <div
                key={question.id}
                className={`p-4 rounded-lg border ${
                  isCorrect
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">Question {index + 1}:</span>
                  {isCorrect ? (
                    <HiBadgeCheck className="h-5 w-5 text-green-600" />
                  ) : (
                    <HiX className="h-5 w-5 text-red-600" />
                  )}
                </div>
                <p className="font-medium mb-2">{question.question}</p>
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">Your answer:</span>{" "}
                    <span
                      className={isCorrect ? "text-green-700" : "text-red-700"}
                    >
                      {userAnswer || "Not answered"}
                    </span>
                  </p>
                  {!isCorrect && (
                    <p className="text-sm">
                      <span className="font-medium">Correct answer:</span>{" "}
                      <span className="text-green-700">
                        {question.correctAnswer}
                      </span>
                    </p>
                  )}
                  <p className="text-sm text-gray-600 mt-2">
                    {question.explanation}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleRetakeQuiz}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Video Quiz</h3>
          <p className="text-gray-600">
            Test your understanding of this lecture
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">
            Question {quizState.currentQuestionIndex + 1} of{" "}
            {analysisResult.questions.length}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <IoIosStar className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium">
              {currentQuestion.difficulty}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(currentQuestion.difficulty)}`}
          >
            {currentQuestion.difficulty}
          </span>
          <span className="text-xs text-gray-500">
            {currentQuestion.category}
          </span>
        </div>
        <p className="text-lg font-medium text-gray-900 mb-4">
          {currentQuestion.question}
        </p>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <label
              key={index}
              className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedAnswer === option
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name={`question-${currentQuestion.id}`}
                value={option}
                checked={selectedAnswer === option}
                onChange={(e) =>
                  handleAnswerSelect(currentQuestion.id, e.target.value)
                }
                className="sr-only"
              />
              <div
                className={`w-4 h-4 rounded-full border-2 mr-3 ${
                  selectedAnswer === option
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-300"
                }`}
              >
                {selectedAnswer === option && (
                  <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                )}
              </div>
              <span className="text-gray-900">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={handlePreviousQuestion}
          disabled={quizState.currentQuestionIndex === 0}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>

        <div className="flex gap-2">
          {quizState.currentQuestionIndex ===
          analysisResult.questions.length - 1 ? (
            <button
              onClick={handleSubmitQuiz}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Progress</span>
          <span>
            {Object.keys(quizState.selectedAnswers).length}/
            {analysisResult.questions.length} answered
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${(Object.keys(quizState.selectedAnswers).length / analysisResult.questions.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default VideoQuiz;
