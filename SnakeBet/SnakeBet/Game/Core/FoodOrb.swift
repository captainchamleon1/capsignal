import CoreGraphics
import Foundation

struct FoodOrb: Identifiable {
    let id: UUID
    var position: Vector2
    let valueCents: Int
    let hue: CGFloat
    let radius: CGFloat

    init(
        id: UUID = UUID(),
        position: Vector2,
        valueCents: Int = GameConstants.foodValueCents,
        hue: CGFloat? = nil,
        radius: CGFloat = GameConstants.foodOrbRadius
    ) {
        self.id = id
        self.position = position
        self.valueCents = valueCents
        self.hue = hue ?? CGFloat.random(in: 0...1)
        self.radius = radius
    }
}

enum FoodSpawner {
    static func spawn(
        count: Int,
        in arena: Arena,
        valueCents: Int = GameConstants.foodValueCents
    ) -> [FoodOrb] {
        (0..<count).compactMap { _ in
            guard let pos = arena.randomPointInside(padding: 40) else { return nil }
            return FoodOrb(position: pos, valueCents: valueCents)
        }
    }

    static func spawnPocket(
        in arena: Arena,
        count: Int,
        clusterRadius: CGFloat = GameConstants.foodPocketRadius,
        valueCents: Int = GameConstants.foodValueCents
    ) -> [FoodOrb] {
        guard count > 0, let center = arena.randomPointInside(padding: clusterRadius + 40) else {
            return []
        }
        let pocketHue = CGFloat.random(in: 0...1)
        return (0..<count).map { _ in
            let angle = CGFloat.random(in: 0...(2 * .pi))
            let dist = sqrt(CGFloat.random(in: 0...1)) * clusterRadius
            let position = Vector2(
                x: center.x + cos(angle) * dist,
                y: center.y + sin(angle) * dist
            )
            return FoodOrb(
                position: position,
                valueCents: valueCents,
                hue: pocketHue + CGFloat.random(in: -0.06...0.06)
            )
        }
    }

    static func scatterFromSnake(_ snake: Snake, count: Int) -> [FoodOrb] {
        snake.segments.enumerated().flatMap { index, segment -> [FoodOrb] in
            guard index % 2 == 0 else { return [] }
            let jitter = Vector2(
                x: CGFloat.random(in: -20...20),
                y: CGFloat.random(in: -20...20)
            )
            return [FoodOrb(position: segment + jitter, valueCents: GameConstants.foodValueCents)]
        }.prefix(count).map { $0 }
    }
}
