# AI Agent Ali — Voice-First Executive AI Workforce

> Autonomous Multi-Agent AI System with Universal Knowledge, 28+ Specialist Agents, Multilingual Voice Engine (Urdu, Hindi, English, Arabic), and Android Native Support.

---

## 🤖 GitHub Actions Automated Android APK Build

This repository includes a production-ready GitHub Actions workflow configured in [`.github/workflows/build-android-apk.yml`](.github/workflows/build-android-apk.yml) that automatically compiles and packages this application into an installable Android APK.

### 🚀 Triggers
The workflow triggers automatically on:
1. **Push & Pull Requests**: Any push or pull request to the `main` or `master` branches.
2. **Git Tags**: Pushing release tags (e.g., `git tag v1.0.0 && git push origin v1.0.0`) automatically compiles the APK and publishes it to **GitHub Releases**.
3. **Manual Dispatch**: Go to the **Actions** tab in your GitHub repository, select **"Build Android APK"**, choose `debug` or `release`, and click **"Run workflow"**.

### 📦 Download the Built APK
Once the workflow finishes running:
1. Go to the **Actions** tab on GitHub.
2. Click on the completed workflow run.
3. Scroll down to the **Artifacts** section at the bottom.
4. Download **`AI-Agent-Ali-Android-APK`** (contains `AI-Agent-Ali-debug.apk`) directly to your computer or Android phone.

---

## 🛠 Local Android Build Instructions

If you have Android Studio or the Android SDK installed locally:

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Build web bundle & sync Capacitor Android project
npm run build:android

# 3. Build APK with Gradle
cd android
./gradlew assembleDebug

# Output APK path:
# android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📱 Android Permissions & Features
The Android native package is configured with:
- `android.permission.INTERNET` — API communication and Universal Knowledge Engine.
- `android.permission.RECORD_AUDIO` — Voice input and speech-to-text recording.
- `android.permission.MODIFY_AUDIO_SETTINGS` — Continuous audio playback and speaker output.
- `android.permission.ACCESS_NETWORK_STATE` — Online/offline connectivity detection.
