import Foundation

enum NetworkConfig {
    static var gameServerURL: URL {
        if let override = ProcessInfo.processInfo.environment["SNAKEBET_WS_URL"],
           let url = URL(string: override) {
            return url
        }
        #if DEBUG
        return URL(string: "ws://localhost:8787/game")!
        #else
        return URL(string: "wss://game.snakebet.app/ws")!
        #endif
    }

    static let reconnectDelaySeconds: TimeInterval = 1.5
    static let maxReconnectAttempts = 8
    static let pingIntervalSeconds: TimeInterval = 5
    static let inputBufferSize = 3
}

struct JoinPayload: Codable {
    let playerId: String
    let playerName: String
    let mode: String
    let entryFeeCents: Int?
}

struct InputPayload: Codable {
    let tick: UInt64
    let heading: Float
    let boosting: Bool
    let timestamp: Date
}

struct StatePayload: Codable {
    let tick: UInt64
    let serverTime: Date
    let snakes: [SnakeSnapshot]
    let food: [FoodSnapshot]
    let arena: ArenaSnapshot
}

struct SnakeSnapshot: Codable {
    let id: String
    let name: String
    let segments: [Vector2]
    let heading: Float
    let scoreCents: Int
    let alive: Bool
}

struct FoodSnapshot: Codable {
    let id: String
    let position: Vector2
    let valueCents: Int
}

struct ArenaSnapshot: Codable {
    let center: Vector2
    let radius: Float
}

struct MatchFoundPayload: Codable {
    let matchId: String
    let mode: String
    let opponentName: String?
    let opponentScore: Int?
}

struct CashOutPayload: Codable {
    let playerId: String
    let amountCents: Int
}

struct EliminatedPayload: Codable {
    let playerId: String
    let reason: String
}
