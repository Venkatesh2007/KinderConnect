# Android Setup & Build Instructions

## Prerequisites
- Node.js & npm
- Android Studio
- Java Development Kit (JDK) 17+

## Initial Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Initialize Capacitor (if not done)**
   ```bash
   npx cap init
   ```

3. **Add Android Platform**
   ```bash
   npm install @capacitor/android
   npx cap add android
   ```

## Permissions
The app requires microphone access for voice notes. This is already configured in `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.INTERNET" />
```

## Building the App

1. **Build the Web App**
   ```bash
   npm run build
   ```

2. **Sync with Capacitor**
   ```bash
   npx cap sync
   ```

3. **Open in Android Studio**
   ```bash
   npx cap open android
   ```

4. **Run on Device/Emulator**
   - Connect your Android device or start an emulator.
   - Click the "Run" button (green play icon) in Android Studio.

## Troubleshooting
- **Microphone not working**: Ensure you have granted permission on the device when prompted.
- **Build errors**: Try `Build > Clean Project` and `Build > Rebuild Project` in Android Studio.
