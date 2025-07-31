import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// OpenAI Whisper file size limit: 25MB
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB in bytes
const DOWNLOAD_TIMEOUT = 30000; // 30 seconds timeout
const MAX_RETRIES = 3;

// Configuration for debugging
const DEBUG_MODE =
  process.env.NODE_ENV === "development" ||
  process.env.NEXT_PUBLIC_DEBUG_AI_ANALYSIS === "true";

// Helper function to download video with timeout and retry logic
async function downloadVideoWithRetry(
  videoUrl: string,
  retries = MAX_RETRIES,
): Promise<Buffer> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      if (DEBUG_MODE) {
        console.log(
          `Download attempt ${attempt}/${retries} for video:`,
          videoUrl,
        );
      }

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        if (DEBUG_MODE) {
          console.log(`Download timeout after ${DOWNLOAD_TIMEOUT}ms`);
        }
        controller.abort();
      }, DOWNLOAD_TIMEOUT);

      const response = await fetch(videoUrl, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; AttensysBot/1.0)",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Check content length if available
      const contentLength = response.headers.get("content-length");
      if (contentLength) {
        const size = parseInt(contentLength, 10);
        if (DEBUG_MODE) {
          console.log(
            `Content-Length header: ${(size / 1024 / 1024).toFixed(2)}MB`,
          );
        }
        if (size > MAX_FILE_SIZE) {
          throw new Error(
            `Video file too large: ${(size / 1024 / 1024).toFixed(2)}MB (max: 25MB)`,
          );
        }
      }

      // Download with progress tracking
      const chunks: Uint8Array[] = [];
      let totalSize = 0;

      if (!response.body) {
        throw new Error("No response body available");
      }

      const reader = response.body.getReader();

      let reading = true;
      while (reading) {
        const { done, value } = await reader.read();

        if (done) {
          reading = false;
          break;
        }

        chunks.push(value);
        totalSize += value.length;

        if (DEBUG_MODE && totalSize % (1024 * 1024) === 0) {
          console.log(`Downloaded: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);
        }

        // Check size during download to avoid memory issues
        if (totalSize > MAX_FILE_SIZE) {
          reader.cancel();
          throw new Error(
            `Video file too large: ${(totalSize / 1024 / 1024).toFixed(2)}MB (max: 25MB)`,
          );
        }
      }

      // Combine chunks into buffer
      const videoBuffer = Buffer.concat(chunks);
      if (DEBUG_MODE) {
        console.log(
          `Successfully downloaded video: ${(videoBuffer.length / 1024 / 1024).toFixed(2)}MB`,
        );
      }

      return videoBuffer;
    } catch (error) {
      if (DEBUG_MODE) {
        console.error(`Download attempt ${attempt} failed:`, error);
      }

      if (attempt === retries) {
        throw error;
      }

      // Wait before retry (exponential backoff)
      const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
      if (DEBUG_MODE) {
        console.log(`Waiting ${waitTime}ms before retry...`);
      }
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  throw new Error("All download attempts failed");
}

export async function POST(request: NextRequest) {
  try {
    const { videoUrl } = await request.json();

    if (!videoUrl) {
      return NextResponse.json(
        { error: "Video URL is required" },
        { status: 400 },
      );
    }

    console.log("Transcribing video:", videoUrl);

    // Download video from IPFS URL with improved error handling
    let videoBuffer: Buffer;
    try {
      videoBuffer = await downloadVideoWithRetry(videoUrl);
    } catch (error) {
      console.error("Error downloading video:", error);

      // Provide specific error messages based on the error type
      let errorMessage = "Failed to download video from URL";
      let statusCode = 400;

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          errorMessage =
            "Video download timed out. The video may be too large or the server is slow.";
          statusCode = 408;
        } else if (error.message.includes("too large")) {
          errorMessage = error.message;
          statusCode = 413;
        } else if (
          error.message.includes("ENOTFOUND") ||
          error.message.includes("ECONNREFUSED")
        ) {
          errorMessage =
            "Unable to connect to video server. Please check the video URL.";
          statusCode = 503;
        } else if (
          error.message.includes("other side closed") ||
          error.message.includes("terminated")
        ) {
          errorMessage =
            "Video download was interrupted. The video may be too large or the connection was lost.";
          statusCode = 500;
        }
      }

      return NextResponse.json(
        {
          error: errorMessage,
          details: error instanceof Error ? error.message : "Unknown error",
          suggestions: [
            "Try again in a few moments",
            "Check if the video URL is accessible",
            "Upload a shorter video (under 25MB)",
            "Compress the video before uploading",
          ],
        },
        { status: statusCode },
      );
    }

    // Check file size (redundant but safe)
    if (videoBuffer.length > MAX_FILE_SIZE) {
      console.log(
        `Video file too large: ${(videoBuffer.length / 1024 / 1024).toFixed(2)}MB`,
      );

      return NextResponse.json(
        {
          error: "Video file too large for transcription",
          details: `File size: ${(videoBuffer.length / 1024 / 1024).toFixed(2)}MB (max: 25MB)`,
          suggestions: [
            "Upload a shorter video (under 25MB)",
            "Compress the video before uploading",
            "Split long videos into shorter segments",
          ],
        },
        { status: 413 },
      );
    }

    // Create a file-like object for OpenAI
    const file = new File([videoBuffer], "video.mp4", { type: "video/mp4" });

    // Transcribe using OpenAI Whisper with timeout
    console.log("Starting transcription with OpenAI Whisper...");
    const transcription = await openai.audio.transcriptions.create({
      file: file as any,
      model: "whisper-1",
      response_format: "verbose_json",
    });

    console.log("Transcription completed successfully");
    return NextResponse.json({
      text: transcription.text,
      segments: transcription.segments || [],
    });
  } catch (error) {
    console.error("Transcription error:", error);

    // Handle specific OpenAI errors
    if (
      error &&
      typeof error === "object" &&
      "status" in error &&
      error.status === 413
    ) {
      return NextResponse.json(
        {
          error: "Video file too large for transcription",
          details: "Please upload a shorter video (under 25MB)",
        },
        { status: 413 },
      );
    }

    // Handle OpenAI API errors
    if (error && typeof error === "object" && "message" in error) {
      const message = String(error.message);
      if (message.includes("rate_limit") || message.includes("quota")) {
        return NextResponse.json(
          {
            error: "OpenAI API rate limit exceeded",
            details: "Please try again later or contact support",
          },
          { status: 429 },
        );
      }
    }

    return NextResponse.json(
      {
        error: "Failed to transcribe video",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
