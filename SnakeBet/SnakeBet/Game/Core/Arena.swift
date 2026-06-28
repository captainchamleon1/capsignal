import CoreGraphics
import Foundation

final class Arena {
    var center: Vector2
    var radius: CGFloat
    let minRadius: CGFloat
    let maxRadius: CGFloat

    private var shrinkStartTime: TimeInterval?
    private var shrinkDuration: TimeInterval
    private var moveHeading: CGFloat
    private var isMovingPhase = false

    init(
        center: Vector2 = Vector2(x: GameConstants.worldSize / 2, y: GameConstants.worldSize / 2),
        radius: CGFloat = GameConstants.initialArenaRadius,
        minRadius: CGFloat = GameConstants.minArenaRadius,
        shrinkDuration: TimeInterval = GameConstants.arenaShrinkDuration
    ) {
        self.center = center
        self.radius = radius
        self.maxRadius = radius
        self.minRadius = minRadius
        self.shrinkDuration = shrinkDuration
        self.moveHeading = CGFloat.random(in: 0...(2 * .pi))
    }

    func startShrinking(at time: TimeInterval) {
        shrinkStartTime = time
    }

    func update(at time: TimeInterval, delta: TimeInterval) {
        guard let start = shrinkStartTime else { return }

        let elapsed = time - start
        if elapsed < shrinkDuration {
            let t = CGFloat(elapsed / shrinkDuration)
            let eased = 1 - pow(1 - t, 2)
            radius = maxRadius - (maxRadius - minRadius) * eased
        } else {
            isMovingPhase = true
            radius = minRadius
            let moveSpeed = GameConstants.arenaMoveSpeed * CGFloat(delta)
            center = Vector2(
                x: center.x + cos(moveHeading) * moveSpeed,
                y: center.y + sin(moveHeading) * moveSpeed
            )
            keepCenterInWorld()
            // Occasionally change direction
            if Int.random(in: 0..<300) == 0 {
                moveHeading += CGFloat.random(in: -0.8...0.8)
            }
        }
    }

    func contains(_ point: Vector2) -> Bool {
        center.distance(to: point) <= radius
    }

    func distanceOutside(_ point: Vector2) -> CGFloat {
        max(0, center.distance(to: point) - radius)
    }

    func randomPointInside(padding: CGFloat = 0) -> Vector2? {
        let usable = radius - padding
        guard usable > 20 else { return nil }
        let angle = CGFloat.random(in: 0...(2 * .pi))
        let dist = sqrt(CGFloat.random(in: 0...1)) * usable
        return Vector2(
            x: center.x + cos(angle) * dist,
            y: center.y + sin(angle) * dist
        )
    }

    private func keepCenterInWorld() {
        let margin = minRadius + 200
        center.x = max(margin, min(GameConstants.worldSize - margin, center.x))
        center.y = max(margin, min(GameConstants.worldSize - margin, center.y))

        if center.x <= margin || center.x >= GameConstants.worldSize - margin {
            moveHeading = .pi - moveHeading
        }
        if center.y <= margin || center.y >= GameConstants.worldSize - margin {
            moveHeading = -.pi - moveHeading
        }
    }
}
