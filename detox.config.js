module.exports = {
    testRunner: 'jest',
    runnerConfig: 'e2e/config.json',
    apps: {
      android: {
        type: 'android.apk',
        binaryPath: './android/app/build/outputs/apk/release/app-release.apk',
        build: 'cd android && ./gradlew assembleRelease',
      },
      ios: {
        type: 'ios.app',
        binaryPath: './ios/build/Build/Products/Release-iphonesimulator/MyApp.app',
        build: 'xcodebuild -workspace ios/MyApp.xcworkspace -scheme MyApp -configuration Release -sdk iphonesimulator',
      },
    },
    devices: {
      android: {
        type: 'emulator',
        device: {
          avdName: 'Pixel_3a_API_30',
        },
      },
      ios: {
        type: 'ios.simulator',
        device: {
          type: 'iPhone 12',
        },
      },
    },
    configurations: {
      android: {
        device: 'android',
        app: 'android',
      },
      ios: {
        device: 'ios',
        app: 'ios',
      },
    },
  };
  