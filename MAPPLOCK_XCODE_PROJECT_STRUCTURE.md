# MappLock iOS Xcode Project Structure 📱
*Complete Universal iOS Project Setup and Organization*

## 🏗️ Project Structure Overview

```
MappLock-Universal/
├── MappLock.xcworkspace           # Main Xcode workspace
├── MappLock-iOS/                  # Universal iOS app target
├── MappLock-Core/                 # Shared Swift Package
├── MappLock-Enterprise/           # Enterprise features package
├── MappLock-UI/                   # Shared UI components package
├── MappLock-Tests/                # Test targets
├── MappLock-Widgets/              # Widget extensions
├── Scripts/                       # Build and deployment scripts
├── Documentation/                 # Technical documentation
└── Assets/                        # Shared assets and resources
```

---

## 📦 Xcode Workspace Configuration

### MappLock.xcworkspace
```ruby
# Contents.xcworkspacedata
<?xml version="1.0" encoding="UTF-8"?>
<Workspace
   version = "1.0">
   <FileRef
      location = "group:MappLock-iOS/MappLock-iOS.xcodeproj">
   </FileRef>
   <FileRef
      location = "group:Packages/MappLock-Core">
   </FileRef>
   <FileRef
      location = "group:Packages/MappLock-Enterprise">
   </FileRef>
   <FileRef
      location = "group:Packages/MappLock-UI">
   </FileRef>
   <FileRef
      location = "group:MappLock-Tests/MappLock-Tests.xcodeproj">
   </FileRef>
</Workspace>
```

---

## 📱 Main iOS App Target Structure

### MappLock-iOS/MappLock-iOS.xcodeproj

#### Project Configuration
```swift
// project.pbxproj key settings
PRODUCT_NAME = "MappLock"
PRODUCT_BUNDLE_IDENTIFIER = "com.mapplock.ios"
MARKETING_VERSION = "1.0.0"
CURRENT_PROJECT_VERSION = "1"

// Deployment
IPHONEOS_DEPLOYMENT_TARGET = "16.1"
SUPPORTED_PLATFORMS = "iphoneos iphonesimulator"
TARGETED_DEVICE_FAMILY = "1,2" // iPhone and iPad

// Swift settings
SWIFT_VERSION = "5.9"
SWIFT_STRICT_CONCURRENCY = "complete"
ENABLE_PREVIEWS = true

// Capabilities
com.apple.security.application-groups
com.apple.developer.associated-domains
com.apple.developer.default-data-protection
com.apple.developer.device-information.user-assigned-device-name
com.apple.developer.family-controls
com.apple.developer.screentime
```

#### App Target File Structure
```
MappLock-iOS/
├── Sources/
│   ├── App/
│   │   ├── MappLockApp.swift           # Main app entry point
│   │   ├── AppDelegate.swift           # App delegate for legacy APIs
│   │   └── SceneDelegate.swift         # Scene delegate for multi-window
│   ├── Views/
│   │   ├── Main/
│   │   │   ├── ContentView.swift       # Root content view
│   │   │   ├── MainTabView.swift       # Main tab navigation
│   │   │   └── SplashView.swift        # Launch screen view
│   │   ├── Session/
│   │   │   ├── SessionView.swift       # Main session interface
│   │   │   ├── QuickActionsView.swift  # Quick action buttons
│   │   │   ├── SessionStatsView.swift  # Session statistics
│   │   │   └── EmergencyExitView.swift # Emergency exit interface
│   │   ├── Configuration/
│   │   │   ├── ConfigurationView.swift # Configuration setup
│   │   │   ├── KioskModeSelector.swift # Kiosk mode selection
│   │   │   ├── AppBlockingView.swift   # App blocking configuration
│   │   │   └── ScheduleView.swift      # Session scheduling
│   │   ├── Settings/
│   │   │   ├── SettingsView.swift      # Main settings
│   │   │   ├── SecurityView.swift      # Security settings
│   │   │   ├── PrivacyView.swift       # Privacy controls
│   │   │   └── AboutView.swift         # About and help
│   │   ├── Enterprise/
│   │   │   ├── EnterpriseView.swift    # Enterprise dashboard
│   │   │   ├── FleetView.swift         # Device fleet management
│   │   │   ├── ComplianceView.swift    # Compliance monitoring
│   │   │   └── ReportsView.swift       # Analytics and reports
│   │   └── Onboarding/
│   │       ├── OnboardingView.swift    # Initial setup flow
│   │       ├── PermissionsView.swift   # Permission requests
│   │       ├── WelcomeView.swift       # Welcome screen
│   │       └── TutorialView.swift      # Feature tutorial
│   ├── ViewModels/
│   │   ├── SessionViewModel.swift      # Session management logic
│   │   ├── ConfigurationViewModel.swift # Configuration logic
│   │   ├── SettingsViewModel.swift     # Settings management
│   │   ├── EnterpriseViewModel.swift   # Enterprise features
│   │   └── OnboardingViewModel.swift   # Onboarding flow
│   ├── Services/
│   │   ├── KioskService.swift          # Main kiosk service
│   │   ├── PermissionService.swift     # Permission management
│   │   ├── NotificationService.swift   # Local notifications
│   │   ├── AnalyticsService.swift      # Usage analytics
│   │   └── CloudSyncService.swift      # iCloud synchronization
│   ├── Extensions/
│   │   ├── View+Extensions.swift       # SwiftUI view extensions
│   │   ├── Color+Extensions.swift      # Color system extensions
│   │   ├── UIDevice+Extensions.swift   # Device capability extensions
│   │   └── Bundle+Extensions.swift     # Bundle information
│   └── Utilities/
│       ├── Constants.swift             # App constants
│       ├── Logger.swift                # Logging utility
│       ├── Keychain.swift              # Keychain wrapper
│       └── UserDefaults+Keys.swift     # UserDefaults keys
├── Resources/
│   ├── Assets.xcassets/
│   │   ├── AppIcon.appiconset/         # App icons
│   │   ├── LaunchImage.imageset/       # Launch images
│   │   ├── Colors/                     # Color assets
│   │   │   ├── PrimaryColor.colorset
│   │   │   ├── SecondaryColor.colorset
│   │   │   └── AccentColor.colorset
│   │   └── Images/                     # App images
│   │       ├── Logo.imageset
│   │       ├── EmptyState.imageset
│   │       └── Tutorial/
│   ├── Localizable.strings             # Localization
│   ├── InfoPlist.strings              # Localized Info.plist
│   └── PrivacyInfo.xcprivacy           # Privacy manifest
├── Configuration/
│   ├── Info.plist                      # App configuration
│   ├── MappLock.entitlements          # App entitlements
│   ├── Config-Debug.xcconfig           # Debug configuration
│   ├── Config-Release.xcconfig         # Release configuration
│   └── Config-Enterprise.xcconfig      # Enterprise configuration
└── Supporting Files/
    ├── LaunchScreen.storyboard         # Launch screen
    ├── GoogleService-Info.plist        # Firebase config (if used)
    └── Credits.rtf                     # Third-party credits
```

---

## 🏢 Enterprise Extension Target

### MappLock-Enterprise-Extension/
```swift
// Enterprise extension for advanced MDM features
import UIKit
import MappLockCore
import MappLockEnterprise

// Sources/
├── EnterpriseExtensionMain.swift       # Extension entry point
├── MDMProcessor.swift                  # MDM command processor
├── ComplianceAgent.swift               # Compliance monitoring agent
├── ConfigurationSync.swift             # Remote configuration sync
└── EnterpriseReporting.swift           # Enterprise analytics

// Resources/
├── Info.plist                         # Extension Info.plist
└── Assets.xcassets/                    # Extension-specific assets
```

---

## 🔔 Widget Extension Target

### MappLock-Widgets/
```swift
// Widget extension for home screen controls
import WidgetKit
import SwiftUI
import MappLockCore

// Sources/
├── MappLockWidgets.swift               # Main widget definitions
├── SessionStatusWidget.swift           # Session status widget
├── QuickActionsWidget.swift            # Quick action widget
├── AnalyticsWidget.swift               # Usage analytics widget
└── WidgetViews/
    ├── SmallWidgetView.swift           # Small widget layout
    ├── MediumWidgetView.swift          # Medium widget layout
    └── LargeWidgetView.swift           # Large widget layout

// Resources/
├── Info.plist                         # Widget Info.plist
└── Assets.xcassets/                    # Widget-specific assets
```

---

## 📦 Shared Swift Packages

### 1. MappLock-Core Package
```swift
// Package.swift
// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "MappLockCore",
    platforms: [
        .iOS(.v16),
        .macOS(.v13)
    ],
    products: [
        .library(name: "MappLockCore", targets: ["MappLockCore"])
    ],
    dependencies: [
        .package(url: "https://github.com/apple/swift-crypto.git", from: "3.0.0"),
        .package(url: "https://github.com/apple/swift-log.git", from: "1.5.0")
    ],
    targets: [
        .target(
            name: "MappLockCore",
            dependencies: [
                .product(name: "Crypto", package: "swift-crypto"),
                .product(name: "Logging", package: "swift-log")
            ],
            path: "Sources"
        ),
        .testTarget(
            name: "MappLockCoreTests",
            dependencies: ["MappLockCore"],
            path: "Tests"
        )
    ]
)
```

#### Package Structure
```
Packages/MappLock-Core/
├── Package.swift
├── Sources/
│   ├── Models/
│   │   ├── SessionConfiguration.swift
│   │   ├── KioskState.swift
│   │   ├── AppInfo.swift
│   │   └── ViolationAttempt.swift
│   ├── Protocols/
│   │   ├── KioskControllerProtocol.swift
│   │   ├── SessionManagerProtocol.swift
│   │   └── AnalyticsProtocol.swift
│   ├── Managers/
│   │   ├── SessionManager.swift
│   │   ├── ConfigurationManager.swift
│   │   └── SecurityManager.swift
│   ├── Services/
│   │   ├── ViolationDetector.swift
│   │   ├── AppMonitor.swift
│   │   └── URLFilter.swift
│   └── Utilities/
│       ├── Logger.swift
│       ├── Crypto.swift
│       └── DeviceInfo.swift
├── Tests/
│   ├── SessionManagerTests.swift
│   ├── ConfigurationTests.swift
│   ├── SecurityTests.swift
│   └── Mocks/
│       ├── MockKioskController.swift
│       └── MockAnalyticsService.swift
└── Resources/
    └── DefaultConfigurations.plist
```

### 2. MappLock-Enterprise Package
```swift
// Package.swift for Enterprise features
let package = Package(
    name: "MappLockEnterprise",
    platforms: [.iOS(.v16)],
    products: [
        .library(name: "MappLockEnterprise", targets: ["MappLockEnterprise"])
    ],
    dependencies: [
        .package(path: "../MappLock-Core")
    ],
    targets: [
        .target(
            name: "MappLockEnterprise",
            dependencies: ["MappLockCore"],
            path: "Sources"
        )
    ]
)
```

#### Enterprise Package Structure
```
Packages/MappLock-Enterprise/
├── Package.swift
├── Sources/
│   ├── MDM/
│   │   ├── AppleBusinessManager.swift
│   │   ├── ProfileManager.swift
│   │   └── DeviceCommandProcessor.swift
│   ├── Compliance/
│   │   ├── ComplianceMonitor.swift
│   │   ├── PolicyEngine.swift
│   │   └── AuditLogger.swift
│   ├── Analytics/
│   │   ├── EnterpriseAnalytics.swift
│   │   ├── ReportGenerator.swift
│   │   └── DataExporter.swift
│   └── Network/
│       ├── EnterpriseAPI.swift
│       ├── ConfigurationSync.swift
│       └── RemoteCommandProcessor.swift
└── Tests/
    ├── MDMTests.swift
    ├── ComplianceTests.swift
    └── AnalyticsTests.swift
```

### 3. MappLock-UI Package
```swift
// Package.swift for shared UI components
let package = Package(
    name: "MappLockUI",
    platforms: [.iOS(.v16)],
    products: [
        .library(name: "MappLockUI", targets: ["MappLockUI"])
    ],
    dependencies: [
        .package(path: "../MappLock-Core")
    ],
    targets: [
        .target(
            name: "MappLockUI",
            dependencies: ["MappLockCore"],
            path: "Sources",
            resources: [.process("Resources")]
        )
    ]
)
```

#### UI Package Structure
```
Packages/MappLock-UI/
├── Package.swift
├── Sources/
│   ├── Components/
│   │   ├── SessionStatusCard.swift
│   │   ├── QuickActionButton.swift
│   │   ├── ConfigurationForm.swift
│   │   └── EmergencyExitButton.swift
│   ├── Modifiers/
│   │   ├── ResponsiveModifier.swift
│   │   ├── AccessibilityModifier.swift
│   │   └── AnalyticsModifier.swift
│   ├── Styles/
│   │   ├── ButtonStyles.swift
│   │   ├── TextStyles.swift
│   │   └── CardStyles.swift
│   ├── Layout/
│   │   ├── AdaptiveStack.swift
│   │   ├── ResponsiveGrid.swift
│   │   └── SafeAreaContainer.swift
│   └── Extensions/
│       ├── View+MappLock.swift
│       ├── Color+MappLock.swift
│       └── Font+MappLock.swift
├── Resources/
│   ├── Colors.xcassets/
│   ├── Fonts/
│   └── Lottie/
└── Tests/
    └── ComponentTests.swift
```

---

## 🧪 Test Targets Structure

### MappLock-Tests/
```
MappLock-Tests.xcodeproj
├── Unit Tests/
│   ├── SessionManagerTests.swift
│   ├── ConfigurationTests.swift
│   ├── KioskControllerTests.swift
│   ├── SecurityTests.swift
│   └── Mocks/
│       ├── MockKioskController.swift
│       ├── MockSessionManager.swift
│       └── MockAnalyticsService.swift
├── Integration Tests/
│   ├── KioskModeIntegrationTests.swift
│   ├── MDMIntegrationTests.swift
│   ├── CloudSyncIntegrationTests.swift
│   └── PermissionIntegrationTests.swift
├── UI Tests/
│   ├── OnboardingUITests.swift
│   ├── SessionUITests.swift
│   ├── ConfigurationUITests.swift
│   └── AccessibilityUITests.swift
└── Performance Tests/
    ├── SessionPerformanceTests.swift
    ├── MemoryLeakTests.swift
    └── BatteryUsageTests.swift
```

---

## ⚙️ Build Configuration

### Scheme Configuration
```xml
<!-- MappLock.xcscheme -->
<Scheme version = "1.3">
   <BuildAction parallelizeBuildables = "YES">
      <BuildActionEntries>
         <BuildActionEntry buildForTesting = "YES"
                          buildForRunning = "YES"
                          buildForProfiling = "YES"
                          buildForArchiving = "YES"
                          buildForAnalyzing = "YES">
            <BuildableReference
               BuildableIdentifier = "primary"
               BlueprintIdentifier = "MappLock-iOS"
               BuildableName = "MappLock.app"
               BlueprintName = "MappLock-iOS"
               ReferencedContainer = "container:MappLock-iOS.xcodeproj">
            </BuildableReference>
         </BuildActionEntry>
      </BuildActionEntries>
   </BuildAction>

   <TestAction testingType = "UnitTesting">
      <Testables>
         <TestableReference skipped = "NO">
            <BuildableReference
               BuildableIdentifier = "primary"
               BlueprintIdentifier = "MappLock-Tests"
               BuildableName = "MappLock-Tests.xctest"
               BlueprintName = "MappLock-Tests"
               ReferencedContainer = "container:MappLock-Tests.xcodeproj">
            </BuildableReference>
         </TestableReference>
      </Testables>
   </TestAction>
</Scheme>
```

### Build Scripts
```bash
#!/bin/bash
# Scripts/build.sh - Main build script

set -e

echo "🏗️ Building MappLock Universal..."

# Clean build directory
rm -rf build/

# Build for iOS device
xcodebuild -workspace MappLock.xcworkspace \
           -scheme MappLock-iOS \
           -configuration Release \
           -destination "generic/platform=iOS" \
           -archivePath build/MappLock-iOS.xcarchive \
           archive

# Build for iOS Simulator
xcodebuild -workspace MappLock.xcworkspace \
           -scheme MappLock-iOS \
           -configuration Release \
           -destination "generic/platform=iOS Simulator" \
           -archivePath build/MappLock-iOS-Simulator.xcarchive \
           archive

# Create XCFramework
xcodebuild -create-xcframework \
           -archive build/MappLock-iOS.xcarchive \
           -framework MappLock.framework \
           -archive build/MappLock-iOS-Simulator.xcarchive \
           -framework MappLock.framework \
           -output build/MappLock.xcframework

echo "✅ Build completed successfully!"
```

---

## 📋 Configuration Files

### Info.plist
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDisplayName</key>
    <string>MappLock</string>
    <key>CFBundleIdentifier</key>
    <string>com.mapplock.ios</string>
    <key>CFBundleVersion</key>
    <string>$(CURRENT_PROJECT_VERSION)</string>
    <key>CFBundleShortVersionString</key>
    <string>$(MARKETING_VERSION)</string>

    <key>LSApplicationCategoryType</key>
    <string>public.app-category.business</string>

    <key>UILaunchStoryboardName</key>
    <string>LaunchScreen</string>

    <key>UISupportedInterfaceOrientations</key>
    <array>
        <string>UIInterfaceOrientationPortrait</string>
        <string>UIInterfaceOrientationPortraitUpsideDown</string>
        <string>UIInterfaceOrientationLandscapeLeft</string>
        <string>UIInterfaceOrientationLandscapeRight</string>
    </array>

    <key>NSGuidedAccessUsageDescription</key>
    <string>MappLock uses Guided Access to provide secure kiosk functionality for educational and business environments.</string>

    <key>NSScreenTimeUsageDescription</key>
    <string>MappLock requires Screen Time access to manage app usage and website restrictions during focus sessions.</string>

    <key>NSLocalNetworkUsageDescription</key>
    <string>MappLock uses local network access for enterprise device management and configuration sync.</string>

    <key>UIRequiredDeviceCapabilities</key>
    <array>
        <string>arm64</string>
    </array>

    <key>ITSAppUsesNonExemptEncryption</key>
    <false/>
</dict>
</plist>
```

### Entitlements
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.security.application-groups</key>
    <array>
        <string>group.com.mapplock.shared</string>
    </array>

    <key>com.apple.developer.associated-domains</key>
    <array>
        <string>applinks:mapplock.com</string>
        <string>applinks:enterprise.mapplock.com</string>
    </array>

    <key>com.apple.developer.default-data-protection</key>
    <string>NSFileProtectionComplete</string>

    <key>com.apple.developer.family-controls</key>
    <true/>

    <key>com.apple.developer.screentime</key>
    <true/>

    <key>aps-environment</key>
    <string>production</string>
</dict>
</plist>
```

### Privacy Manifest
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>NSPrivacyCollectedDataTypes</key>
    <array>
        <dict>
            <key>NSPrivacyCollectedDataType</key>
            <string>NSPrivacyCollectedDataTypeDeviceID</string>
            <key>NSPrivacyCollectedDataTypeLinked</key>
            <false/>
            <key>NSPrivacyCollectedDataTypeTracking</key>
            <false/>
            <key>NSPrivacyCollectedDataTypePurpose</key>
            <string>NSPrivacyCollectedDataTypePurposeAppFunctionality</string>
        </dict>
    </array>

    <key>NSPrivacyAccessedAPITypes</key>
    <array>
        <dict>
            <key>NSPrivacyAccessedAPIType</key>
            <string>NSPrivacyAccessedAPICategorySystemBootTime</string>
            <key>NSPrivacyAccessedAPITypeReasons</key>
            <array>
                <string>35F9.1</string>
            </array>
        </dict>
    </array>
</dict>
</plist>
```

This comprehensive Xcode project structure provides:

1. **Universal iOS Support**: Both iPhone and iPad with adaptive interfaces
2. **Modular Architecture**: Separate packages for core, enterprise, and UI features
3. **Enterprise Extensions**: Advanced MDM and compliance features
4. **Widget Support**: Home screen widgets for quick access
5. **Comprehensive Testing**: Unit, integration, UI, and performance tests
6. **Build Automation**: Scripts for CI/CD and distribution
7. **Privacy Compliance**: Complete privacy manifest and permissions
8. **App Store Ready**: Proper configuration for App Store submission

The structure is designed to scale from individual users to enterprise deployments while maintaining code quality and compliance requirements.