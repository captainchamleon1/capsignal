import SwiftUI

@main
struct SnakeBetApp: App {
    @StateObject private var wallet = WalletService()
    @StateObject private var matchmaking = MatchmakingService()

    var body: some Scene {
        WindowGroup {
            MainMenuView()
                .environmentObject(wallet)
                .environmentObject(matchmaking)
                .preferredColorScheme(.dark)
                .statusBarHidden()
        }
    }
}
