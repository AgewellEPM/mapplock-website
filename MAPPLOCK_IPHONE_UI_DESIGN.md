# MappLock iPhone UI/UX Design 📱
*Powerful Pocket Manager - Complete iPhone Interface Specifications*

## 🎯 Design Philosophy

**"Powerful Pocket Manager"**
- One-handed operation optimized
- Thumb-friendly navigation
- Critical actions within reach
- Minimal cognitive load
- Instant status visibility

## 📐 Screen Size Adaptations

### iPhone Pro Max (6.7") - Premium Experience
- **Resolution**: 428×926 points
- **Safe Area**: 44pt top, 34pt bottom
- **Design Strategy**: Split control panels with rich information density

### iPhone Pro/Plus (6.1") - Balanced Interface
- **Resolution**: 390×844 points
- **Safe Area**: 47pt top, 34pt bottom
- **Design Strategy**: Standard optimized layout

### iPhone Standard (5.4") - Compact Optimized
- **Resolution**: 360×780 points
- **Safe Area**: 44pt top, 34pt bottom
- **Design Strategy**: Condensed controls with slide-out panels

### iPhone SE (4.7") - Legacy Support
- **Resolution**: 375×667 points
- **Safe Area**: 20pt top, 0pt bottom
- **Design Strategy**: Simplified interface with essential features only

---

## 🏗️ Core Interface Architecture

### Primary Navigation Pattern
```
┌─────────────────────────────────────┐
│ ⚡ MappLock     🔒 Active      ☰   │ ← Header (44pt)
├─────────────────────────────────────┤
│                                     │
│    📱 Current App: Safari           │ ← Status Card
│    ⏰ 2h 34m remaining              │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │     🔧 Quick Actions            │ │ ← Primary Controls
│ │                                 │ │
│ │  [🚫 Block]  [⏸️ Pause]         │ │
│ │                                 │ │
│ │  [📱 Switch App] [⚙️ Settings]  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 🎯 Smart Suggestions                │ ← AI Recommendations
│ • Block social apps                 │
│ • Focus on work                     │
│ • Study mode                        │
│                                     │
│ [Start New Session]                 │ ← Main CTA
│                                     │
│ ≡≡≡≡≡ (Home Indicator) ≡≡≡≡≡       │ ← 34pt bottom
└─────────────────────────────────────┘
```

---

## 📱 SwiftUI Implementation

### 1. Root Container Structure
```swift
struct iPhoneMappLockView: View {
    @StateObject private var sessionManager = SessionManager()
    @StateObject private var kioskManager = iOSKioskManager()
    @State private var showingSettings = false
    @State private var showingAppPicker = false

    var body: some View {
        NavigationView {
            ScrollView {
                LazyVStack(spacing: 20) {
                    StatusCardView()
                    QuickActionsView()
                    SmartSuggestionsView()
                    NewSessionButtonView()
                }
                .padding(.horizontal, 16)
                .padding(.top, 8)
            }
            .navigationTitle("MappLock")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Settings") {
                        showingSettings = true
                    }
                }
            }
        }
        .sheet(isPresented: $showingSettings) {
            SettingsView()
        }
        .sheet(isPresented: $showingAppPicker) {
            AppPickerView()
        }
    }
}
```

### 2. Status Card Component
```swift
struct StatusCardView: View {
    @EnvironmentObject var sessionManager: SessionManager

    var body: some View {
        VStack(spacing: 12) {
            // Current App Display
            HStack {
                AsyncImage(url: sessionManager.currentApp.iconURL) { image in
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                } placeholder: {
                    RoundedRectangle(cornerRadius: 8)
                        .fill(Color.gray.opacity(0.3))
                }
                .frame(width: 32, height: 32)
                .cornerRadius(8)

                VStack(alignment: .leading, spacing: 2) {
                    Text("Current App")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    Text(sessionManager.currentApp.name)
                        .font(.headline)
                        .fontWeight(.semibold)
                }

                Spacer()

                // Lock Status Indicator
                Image(systemName: sessionManager.isLocked ? "lock.fill" : "lock.open.fill")
                    .foregroundColor(sessionManager.isLocked ? .red : .green)
                    .font(.title2)
            }

            // Time Remaining
            HStack {
                Image(systemName: "clock.fill")
                    .foregroundColor(.blue)
                Text(sessionManager.formattedTimeRemaining)
                    .font(.title2)
                    .fontWeight(.medium)
                Spacer()
                Text("remaining")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            // Progress Bar
            ProgressView(value: sessionManager.sessionProgress)
                .progressViewStyle(LinearProgressViewStyle(tint: .blue))
                .scaleEffect(y: 2)
        }
        .padding()
        .background(Color(UIColor.secondarySystemBackground))
        .cornerRadius(12)
        .shadow(radius: 2, y: 1)
    }
}
```

### 3. Quick Actions Grid
```swift
struct QuickActionsView: View {
    @EnvironmentObject var sessionManager: SessionManager

    let columns = Array(repeating: GridItem(.flexible(), spacing: 12), count: 2)

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Quick Actions")
                .font(.headline)
                .fontWeight(.semibold)

            LazyVGrid(columns: columns, spacing: 12) {
                ActionButton(
                    icon: "stop.circle.fill",
                    title: "Block App",
                    color: .red,
                    action: { sessionManager.blockCurrentApp() }
                )

                ActionButton(
                    icon: "pause.circle.fill",
                    title: "Pause Session",
                    color: .orange,
                    action: { sessionManager.pauseSession() }
                )

                ActionButton(
                    icon: "arrow.triangle.2.circlepath",
                    title: "Reset Timer",
                    color: .blue,
                    action: { sessionManager.resetTimer() }
                )

                ActionButton(
                    icon: "gearshape.fill",
                    title: "Settings",
                    color: .gray,
                    action: { /* Show settings */ }
                )
            }
        }
    }
}

struct ActionButton: View {
    let icon: String
    let title: String
    let color: Color
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 8) {
                Image(systemName: icon)
                    .font(.title2)
                    .foregroundColor(color)

                Text(title)
                    .font(.caption)
                    .fontWeight(.medium)
                    .multilineTextAlignment(.center)
                    .foregroundColor(.primary)
            }
            .frame(maxWidth: .infinity)
            .frame(height: 80)
            .background(Color(UIColor.secondarySystemBackground))
            .cornerRadius(12)
            .shadow(radius: 1, y: 0.5)
        }
        .buttonStyle(ScaleButtonStyle())
    }
}

struct ScaleButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.95 : 1.0)
            .animation(.easeInOut(duration: 0.1), value: configuration.isPressed)
    }
}
```

### 4. Smart Suggestions Component
```swift
struct SmartSuggestionsView: View {
    @EnvironmentObject var sessionManager: SessionManager

    var suggestions: [SmartSuggestion] {
        sessionManager.generateSmartSuggestions()
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: "lightbulb.fill")
                    .foregroundColor(.yellow)
                Text("Smart Suggestions")
                    .font(.headline)
                    .fontWeight(.semibold)
                Spacer()
            }

            ForEach(suggestions, id: \.id) { suggestion in
                SuggestionRow(suggestion: suggestion)
            }
        }
    }
}

struct SuggestionRow: View {
    let suggestion: SmartSuggestion

    var body: some View {
        Button(action: suggestion.action) {
            HStack(spacing: 12) {
                Text(suggestion.emoji)
                    .font(.title2)

                VStack(alignment: .leading, spacing: 2) {
                    Text(suggestion.title)
                        .font(.subheadline)
                        .fontWeight(.medium)
                        .foregroundColor(.primary)

                    Text(suggestion.description)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }

                Spacer()

                Image(systemName: "chevron.right")
                    .font(.caption)
                    .foregroundColor(.tertiary)
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 10)
            .background(Color(UIColor.tertiarySystemBackground))
            .cornerRadius(8)
        }
        .buttonStyle(PlainButtonStyle())
    }
}
```

### 5. Dynamic Island Integration
```swift
struct DynamicIslandActivity: View {
    @EnvironmentObject var sessionManager: SessionManager

    var body: some View {
        HStack(spacing: 8) {
            // Lock Status
            Image(systemName: sessionManager.isLocked ? "lock.fill" : "lock.open.fill")
                .foregroundColor(sessionManager.isLocked ? .red : .green)
                .font(.caption)

            // Time Remaining
            Text(sessionManager.compactTimeFormat)
                .font(.caption)
                .fontWeight(.medium)
                .monospacedDigit()

            Spacer()

            // Current App Icon
            AsyncImage(url: sessionManager.currentApp.iconURL) { image in
                image
                    .resizable()
                    .aspectRatio(contentMode: .fit)
            } placeholder: {
                Circle()
                    .fill(Color.gray.opacity(0.3))
            }
            .frame(width: 16, height: 16)
            .cornerRadius(4)
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 6)
        .background(Color.black.opacity(0.8))
        .cornerRadius(16)
    }
}
```

---

## 🎨 Design System

### Color Palette
```swift
extension Color {
    static let mappLockPrimary = Color(red: 0.0, green: 0.48, blue: 1.0)      // #007AFF
    static let mappLockSecondary = Color(red: 0.2, green: 0.2, blue: 0.2)     // #333333
    static let mappLockSuccess = Color(red: 0.2, green: 0.78, blue: 0.35)     // #34C759
    static let mappLockWarning = Color(red: 1.0, green: 0.58, blue: 0.0)      // #FF9500
    static let mappLockDanger = Color(red: 1.0, green: 0.23, blue: 0.19)      // #FF3B30

    // Adaptive Colors
    static let cardBackground = Color(UIColor.secondarySystemBackground)
    static let surfaceBackground = Color(UIColor.tertiarySystemBackground)
    static let textPrimary = Color(UIColor.label)
    static let textSecondary = Color(UIColor.secondaryLabel)
}
```

### Typography Scale
```swift
extension Font {
    static let mappLockLargeTitle = Font.largeTitle.weight(.bold)
    static let mappLockTitle = Font.title2.weight(.semibold)
    static let mappLockHeadline = Font.headline.weight(.semibold)
    static let mappLockSubheadline = Font.subheadline.weight(.medium)
    static let mappLockBody = Font.body.weight(.regular)
    static let mappLockCaption = Font.caption.weight(.medium)
    static let mappLockFootnote = Font.footnote.weight(.regular)
}
```

### Spacing System
```swift
enum Spacing {
    static let xs: CGFloat = 4
    static let sm: CGFloat = 8
    static let md: CGFloat = 12
    static let lg: CGFloat = 16
    static let xl: CGFloat = 20
    static let xxl: CGFloat = 24
    static let xxxl: CGFloat = 32
}
```

---

## 📲 iPhone-Specific Features

### 1. Widget Support
```swift
struct MappLockWidget: Widget {
    let kind: String = "MappLockWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            MappLockWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("MappLock Status")
        .description("Quick access to MappLock controls")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

struct MappLockWidgetEntryView: View {
    var entry: Provider.Entry

    var body: some View {
        VStack(spacing: 8) {
            HStack {
                Image(systemName: "bolt.fill")
                    .foregroundColor(.yellow)
                Text("MappLock")
                    .font(.headline)
                    .fontWeight(.semibold)
                Spacer()
            }

            HStack {
                VStack(alignment: .leading) {
                    Text(entry.sessionManager.isActive ? "ACTIVE" : "INACTIVE")
                        .font(.caption)
                        .fontWeight(.bold)
                        .foregroundColor(entry.sessionManager.isActive ? .green : .gray)

                    if entry.sessionManager.isActive {
                        Text(entry.sessionManager.formattedTimeRemaining)
                            .font(.title2)
                            .fontWeight(.semibold)
                    }
                }
                Spacer()
            }

            // Quick Actions
            HStack(spacing: 8) {
                Link(destination: URL(string: "mapplock://pause")!) {
                    Image(systemName: "pause.fill")
                        .font(.caption)
                        .foregroundColor(.white)
                        .frame(width: 28, height: 28)
                        .background(Color.orange)
                        .cornerRadius(6)
                }

                Link(destination: URL(string: "mapplock://settings")!) {
                    Image(systemName: "gearshape.fill")
                        .font(.caption)
                        .foregroundColor(.white)
                        .frame(width: 28, height: 28)
                        .background(Color.gray)
                        .cornerRadius(6)
                }

                Spacer()
            }
        }
        .padding()
        .background(Color(UIColor.systemBackground))
    }
}
```

### 2. Shortcuts Integration
```swift
struct MappLockShortcuts {
    static func donate() {
        let startSession = INIntent()
        startSession.suggestedInvocationPhrase = "Start MappLock session"

        let interaction = INInteraction(intent: startSession, response: nil)
        interaction.donate { error in
            if let error = error {
                print("Failed to donate shortcut: \(error)")
            }
        }
    }

    static func handleShortcut(_ shortcut: NSUserActivity) -> Bool {
        guard shortcut.activityType == "StartMappLockSession" else { return false }

        // Handle shortcut execution
        SessionManager.shared.startNewSession()
        return true
    }
}
```

### 3. Focus Modes Integration
```swift
import Intents

struct FocusModeIntegration {
    static func configureFocusMode() {
        let intent = INSetTaskAttributeIntent()
        intent.targetTask = INTask(
            title: INSpeakableString(spokenPhrase: "MappLock Focus Session"),
            status: .notCompleted,
            taskType: .completable
        )

        let interaction = INInteraction(intent: intent, response: nil)
        interaction.donate { _ in }
    }

    static func syncWithSystemFocus() {
        // Monitor system focus changes
        NotificationCenter.default.addObserver(
            forName: UIApplication.didBecomeActiveNotification,
            object: nil,
            queue: .main
        ) { _ in
            // Sync MappLock state with iOS Focus
            updateFocusState()
        }
    }

    private static func updateFocusState() {
        // Implementation for focus state synchronization
    }
}
```

---

## 🔧 Device Size Adaptations

### iPhone Pro Max Layout
```swift
struct ProMaxLayout: View {
    var body: some View {
        VStack(spacing: 24) {
            // Enhanced status area with more info
            EnhancedStatusCard()

            // Split action panels
            HStack(spacing: 16) {
                VStack(spacing: 12) {
                    QuickControlsPanel()
                    SessionControlsPanel()
                }

                VStack(spacing: 12) {
                    AnalyticsPanel()
                    TemplatesPanel()
                }
            }

            // Full-width suggestions
            SmartSuggestionsPanel()
        }
        .padding(.horizontal, 20)
    }
}
```

### iPhone SE Compact Layout
```swift
struct CompactLayout: View {
    @State private var selectedTab = 0

    var body: some View {
        VStack(spacing: 0) {
            // Minimal status bar
            CompactStatusBar()

            TabView(selection: $selectedTab) {
                // Main controls
                MainControlsView()
                    .tabItem {
                        Image(systemName: "play.circle")
                        Text("Control")
                    }
                    .tag(0)

                // Settings
                SettingsView()
                    .tabItem {
                        Image(systemName: "gearshape")
                        Text("Settings")
                    }
                    .tag(1)

                // Analytics
                AnalyticsView()
                    .tabItem {
                        Image(systemName: "chart.bar")
                        Text("Stats")
                    }
                    .tag(2)
            }
        }
    }
}
```

---

## 🎯 User Experience Patterns

### 1. One-Handed Navigation
- **Thumb Zone Optimization**: Critical actions within 4-inch reach
- **Bottom Sheet Interactions**: Settings and detailed views slide up
- **Gesture Support**: Swipe gestures for common actions
- **Large Touch Targets**: Minimum 44pt touch targets

### 2. Contextual Actions
```swift
struct ContextualActionSheet: View {
    @State private var showingActionSheet = false
    let app: BlockedApp

    var body: some View {
        Button("App Options") {
            showingActionSheet = true
        }
        .actionSheet(isPresented: $showingActionSheet) {
            ActionSheet(
                title: Text(app.name),
                buttons: [
                    .default(Text("Temporarily Allow (15 min)")) {
                        app.temporaryAllow(duration: 900)
                    },
                    .default(Text("Add to Whitelist")) {
                        app.addToWhitelist()
                    },
                    .destructive(Text("Block Permanently")) {
                        app.blockPermanently()
                    },
                    .cancel()
                ]
            )
        }
    }
}
```

### 3. Smart Notifications
```swift
struct SmartNotificationSystem {
    static func scheduleSessionReminder() {
        let content = UNMutableNotificationContent()
        content.title = "MappLock Session Active"
        content.body = "15 minutes remaining in your focus session"
        content.sound = .default
        content.categoryIdentifier = "SESSION_REMINDER"

        let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 60, repeats: false)
        let request = UNNotificationRequest(identifier: UUID().uuidString, content: content, trigger: trigger)

        UNUserNotificationCenter.current().add(request)
    }

    static func registerNotificationCategories() {
        let extendAction = UNNotificationAction(
            identifier: "EXTEND_SESSION",
            title: "Extend +15 min",
            options: [.foreground]
        )

        let endAction = UNNotificationAction(
            identifier: "END_SESSION",
            title: "End Session",
            options: [.destructive]
        )

        let category = UNNotificationCategory(
            identifier: "SESSION_REMINDER",
            actions: [extendAction, endAction],
            intentIdentifiers: [],
            options: []
        )

        UNUserNotificationCenter.current().setNotificationCategories([category])
    }
}
```

---

## 🚀 Performance Optimizations

### 1. Memory Management
```swift
class iPhoneSessionManager: ObservableObject {
    @Published var currentState: SessionState = .inactive
    private var backgroundTask: UIBackgroundTaskIdentifier = .invalid

    func startBackgroundTask() {
        backgroundTask = UIApplication.shared.beginBackgroundTask {
            self.endBackgroundTask()
        }
    }

    func endBackgroundTask() {
        if backgroundTask != .invalid {
            UIApplication.shared.endBackgroundTask(backgroundTask)
            backgroundTask = .invalid
        }
    }
}
```

### 2. Battery Optimization
```swift
struct BatteryOptimizedView: View {
    @Environment(\.scenePhase) private var scenePhase
    @StateObject private var sessionManager = SessionManager()

    var body: some View {
        MainView()
            .onChange(of: scenePhase) { phase in
                switch phase {
                case .background:
                    sessionManager.enterLowPowerMode()
                case .active:
                    sessionManager.exitLowPowerMode()
                default:
                    break
                }
            }
    }
}
```

---

## 📱 iPhone Interface Summary

The iPhone MappLock interface is designed as a **Powerful Pocket Manager** that prioritizes:

1. **One-Handed Operation**: All critical functions accessible within thumb reach
2. **Instant Status Visibility**: Clear visual feedback of current lock state
3. **Smart Contextual Actions**: AI-powered suggestions based on usage patterns
4. **Seamless iOS Integration**: Widgets, Shortcuts, Focus modes, Dynamic Island
5. **Adaptive Layout**: Optimized for all iPhone sizes from SE to Pro Max

The interface maintains the professional grade functionality of the Mac version while embracing mobile-first design principles and iOS-specific capabilities.

---

*Next: Cross-platform architecture and shared codebase planning*