import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { transcription, courseName, lectureName } = await request.json();

    if (!transcription || !courseName || !lectureName) {
      return NextResponse.json(
        { error: "Transcription, course name, and lecture name are required" },
        { status: 400 },
      );
    }

    console.log("Generating questions for:", lectureName);

    const prompt = `
You are an expert educational content analyzer. Based on the following video transcription from a course called "${courseName}" - Lecture: "${lectureName}", generate exactly 5 multiple-choice questions.

Requirements:
- Questions should test understanding of key concepts from the video
- Each question should have 4 options (A, B, C, D)
- Include one correct answer and three plausible distractors
- Provide a brief explanation for the correct answer
- Categorize difficulty as: easy, medium, or hard
- Questions should cover different aspects of the content
- Make questions engaging and educational

Transcription:
${transcription}

Generate the questions in the following JSON format:
{
  "questions": [
    {
      "question": "Question text here?",
      "correctAnswer": "Correct answer text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "explanation": "Brief explanation of why this is correct",
      "difficulty": "easy|medium|hard",
      "category": "Main topic category"
    }
  ]
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an expert educational content analyzer. Generate high-quality multiple-choice questions based on video transcriptions. Always respond with valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error("No response from GPT-4");
    }

    // Parse the JSON response
    const parsedResponse = JSON.parse(responseText);

    return NextResponse.json({
      questions: parsedResponse.questions || [],
    });
  } catch (error) {
    console.error("Question generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate questions" },
      { status: 500 },
    );
  }
}
