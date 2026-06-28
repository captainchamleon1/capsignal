import CoreGraphics
import Foundation

struct SnakeColor: Codable, Hashable {
    let primary: CodableColor
    let secondary: CodableColor

    static let palette: [SnakeColor] = [
        SnakeColor(primary: .init(r: 0.95, g: 0.25, b: 0.35), secondary: .init(r: 0.75, g: 0.1, b: 0.2)),
        SnakeColor(primary: .init(r: 0.2, g: 0.85, b: 0.45), secondary: .init(r: 0.05, g: 0.55, b: 0.3)),
        SnakeColor(primary: .init(r: 0.35, g: 0.55, b: 0.98), secondary: .init(r: 0.15, g: 0.3, b: 0.75)),
        SnakeColor(primary: .init(r: 0.98, g: 0.75, b: 0.2), secondary: .init(r: 0.8, g: 0.5, b: 0.05)),
        SnakeColor(primary: .init(r: 0.75, g: 0.35, b: 0.95), secondary: .init(r: 0.5, g: 0.15, b: 0.7)),
        SnakeColor(primary: .init(r: 0.2, g: 0.9, b: 0.9), secondary: .init(r: 0.05, g: 0.6, b: 0.65)),
        SnakeColor(primary: .init(r: 0.98, g: 0.45, b: 0.7), secondary: .init(r: 0.75, g: 0.2, b: 0.5)),
        SnakeColor(primary: .init(r: 0.9, g: 0.9, b: 0.95), secondary: .init(r: 0.55, g: 0.6, b: 0.7)),
    ]
}

struct CodableColor: Codable, Hashable {
    let r, g, b: CGFloat
}

enum SnakeState {
    case alive
    case dead
    case cashedOut
}

final class Snake: Identifiable {
    let id: UUID
    var name: String
    var color: SnakeColor
    var isPlayer: Bool
    var isBot: Bool

    private(set) var segments: [Vector2] = []
    private(set) var heading: CGFloat = 0
    private(set) var state: SnakeState = .alive
    private(set) var scoreCents: Int = 0
    private(set) var foodEaten: Int = 0

    var head: Vector2 { segments.first ?? .zero }
    var headRadius: CGFloat {
        GameConstants.baseHeadRadius + CGFloat(min(foodEaten, 80)) * 0.08
    }

    init(
        id: UUID = UUID(),
        name: String,
        color: SnakeColor,
        position: Vector2,
        heading: CGFloat = 0,
        isPlayer: Bool = false,
        isBot: Bool = false
    ) {
        self.id = id
        self.name = name
        self.color = color
        self.isPlayer = isPlayer
        self.isBot = isBot
        self.heading = heading

        var current = position
        for _ in 0..<GameConstants.initialSegmentCount {
            segments.append(current)
            current = Vector2(
                x: current.x - cos(heading) * GameConstants.segmentSpacing,
                y: current.y - sin(heading) * GameConstants.segmentSpacing
            )
        }
    }

    func update(delta: TimeInterval, targetHeading: CGFloat, boosting: Bool) {
        guard state == .alive else { return }

        let turn = shortestAngleDelta(from: heading, to: targetHeading)
        let maxTurn = GameConstants.turnRate * CGFloat(delta)
        heading += max(-maxTurn, min(maxTurn, turn))

        let speed = GameConstants.baseSpeed * (boosting ? GameConstants.boostMultiplier : 1)
        let dx = cos(heading) * speed * CGFloat(delta)
        let dy = sin(heading) * speed * CGFloat(delta)

        var newHead = Vector2(x: head.x + dx, y: head.y + dy)
        segments.insert(newHead, at: 0)

        let targetCount = GameConstants.initialSegmentCount + foodEaten * GameConstants.growthPerFood
        while segments.count > targetCount {
            segments.removeLast()
        }

        // Trail smoothing — pull segments toward predecessor
        for i in 1..<segments.count {
            let prev = segments[i - 1]
            var seg = segments[i]
            let deltaVec = prev - seg
            let dist = deltaVec.length
            if dist > GameConstants.segmentSpacing {
                let dir = deltaVec.normalized
                seg = prev - dir * GameConstants.segmentSpacing
                segments[i] = seg
            }
        }
    }

    func eatFood(valueCents: Int) {
        foodEaten += 1
        scoreCents += valueCents
    }

    func kill() {
        state = .dead
    }

    func cashOut() {
        state = .cashedOut
    }

    func bodyPoints(radiusScale: CGFloat = 1) -> [(center: Vector2, radius: CGFloat)] {
        guard segments.count > 2 else { return [] }
        let bodyRadius = headRadius * 0.85 * radiusScale
        return segments.dropFirst().map { ($0, bodyRadius) }
    }

    private func shortestAngleDelta(from: CGFloat, to: CGFloat) -> CGFloat {
        var delta = to - from
        while delta > .pi { delta -= 2 * .pi }
        while delta < -.pi { delta += 2 * .pi }
        return delta
    }
}
