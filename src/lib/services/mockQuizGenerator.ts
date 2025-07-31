import { Question } from "./aiVideoAnalysis";

/**
 * Generate mock questions when AI analysis fails
 * This provides a fallback experience for users
 */
export const generateMockQuestions = (
  courseName: string,
  lectureName: string,
): Question[] => {
  const mockQuestions: Question[] = [
    {
      id: "mock_1",
      question: `What is the main topic discussed in "${lectureName}"?`,
      correctAnswer:
        "The lecture covers fundamental concepts and practical applications",
      options: [
        "The lecture covers fundamental concepts and practical applications",
        "Only theoretical concepts without examples",
        "Advanced topics for experts only",
        "Basic overview without details",
      ],
      explanation:
        "This lecture provides a comprehensive overview including both fundamental concepts and their practical applications.",
      difficulty: "easy",
      category: "Course Overview",
    },
    {
      id: "mock_2",
      question:
        "Which of the following best describes the learning approach in this course?",
      correctAnswer: "Hands-on learning with real-world examples",
      options: [
        "Hands-on learning with real-world examples",
        "Pure theoretical study",
        "Memorization-based learning",
        "Passive listening only",
      ],
      explanation:
        "The course emphasizes practical, hands-on learning with real-world examples to ensure understanding.",
      difficulty: "medium",
      category: "Learning Methodology",
    },
    {
      id: "mock_3",
      question:
        "What should students focus on to get the most from this lecture?",
      correctAnswer: "Active participation and note-taking",
      options: [
        "Active participation and note-taking",
        "Just listening without engagement",
        "Skipping difficult sections",
        "Only watching the video once",
      ],
      explanation:
        "Active participation and taking notes helps reinforce learning and retention of key concepts.",
      difficulty: "easy",
      category: "Study Skills",
    },
    {
      id: "mock_4",
      question: "How does this course structure help with learning?",
      correctAnswer: "Progressive difficulty with building blocks",
      options: [
        "Progressive difficulty with building blocks",
        "Random topic selection",
        "All advanced topics first",
        "No structured approach",
      ],
      explanation:
        "The course uses a progressive approach where each concept builds upon previous knowledge.",
      difficulty: "medium",
      category: "Course Structure",
    },
    {
      id: "mock_5",
      question: "What is the primary goal of this educational content?",
      correctAnswer: "To provide practical skills and knowledge",
      options: [
        "To provide practical skills and knowledge",
        "To entertain viewers",
        "To fill time requirements",
        "To test memorization",
      ],
      explanation:
        "The primary goal is to equip students with practical skills and knowledge they can apply.",
      difficulty: "easy",
      category: "Learning Objectives",
    },
  ];

  return mockQuestions;
};
