import Foundation
import Combine

@MainActor
final class MatchmakingService: ObservableObject {
    @Published private(set) var isSearching = false
    @Published private(set) var currentMatchId: String?
    @Published private(set) var opponentName: String?
    @Published private(set) var opponentScore: Int?

    private let socket = GameSocketClient()

    init() {
        socket.onMatchFound = { [weak self] match in
            Task { @MainActor in
                self?.currentMatchId = match.matchId
                self?.opponentName = match.opponentName
                self?.opponentScore = match.opponentScore
                self?.isSearching = false
            }
        }
    }

    /// Async pairing for Max Points mode. Falls back to local bot lobby when offline.
    func findAsyncMatch(mode: GameModeKind) async throws -> String {
        isSearching = true
        defer { isSearching = false }

        let playerId = UUID().uuidString
        await socket.connect(playerId: playerId, playerName: "Player", mode: mode)

        if socket.isConnected {
            // Wait briefly for server match assignment
            try await Task.sleep(nanoseconds: 500_000_000)
            return currentMatchId ?? UUID().uuidString
        }

        // Offline demo: simulate async opponent assignment
        try await Task.sleep(nanoseconds: 800_000_000)
        currentMatchId = UUID().uuidString
        opponentName = ["RivalSnake", "CoilKing", "NeonViper"].randomElement()
        opponentScore = Int.random(in: 50...160)
        return currentMatchId!
    }

    func cancelSearch() {
        isSearching = false
        socket.disconnect()
    }
}
