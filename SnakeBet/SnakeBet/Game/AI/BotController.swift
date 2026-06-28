import Foundation

struct BotDecision {
    let heading: CGFloat
    let boosting: Bool
}

struct BotController {
    let snake: Snake
    let arena: Arena
    let food: [FoodOrb]
    let threats: [Snake]

    func decide(aggression: CGFloat = 0.55) -> BotDecision {
        let head = snake.head

        // Find nearest food
        let nearestFood = food.min { a, b in
            head.distance(to: a.position) < head.distance(to: b.position)
        }

        var target = nearestFood?.position ?? head

        // Avoid arena edge
        let distToCenter = arena.center.distance(to: head)
        if distToCenter > arena.radius * 0.75 {
            target = arena.center
        }

        // Avoid nearby snake bodies
        for other in threats where other.id != snake.id {
            for (point, radius) in other.bodyPoints().prefix(20) {
                if head.distance(to: point) < radius + snake.headRadius + 30 {
                    let away = head - point
                    target = head + away.normalized * 120
                }
            }
        }

        // Occasional aggression toward smaller snakes
        if CGFloat.random(in: 0...1) < aggression {
            if let prey = threats.first(where: { $0.id != snake.id && $0.foodEaten < snake.foodEaten - 3 }) {
                target = prey.head
            }
        }

        let dx = target.x - head.x
        let dy = target.y - head.y
        let heading = atan2(dy, dx)
        let boosting = nearestFood.map { head.distance(to: $0.position) > 180 } ?? false

        return BotDecision(heading: heading, boosting: boosting)
    }
}
