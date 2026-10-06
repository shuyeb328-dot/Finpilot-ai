# FinPilot AI Android APK

This is the Android shell for FinPilot AI v1100. It builds with GitHub Actions and keeps provider/LLM secrets off-device.

## Build on GitHub
1. Push the repository to GitHub.
2. Open **Actions → Build FinPilot AI APK**.
3. Run workflow.
4. Download `finpilot-ai-debug-apk` from the completed run.

For production, connect the app to a deployed HTTPS FinPilot API and use a signed release build. Do not place API keys in the APK.
