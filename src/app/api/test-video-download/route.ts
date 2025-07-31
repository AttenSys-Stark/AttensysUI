import { NextRequest, NextResponse } from "next/server";

// OpenAI Whisper file size limit: 25MB
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB in bytes
const DOWNLOAD_TIMEOUT = 30000; // 30 seconds timeout
const MAX_RETRIES = 3;

// Helper function to download video with timeout and retry logic
async function testVideoDownload(
  videoUrl: string,
  retries = MAX_RETRIES,
): Promise<any> {
  const results = {
    attempts: [] as any[],
    finalResult: null as any,
    success: false,
    error: null as string | null,
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    const startTime = Date.now(); // Declare startTime at the beginning of the loop
    const attemptResult = {
      attempt,
      startTime: new Date().toISOString(),
      endTime: null as string | null,
      success: false,
      error: null as string | null,
      contentLength: null as number | null,
      downloadedSize: 0,
      duration: 0,
    };

    try {
      console.log(
        `Test download attempt ${attempt}/${retries} for video:`,
        videoUrl,
      );

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log(`Download timeout after ${DOWNLOAD_TIMEOUT}ms`);
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
        attemptResult.contentLength = size;
        console.log(
          `Content-Length header: ${(size / 1024 / 1024).toFixed(2)}MB`,
        );
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
        attemptResult.downloadedSize = totalSize;

        if (totalSize % (1024 * 1024) === 0) {
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
      console.log(
        `Successfully downloaded video: ${(videoBuffer.length / 1024 / 1024).toFixed(2)}MB`,
      );

      attemptResult.success = true;
      attemptResult.endTime = new Date().toISOString();
      attemptResult.duration = Date.now() - startTime;

      results.success = true;
      results.finalResult = {
        size: videoBuffer.length,
        sizeMB: (videoBuffer.length / 1024 / 1024).toFixed(2),
        duration: attemptResult.duration,
      };
    } catch (error) {
      attemptResult.success = false;
      attemptResult.error =
        error instanceof Error ? error.message : String(error);
      attemptResult.endTime = new Date().toISOString();
      attemptResult.duration = Date.now() - startTime;

      console.error(`Test download attempt ${attempt} failed:`, error);

      if (attempt === retries) {
        results.error = attemptResult.error;
      } else {
        // Wait before retry (exponential backoff)
        const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        console.log(`Waiting ${waitTime}ms before retry...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }

    results.attempts.push(attemptResult);
  }

  return results;
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

    console.log("Testing video download:", videoUrl);

    // Test video download
    const testResults = await testVideoDownload(videoUrl);

    return NextResponse.json({
      success: testResults.success,
      error: testResults.error,
      attempts: testResults.attempts,
      finalResult: testResults.finalResult,
      summary: {
        totalAttempts: testResults.attempts.length,
        successfulAttempts: testResults.attempts.filter((a: any) => a.success)
          .length,
        totalDuration: testResults.attempts.reduce(
          (sum: number, a: any) => sum + a.duration,
          0,
        ),
        averageDuration:
          testResults.attempts.reduce(
            (sum: number, a: any) => sum + a.duration,
            0,
          ) / testResults.attempts.length,
      },
    });
  } catch (error) {
    console.error("Test error:", error);
    return NextResponse.json(
      {
        error: "Test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
