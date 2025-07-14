#!/usr/bin/env node

/**
 * Script to check OAuth configuration and help debug authentication issues
 * Run this script to verify your Google OAuth setup
 */

const https = require("https");

console.log("🔍 Checking OAuth Configuration...\n");

// Check environment variables
console.log("📋 Environment Variables:");
console.log(
  "NEXT_PUBLIC_APP_URL:",
  process.env.NEXT_PUBLIC_APP_URL || "NOT_SET",
);
console.log(
  "GOOGLE_CLIENT_ID:",
  process.env.GOOGLE_CLIENT_ID ? "SET" : "NOT_SET",
);
console.log(
  "GOOGLE_CLIENT_SECRET:",
  process.env.GOOGLE_CLIENT_SECRET ? "SET" : "NOT_SET",
);
console.log(
  "FIREBASE_PROJECT_ID:",
  process.env.FIREBASE_PROJECT_ID || "NOT_SET",
);
console.log(
  "FIREBASE_CLIENT_EMAIL:",
  process.env.FIREBASE_CLIENT_EMAIL ? "SET" : "NOT_SET",
);
console.log(
  "FIREBASE_PRIVATE_KEY:",
  process.env.FIREBASE_PRIVATE_KEY ? "SET" : "NOT_SET",
);

console.log("\n🔗 Expected Redirect URIs:");
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.attensys.xyz";
console.log("Production:", `${baseUrl}/api/auth/google/callback`);
console.log("Localhost:", "http://localhost:3000/api/auth/google/callback");

console.log(
  "\n⚠️  IMPORTANT: Make sure these redirect URIs are configured in your Google Cloud Console!",
);
console.log("1. Go to https://console.cloud.google.com/");
console.log("2. Select your project");
console.log("3. Go to APIs & Services > Credentials");
console.log("4. Edit your OAuth 2.0 Client ID");
console.log(
  '5. Add both redirect URIs to the "Authorized redirect URIs" list:',
);
console.log(`   - ${baseUrl}/api/auth/google/callback`);
console.log("   - http://localhost:3000/api/auth/google/callback");

console.log("\n🧪 Test Endpoints:");
console.log("Test configuration:", `${baseUrl}/api/auth/test`);
console.log("Initiate OAuth:", `${baseUrl}/api/auth/google/initiate`);

console.log("\n📝 Common Issues:");
console.log(
  "1. Redirect URI mismatch - Make sure the URIs in Google Cloud Console match exactly",
);
console.log(
  "2. Missing environment variables - Check that all required env vars are set",
);
console.log(
  "3. Firebase Admin SDK not configured - Verify Firebase service account credentials",
);
console.log(
  "4. Domain not authorized - Ensure your domain is added to authorized domains",
);

console.log("\n🔧 Next Steps:");
console.log("1. Deploy the updated code with improved error handling");
console.log("2. Check the server logs for detailed error messages");
console.log("3. Test the authentication flow in production");
console.log(
  "4. If issues persist, check the /api/auth/test endpoint for configuration details",
);
