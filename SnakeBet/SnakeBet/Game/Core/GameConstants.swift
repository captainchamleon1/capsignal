import CoreGraphics
import Foundation

enum GameConstants {
    // Arena
    static let worldSize: CGFloat = 6000
    static let initialArenaRadius: CGFloat = 2800
    static let minArenaRadius: CGFloat = 900
    static let arenaShrinkDuration: TimeInterval = 180
    static let arenaMoveSpeed: CGFloat = 80

    // Snake
    static let segmentSpacing: CGFloat = 12
    static let baseHeadRadius: CGFloat = 14
    static let baseSpeed: CGFloat = 220
    static let boostMultiplier: CGFloat = 1.65
    static let turnRate: CGFloat = 5.5
    static let initialSegmentCount = 12
    static let growthPerFood = 3

    // Food
    static let foodOrbRadius: CGFloat = 6
    static let battleRoyaleInitialFoodCount = 500
    static let battleRoyaleTotalFoodSpawn = 1000
    static let foodPocketMinOrbs = 20
    static let foodPocketMaxOrbs = 55
    static let foodPocketRadius: CGFloat = 120
    static let foodPocketMinInterval: TimeInterval = 6
    static let foodPocketMaxInterval: TimeInterval = 14
    static let maxPointsFoodCount = 80
    static let foodValueCents = 1

    // Battle Royale
    static let maxPlayers = 20
    static let entryFeeCents = 60
    static let maxWinCents = 1000
    static let outsideArenaDeathSeconds: TimeInterval = 3
    static let cashOutHoldSeconds: TimeInterval = 2.5

    // Max Points
    static let maxPointsDuration: TimeInterval = 60
    static let maxPointsBotCount = 8

    // Network tick rate target (60 Hz server, client interpolation)
    static let serverTickRate: Double = 60
    static let clientSendRate: Double = 30
}

enum GameModeKind: String, CaseIterable, Identifiable {
    case battleRoyale = "Battle Royale"
    case maxPoints = "Max Points"

    var id: String { rawValue }

    var subtitle: String {
        switch self {
        case .battleRoyale:
            return "$0.60 entry · up to $10 win · 20 players"
        case .maxPoints:
            return "60 seconds · beat your opponent's score"
        }
    }

    var icon: String {
        switch self {
        case .battleRoyale: return "crown.fill"
        case .maxPoints: return "timer"
        }
    }
}
