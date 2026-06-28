import Foundation

enum CollisionSystem {
    static func checkFoodCollisions(snake: Snake, food: inout [FoodOrb]) -> Int {
        guard snake.state == .alive else { return 0 }
        var eatenValue = 0
        let eatRadius = snake.headRadius + GameConstants.foodOrbRadius

        food.removeAll { orb in
            let hit = snake.head.distance(to: orb.position) < eatRadius + orb.radius
            if hit {
                snake.eatFood(valueCents: orb.valueCents)
                eatenValue += orb.valueCents
            }
            return hit
        }
        return eatenValue
    }

    static func checkSnakeCollisions(snakes: [Snake]) -> Set<UUID> {
        var killed = Set<UUID>()

        for attacker in snakes where attacker.state == .alive {
            let head = attacker.head
            let headR = attacker.headRadius * 0.9

            for victim in snakes where victim.id != attacker.id && victim.state == .alive {
                for (bodyPoint, bodyR) in victim.bodyPoints() {
                    if head.distance(to: bodyPoint) < headR + bodyR * 0.85 {
                        killed.insert(attacker.id)
                        break
                    }
                }
                if killed.contains(attacker.id) { break }
            }
        }

        return killed
    }

    static func snakesOutsideArena(_ snakes: [Snake], arena: Arena, outsideSince: inout [UUID: TimeInterval], now: TimeInterval) -> Set<UUID> {
        var killed = Set<UUID>()

        for snake in snakes where snake.state == .alive {
            if arena.contains(snake.head) {
                outsideSince.removeValue(forKey: snake.id)
            } else {
                let start = outsideSince[snake.id] ?? now
                outsideSince[snake.id] = start
                if now - start >= GameConstants.outsideArenaDeathSeconds {
                    killed.insert(snake.id)
                }
            }
        }

        return killed
    }
}
