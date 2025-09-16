# MappLock Cross-Platform Architecture 🏗️
*Unified Codebase Strategy for Mac, iPad, and iPhone*

## 🎯 Architecture Overview

**Goal**: Maximize code reuse while maintaining platform-specific optimizations and native user experiences.

**Strategy**: Shared business logic core with platform-specific UI layers and system integrations.

**Code Sharing Target**: 70-80% shared code, 20-30% platform-specific

---

## 📦 Package Structure

```
MappLock-Universal/
├── Packages/
│   ├── MappLockCore/              # Shared business logic
│   ├── MappLockNetworking/         # Network layer
│   ├── MappLockSecurity/           # Security & encryption
│   ├── MappLockAnalytics/          # Usage analytics
│   └── MappLockUI/                 # Shared UI components
├── Platforms/
│   ├── MappLock-Mac/               # macOS specific
│   ├── MappLock-iOS/               # iOS universal app
│   └── MappLock-Shared/            # Cross-platform utilities
├── Tests/
│   ├── CoreTests/
│   ├── PlatformTests/
│   └── IntegrationTests/
└── Documentation/
    ├── API/
    ├── Architecture/
    └── Deployment/
```

---

## 🔧 Core Shared Package: MappLockCore

### Package.swift
```swift
// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "MappLockCore",
    platforms: [
        .macOS(.v13),
        .iOS(.v16),
        .iPadOS(.v16)
    ],
    products: [
        .library(name: "MappLockCore", targets: ["MappLockCore"]),
        .library(name: "MappLockSecurity", targets: ["MappLockSecurity"]),
        .library(name: "MappLockNetworking", targets: ["MappLockNetworking"]),
        .library(name: "MappLockAnalytics", targets: ["MappLockAnalytics"])
    ],
    dependencies: [
        .package(url: "https://github.com/apple/swift-crypto.git", from: "3.0.0"),
        .package(url: "https://github.com/apple/swift-log.git", from: "1.5.0"),
        .package(url: "https://github.com/apple/swift-collections.git", from: "1.0.0")
    ],
    targets: [
        .target(
            name: "MappLockCore",
            dependencies: [
                "MappLockSecurity",
                "MappLockNetworking",
                "MappLockAnalytics",
                .product(name: "Collections", package: "swift-collections"),
                .product(name: "Logging", package: "swift-log")
            ]
        ),
        .target(
            name: "MappLockSecurity",
            dependencies: [
                .product(name: "Crypto", package: "swift-crypto")
            ]
        ),
        .target(
            name: "MappLockNetworking",
            dependencies: [
                .product(name: "Logging", package: "swift-log")
            ]
        ),
        .target(
            name: "MappLockAnalytics",
            dependencies: []
        ),
        .testTarget(
            name: "MappLockCoreTests",
            dependencies: ["MappLockCore"]
        )
    ]
)
```

---

## 🏛️ Core Architecture Components

### 1. Session Management (Shared)
```swift
// Sources/MappLockCore/SessionManager.swift
import Foundation
import Combine
import OSLog

@MainActor
public class SessionManager: ObservableObject {
    // MARK: - Published Properties
    @Published public var currentSession: KioskSession?
    @Published public var sessionState: SessionState = .inactive
    @Published public var remainingTime: TimeInterval = 0
    @Published public var blockedApps: Set<AppIdentifier> = []
    @Published public var allowedApps: Set<AppIdentifier> = []

    // MARK: - Private Properties
    private let logger = Logger(subsystem: "com.mapplock.core", category: "SessionManager")
    private let kioskController: any KioskControllerProtocol
    private let analyticsService: AnalyticsService
    private let securityService: SecurityService
    private var sessionTimer: Timer?
    private var cancellables = Set<AnyCancellable>()

    // MARK: - Initialization
    public init(
        kioskController: any KioskControllerProtocol,
        analyticsService: AnalyticsService = .shared,
        securityService: SecurityService = .shared
    ) {
        self.kioskController = kioskController
        self.analyticsService = analyticsService
        self.securityService = securityService
        setupBindings()
    }

    // MARK: - Public Methods
    public func startSession(_ configuration: SessionConfiguration) async throws {
        logger.info("Starting kiosk session with configuration: \\(configuration.id)")

        // Validate configuration
        try await securityService.validateConfiguration(configuration)

        // Create session
        let session = KioskSession(
            id: UUID(),
            configuration: configuration,
            startTime: Date(),
            duration: configuration.duration
        )

        // Start kiosk mode
        try await kioskController.startKioskMode(with: configuration)

        // Update state
        await MainActor.run {
            self.currentSession = session
            self.sessionState = .active
            self.remainingTime = configuration.duration
            self.blockedApps = Set(configuration.blockedApps)
            self.allowedApps = Set(configuration.allowedApps)
        }

        // Start timer
        startSessionTimer()

        // Analytics
        analyticsService.trackSessionStart(session)

        logger.info("Kiosk session started successfully")
    }

    public func pauseSession() async throws {
        guard let session = currentSession else {
            throw SessionError.noActiveSession
        }

        logger.info("Pausing session: \\(session.id)")

        try await kioskController.pauseKioskMode()

        await MainActor.run {
            self.sessionState = .paused
        }

        stopSessionTimer()
        analyticsService.trackSessionPause(session)
    }

    public func resumeSession() async throws {
        guard let session = currentSession else {
            throw SessionError.noActiveSession
        }

        logger.info("Resuming session: \\(session.id)")

        try await kioskController.resumeKioskMode()

        await MainActor.run {
            self.sessionState = .active
        }

        startSessionTimer()
        analyticsService.trackSessionResume(session)
    }

    public func endSession() async throws {
        guard let session = currentSession else {
            throw SessionError.noActiveSession
        }

        logger.info("Ending session: \\(session.id)")

        try await kioskController.endKioskMode()

        await MainActor.run {
            self.currentSession = nil
            self.sessionState = .inactive
            self.remainingTime = 0
            self.blockedApps.removeAll()
            self.allowedApps.removeAll()
        }

        stopSessionTimer()
        analyticsService.trackSessionEnd(session)

        logger.info("Session ended successfully")
    }

    // MARK: - Private Methods
    private func setupBindings() {
        // Bind to kiosk controller state changes
        kioskController.statePublisher
            .receive(on: DispatchQueue.main)
            .sink { [weak self] state in
                self?.handleKioskStateChange(state)
            }
            .store(in: &cancellables)
    }

    private func startSessionTimer() {
        sessionTimer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] _ in
            Task { @MainActor in
                self?.updateRemainingTime()
            }
        }
    }

    private func stopSessionTimer() {
        sessionTimer?.invalidate()
        sessionTimer = nil
    }

    private func updateRemainingTime() {
        guard let session = currentSession else { return }

        let elapsed = Date().timeIntervalSince(session.startTime)
        let remaining = max(0, session.configuration.duration - elapsed)

        remainingTime = remaining

        if remaining <= 0 {
            Task {
                try await endSession()
            }
        }
    }

    private func handleKioskStateChange(_ state: KioskState) {
        // Handle external kiosk state changes
        logger.debug("Kiosk state changed: \\(state)")
    }
}

// MARK: - Supporting Types
public enum SessionState: Equatable {
    case inactive
    case active
    case paused
    case ending
}

public enum SessionError: Error, LocalizedError {
    case noActiveSession
    case invalidConfiguration
    case kioskModeUnavailable
    case permissionDenied

    public var errorDescription: String? {
        switch self {
        case .noActiveSession:
            return "No active session found"
        case .invalidConfiguration:
            return "Invalid session configuration"
        case .kioskModeUnavailable:
            return "Kiosk mode is not available on this device"
        case .permissionDenied:
            return "Permission denied for kiosk mode"
        }
    }
}
```

### 2. Platform Protocol Abstraction
```swift
// Sources/MappLockCore/KioskControllerProtocol.swift
import Foundation
import Combine

public protocol KioskControllerProtocol: AnyObject {
    var statePublisher: AnyPublisher<KioskState, Never> { get }
    var isSupported: Bool { get }
    var currentState: KioskState { get }

    func startKioskMode(with configuration: SessionConfiguration) async throws
    func pauseKioskMode() async throws
    func resumeKioskMode() async throws
    func endKioskMode() async throws

    func blockApp(_ app: AppIdentifier) async throws
    func unblockApp(_ app: AppIdentifier) async throws
    func getRunningApps() async throws -> [AppInfo]
    func requestPermissions() async throws -> Bool
}

public enum KioskState: Equatable {
    case inactive
    case starting
    case active
    case paused
    case ending
    case error(String)
}

public struct AppIdentifier: Hashable, Codable {
    public let bundleId: String
    public let name: String

    public init(bundleId: String, name: String) {
        self.bundleId = bundleId
        self.name = name
    }
}

public struct AppInfo: Identifiable, Hashable {
    public let id: String
    public let name: String
    public let bundleId: String
    public let iconData: Data?
    public let isRunning: Bool

    public init(id: String, name: String, bundleId: String, iconData: Data? = nil, isRunning: Bool = false) {
        self.id = id
        self.name = name
        self.bundleId = bundleId
        self.iconData = iconData
        self.isRunning = isRunning
    }
}
```

### 3. Configuration System
```swift
// Sources/MappLockCore/SessionConfiguration.swift
import Foundation

public struct SessionConfiguration: Codable, Identifiable {
    public let id: UUID
    public let name: String
    public let duration: TimeInterval
    public let kioskMode: KioskModeType
    public let blockedApps: [AppIdentifier]
    public let allowedApps: [AppIdentifier]
    public let blockedWebsites: [String]
    public let allowedWebsites: [String]
    public let restrictions: SystemRestrictions
    public let notifications: NotificationSettings
    public let createdAt: Date
    public let modifiedAt: Date

    public init(
        id: UUID = UUID(),
        name: String,
        duration: TimeInterval,
        kioskMode: KioskModeType = .guidedAccess,
        blockedApps: [AppIdentifier] = [],
        allowedApps: [AppIdentifier] = [],
        blockedWebsites: [String] = [],
        allowedWebsites: [String] = [],
        restrictions: SystemRestrictions = .default,
        notifications: NotificationSettings = .default
    ) {
        self.id = id
        self.name = name
        self.duration = duration
        self.kioskMode = kioskMode
        self.blockedApps = blockedApps
        self.allowedApps = allowedApps
        self.blockedWebsites = blockedWebsites
        self.allowedWebsites = allowedWebsites
        self.restrictions = restrictions
        self.notifications = notifications
        self.createdAt = Date()
        self.modifiedAt = Date()
    }
}

public enum KioskModeType: String, Codable, CaseIterable {
    case guidedAccess = "guided_access"
    case singleApp = "single_app"
    case autonomous = "autonomous"
    case custom = "custom"

    public var displayName: String {
        switch self {
        case .guidedAccess:
            return "Guided Access"
        case .singleApp:
            return "Single App Mode"
        case .autonomous:
            return "Autonomous Mode"
        case .custom:
            return "Custom Mode"
        }
    }

    public var description: String {
        switch self {
        case .guidedAccess:
            return "Built-in iOS accessibility feature for basic app locking"
        case .singleApp:
            return "Enterprise-grade permanent lock requiring MDM"
        case .autonomous:
            return "App-controlled kiosk mode with flexible restrictions"
        case .custom:
            return "Custom configuration with advanced restrictions"
        }
    }
}

public struct SystemRestrictions: Codable {
    public let disableScreenshots: Bool
    public let disableControlCenter: Bool
    public let disableNotificationCenter: Bool
    public let disableHomeIndicator: Bool
    public let disableKeyboardShortcuts: Bool
    public let disableVolumeButtons: Bool
    public let disableAutoLock: Bool

    public static let `default` = SystemRestrictions(
        disableScreenshots: true,
        disableControlCenter: true,
        disableNotificationCenter: true,
        disableHomeIndicator: false,
        disableKeyboardShortcuts: true,
        disableVolumeButtons: false,
        disableAutoLock: true
    )

    public init(
        disableScreenshots: Bool = true,
        disableControlCenter: Bool = true,
        disableNotificationCenter: Bool = true,
        disableHomeIndicator: Bool = false,
        disableKeyboardShortcuts: Bool = true,
        disableVolumeButtons: Bool = false,
        disableAutoLock: Bool = true
    ) {
        self.disableScreenshots = disableScreenshots
        self.disableControlCenter = disableControlCenter
        self.disableNotificationCenter = disableNotificationCenter
        self.disableHomeIndicator = disableHomeIndicator
        self.disableKeyboardShortcuts = disableKeyboardShortcuts
        self.disableVolumeButtons = disableVolumeButtons
        self.disableAutoLock = disableAutoLock
    }
}

public struct NotificationSettings: Codable {
    public let enableSessionAlerts: Bool
    public let enableBreakReminders: Bool
    public let reminderInterval: TimeInterval
    public let alertSounds: Bool
    public let vibrationPatterns: Bool

    public static let `default` = NotificationSettings(
        enableSessionAlerts: true,
        enableBreakReminders: true,
        reminderInterval: 900, // 15 minutes
        alertSounds: true,
        vibrationPatterns: true
    )

    public init(
        enableSessionAlerts: Bool = true,
        enableBreakReminders: Bool = true,
        reminderInterval: TimeInterval = 900,
        alertSounds: Bool = true,
        vibrationPatterns: Bool = true
    ) {
        self.enableSessionAlerts = enableSessionAlerts
        self.enableBreakReminders = enableBreakReminders
        self.reminderInterval = reminderInterval
        self.alertSounds = alertSounds
        self.vibrationPatterns = vibrationPatterns
    }
}
```

---

## 🔌 Platform-Specific Implementations

### macOS Implementation
```swift
// Platforms/MappLock-Mac/Sources/macOSKioskController.swift
import AppKit
import Combine
import MappLockCore

public class macOSKioskController: KioskControllerProtocol {
    @Published public private(set) var currentState: KioskState = .inactive

    public var statePublisher: AnyPublisher<KioskState, Never> {
        $currentState.eraseToAnyPublisher()
    }

    public var isSupported: Bool {
        return true // macOS always supports custom kiosk modes
    }

    private var fullScreenWindow: NSWindow?
    private var originalWindows: [NSWindow] = []

    public init() {}

    public func startKioskMode(with configuration: SessionConfiguration) async throws {
        await MainActor.run {
            currentState = .starting
        }

        // Hide dock and menu bar
        NSApp.presentationOptions = [.hideDock, .hideMenuBar, .fullScreen]

        // Create full-screen overlay window
        createKioskWindow()

        // Block specified applications
        for app in configuration.blockedApps {
            try await blockApp(app)
        }

        await MainActor.run {
            currentState = .active
        }
    }

    public func pauseKioskMode() async throws {
        await MainActor.run {
            currentState = .paused
        }
        // Implementation for pause
    }

    public func resumeKioskMode() async throws {
        await MainActor.run {
            currentState = .active
        }
        // Implementation for resume
    }

    public func endKioskMode() async throws {
        await MainActor.run {
            currentState = .ending
        }

        // Restore normal presentation
        NSApp.presentationOptions = []

        // Remove kiosk window
        fullScreenWindow?.close()
        fullScreenWindow = nil

        await MainActor.run {
            currentState = .inactive
        }
    }

    public func blockApp(_ app: AppIdentifier) async throws {
        // Use NSRunningApplication to terminate/hide apps
        let runningApps = NSWorkspace.shared.runningApplications
        if let targetApp = runningApps.first(where: { $0.bundleIdentifier == app.bundleId }) {
            targetApp.terminate()
        }
    }

    public func unblockApp(_ app: AppIdentifier) async throws {
        // Allow app to launch again
    }

    public func getRunningApps() async throws -> [AppInfo] {
        let runningApps = NSWorkspace.shared.runningApplications
        return runningApps.compactMap { app in
            guard let bundleId = app.bundleIdentifier,
                  let name = app.localizedName else { return nil }

            return AppInfo(
                id: bundleId,
                name: name,
                bundleId: bundleId,
                iconData: app.icon?.tiffRepresentation,
                isRunning: !app.isTerminated
            )
        }
    }

    public func requestPermissions() async throws -> Bool {
        // Request accessibility permissions, screen recording, etc.
        return true
    }

    private func createKioskWindow() {
        let screen = NSScreen.main!
        fullScreenWindow = NSWindow(
            contentRect: screen.frame,
            styleMask: [.borderless],
            backing: .buffered,
            defer: false
        )

        fullScreenWindow?.level = .screenSaver
        fullScreenWindow?.isOpaque = true
        fullScreenWindow?.backgroundColor = .black
        fullScreenWindow?.makeKeyAndOrderFront(nil)
    }
}
```

### iOS Implementation
```swift
// Platforms/MappLock-iOS/Sources/iOSKioskController.swift
import UIKit
import Combine
import MappLockCore

public class iOSKioskController: KioskControllerProtocol {
    @Published public private(set) var currentState: KioskState = .inactive

    public var statePublisher: AnyPublisher<KioskState, Never> {
        $currentState.eraseToAnyPublisher()
    }

    public var isSupported: Bool {
        return UIAccessibilityIsGuidedAccessEnabled() ||
               Bundle.main.object(forInfoDictionaryKey: "UIRequiresFullScreen") != nil
    }

    private var guidedAccessSession: Bool = false

    public init() {}

    public func startKioskMode(with configuration: SessionConfiguration) async throws {
        await MainActor.run {
            currentState = .starting
        }

        switch configuration.kioskMode {
        case .guidedAccess:
            try await startGuidedAccess()
        case .singleApp:
            try await startSingleAppMode()
        case .autonomous:
            try await startAutonomousMode(configuration)
        case .custom:
            try await startCustomMode(configuration)
        }

        await MainActor.run {
            currentState = .active
        }
    }

    public func pauseKioskMode() async throws {
        await MainActor.run {
            currentState = .paused
        }
        // Implementation depends on active mode
    }

    public func resumeKioskMode() async throws {
        await MainActor.run {
            currentState = .active
        }
        // Implementation depends on active mode
    }

    public func endKioskMode() async throws {
        await MainActor.run {
            currentState = .ending
        }

        if guidedAccessSession {
            try await endGuidedAccess()
        }

        await MainActor.run {
            currentState = .inactive
        }
    }

    public func blockApp(_ app: AppIdentifier) async throws {
        // iOS doesn't allow terminating other apps
        // This would be handled through Screen Time restrictions
        throw SessionError.kioskModeUnavailable
    }

    public func unblockApp(_ app: AppIdentifier) async throws {
        // Remove from Screen Time restrictions
    }

    public func getRunningApps() async throws -> [AppInfo] {
        // iOS doesn't provide access to running apps list
        // Return current app only
        guard let bundleId = Bundle.main.bundleIdentifier,
              let name = Bundle.main.object(forInfoDictionaryKey: "CFBundleName") as? String else {
            return []
        }

        return [AppInfo(
            id: bundleId,
            name: name,
            bundleId: bundleId,
            isRunning: true
        )]
    }

    public func requestPermissions() async throws -> Bool {
        // Request guided access, screen time permissions
        return await withCheckedContinuation { continuation in
            UIAccessibilityRequestGuidedAccessSession(enabled: false) { success in
                continuation.resume(returning: success)
            }
        }
    }

    // MARK: - Private Methods
    private func startGuidedAccess() async throws {
        let success = await withCheckedContinuation { continuation in
            UIAccessibilityRequestGuidedAccessSession(enabled: true) { success in
                continuation.resume(returning: success)
            }
        }

        guard success else {
            throw SessionError.permissionDenied
        }

        guidedAccessSession = true
    }

    private func endGuidedAccess() async throws {
        let success = await withCheckedContinuation { continuation in
            UIAccessibilityRequestGuidedAccessSession(enabled: false) { success in
                continuation.resume(returning: success)
            }
        }

        guidedAccessSession = false

        guard success else {
            throw SessionError.kioskModeUnavailable
        }
    }

    private func startSingleAppMode() async throws {
        // Requires supervised device + MDM configuration
        // This would be handled by MDM policy
        guard isDeviceSupervised() else {
            throw SessionError.kioskModeUnavailable
        }

        // Apply single app mode restrictions
        applySingleAppRestrictions()
    }

    private func startAutonomousMode(_ configuration: SessionConfiguration) async throws {
        // Custom implementation using app-specific restrictions
        applyAutonomousRestrictions(configuration)
    }

    private func startCustomMode(_ configuration: SessionConfiguration) async throws {
        // Apply custom restrictions based on configuration
        applyCustomRestrictions(configuration)
    }

    private func isDeviceSupervised() -> Bool {
        // Check if device is supervised via MDM
        return UserDefaults.standard.object(forKey: "com.apple.configuration.managed") != nil
    }

    private func applySingleAppRestrictions() {
        // Apply single app mode restrictions
    }

    private func applyAutonomousRestrictions(_ configuration: SessionConfiguration) {
        // Apply autonomous mode restrictions
    }

    private func applyCustomRestrictions(_ configuration: SessionConfiguration) {
        // Apply custom restrictions
    }
}
```

---

## 🌉 Cross-Platform UI Components

### Shared UI Framework
```swift
// Sources/MappLockUI/CrossPlatformComponents.swift
import SwiftUI
import MappLockCore

#if os(macOS)
import AppKit
public typealias PlatformColor = NSColor
public typealias PlatformFont = NSFont
#else
import UIKit
public typealias PlatformColor = UIColor
public typealias PlatformFont = UIFont
#endif

// MARK: - Shared Components
public struct SessionStatusCard: View {
    @ObservedObject var sessionManager: SessionManager

    public init(sessionManager: SessionManager) {
        self.sessionManager = sessionManager
    }

    public var body: some View {
        VStack(spacing: 12) {
            HStack {
                statusIndicator
                Spacer()
                timeRemaining
            }

            if sessionManager.sessionState == .active {
                progressBar
            }

            activeAppDisplay
        }
        .padding()
        .background(cardBackground)
        .cornerRadius(12)
        .shadow(radius: shadowRadius, y: shadowOffset)
    }

    private var statusIndicator: some View {
        HStack {
            Image(systemName: statusIcon)
                .foregroundColor(statusColor)
                .font(.title2)

            Text(statusText)
                .font(.headline)
                .fontWeight(.semibold)
        }
    }

    private var timeRemaining: some View {
        VStack(alignment: .trailing) {
            Text("Time Remaining")
                .font(.caption)
                .foregroundColor(.secondary)

            Text(formattedTime)
                .font(.title2)
                .fontWeight(.medium)
                .monospacedDigit()
        }
    }

    private var progressBar: some View {
        ProgressView(value: sessionProgress)
            .progressViewStyle(LinearProgressViewStyle(tint: .blue))
            .scaleEffect(y: platformProgressScale)
    }

    private var activeAppDisplay: some View {
        HStack {
            // Platform-specific app icon loading
            AsyncImage(url: currentAppIconURL) { image in
                image
                    .resizable()
                    .aspectRatio(contentMode: .fit)
            } placeholder: {
                RoundedRectangle(cornerRadius: 6)
                    .fill(Color.gray.opacity(0.3))
            }
            .frame(width: iconSize, height: iconSize)
            .cornerRadius(iconCornerRadius)

            VStack(alignment: .leading) {
                Text("Current App")
                    .font(.caption)
                    .foregroundColor(.secondary)

                Text(currentAppName)
                    .font(.subheadline)
                    .fontWeight(.medium)
            }

            Spacer()
        }
    }

    // MARK: - Computed Properties
    private var statusIcon: String {
        switch sessionManager.sessionState {
        case .active:
            return "lock.fill"
        case .paused:
            return "pause.circle.fill"
        case .inactive:
            return "lock.open.fill"
        case .ending:
            return "stop.circle.fill"
        }
    }

    private var statusColor: Color {
        switch sessionManager.sessionState {
        case .active:
            return .red
        case .paused:
            return .orange
        case .inactive:
            return .green
        case .ending:
            return .gray
        }
    }

    private var statusText: String {
        switch sessionManager.sessionState {
        case .active:
            return "Active"
        case .paused:
            return "Paused"
        case .inactive:
            return "Inactive"
        case .ending:
            return "Ending"
        }
    }

    private var formattedTime: String {
        let hours = Int(sessionManager.remainingTime) / 3600
        let minutes = Int(sessionManager.remainingTime) % 3600 / 60
        let seconds = Int(sessionManager.remainingTime) % 60

        if hours > 0 {
            return String(format: "%d:%02d:%02d", hours, minutes, seconds)
        } else {
            return String(format: "%02d:%02d", minutes, seconds)
        }
    }

    private var sessionProgress: Double {
        guard let session = sessionManager.currentSession else { return 0 }
        let elapsed = Date().timeIntervalSince(session.startTime)
        return min(1.0, elapsed / session.configuration.duration)
    }

    private var currentAppName: String {
        // Platform-specific current app detection
        #if os(macOS)
        return NSWorkspace.shared.frontmostApplication?.localizedName ?? "Unknown"
        #else
        return Bundle.main.object(forInfoDictionaryKey: "CFBundleName") as? String ?? "MappLock"
        #endif
    }

    private var currentAppIconURL: URL? {
        // Platform-specific app icon URL
        return nil
    }

    // MARK: - Platform-Specific Values
    #if os(macOS)
    private let iconSize: CGFloat = 32
    private let iconCornerRadius: CGFloat = 8
    private let shadowRadius: CGFloat = 4
    private let shadowOffset: CGFloat = 2
    private let platformProgressScale: CGFloat = 1.0
    private let cardBackground = Color(NSColor.controlBackgroundColor)
    #else
    private let iconSize: CGFloat = 28
    private let iconCornerRadius: CGFloat = 6
    private let shadowRadius: CGFloat = 2
    private let shadowOffset: CGFloat = 1
    private let platformProgressScale: CGFloat = 2.0
    private let cardBackground = Color(UIColor.secondarySystemBackground)
    #endif
}
```

---

## 🔄 Data Synchronization

### CloudKit Integration
```swift
// Sources/MappLockCore/CloudSyncService.swift
import CloudKit
import Foundation
import Combine

public class CloudSyncService: ObservableObject {
    public static let shared = CloudSyncService()

    @Published public var syncStatus: SyncStatus = .idle
    @Published public var lastSyncDate: Date?

    private let container: CKContainer
    private let database: CKDatabase
    private var cancellables = Set<AnyCancellable>()

    private init() {
        container = CKContainer(identifier: "iCloud.com.mapplock.universal")
        database = container.privateCloudDatabase
        setupSubscriptions()
    }

    public func syncConfigurations() async throws {
        await MainActor.run {
            syncStatus = .syncing
        }

        do {
            // Fetch remote configurations
            let remoteConfigs = try await fetchRemoteConfigurations()

            // Merge with local configurations
            let mergedConfigs = try await mergeConfigurations(remoteConfigs)

            // Upload local changes
            try await uploadLocalChanges()

            await MainActor.run {
                syncStatus = .completed
                lastSyncDate = Date()
            }
        } catch {
            await MainActor.run {
                syncStatus = .failed(error)
            }
            throw error
        }
    }

    private func fetchRemoteConfigurations() async throws -> [SessionConfiguration] {
        let query = CKQuery(recordType: "SessionConfiguration", predicate: NSPredicate(value: true))
        let (records, _) = try await database.records(matching: query)

        return records.compactMapValues { record in
            try? SessionConfiguration.from(record: record)
        }.map { $0.value }
    }

    private func mergeConfigurations(_ remoteConfigs: [SessionConfiguration]) async throws -> [SessionConfiguration] {
        // Implement conflict resolution logic
        return remoteConfigs
    }

    private func uploadLocalChanges() async throws {
        // Upload pending local changes to CloudKit
    }

    private func setupSubscriptions() {
        // Setup CloudKit subscriptions for real-time sync
    }
}

public enum SyncStatus: Equatable {
    case idle
    case syncing
    case completed
    case failed(Error)

    public static func == (lhs: SyncStatus, rhs: SyncStatus) -> Bool {
        switch (lhs, rhs) {
        case (.idle, .idle), (.syncing, .syncing), (.completed, .completed):
            return true
        case (.failed, .failed):
            return true
        default:
            return false
        }
    }
}
```

---

## 🏁 Implementation Summary

This cross-platform architecture provides:

1. **70-80% Code Sharing**: Core business logic, data models, and shared UI components
2. **Platform-Specific Optimizations**: Native kiosk implementations for Mac and iOS
3. **Unified Data Layer**: CloudKit sync across all platforms
4. **Scalable Design**: Easy to add new platforms or extend functionality
5. **Type Safety**: Shared protocols ensure consistent behavior
6. **Performance**: Platform-specific optimizations where needed

**Next Steps**: Implement core kiosk functionality for each platform using this architecture foundation.