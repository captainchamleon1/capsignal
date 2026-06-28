import Foundation

final class MaxPointsMode: GameMode {
    let kind: GameModeKind = .maxPoints
    private(set) var snakes: [Snake] = []
    private(set) var food: [FoodOrb] = []
    private(set) var arena = Arena(
        radius: GameConstants.initialArenaRadius * 0.7,
        minRadius: GameConstants.initialArenaRadius * 0.7,
        shrinkDuration: 0
    )
    private(set) var elapsedTime: TimeInterval = 0
    private(set) var outsideArenaSince: [UUID: TimeInterval] = [:]
    private(set) var isFinished = false

    var playerSnake: Snake? { snakes.first { $0.isPlayer } }
    var opponentScore: Int = 0
    var opponentName: String = "Rival"

    func setup(playerName: String) {
        snakes.removeAll()
        food.removeAll()
        isFinished = false
        elapsedTime = 0
        opponentScore = Int.random(in: 45...180)
        opponentName = ["SwiftViper", "CoilMaster", "NeonSnake", "OrbKing"].randomElement()!

        food = FoodSpawner.spawn(count: GameConstants.maxPointsFoodCount, in: arena)

        if let spawn = arena.randomPointInside(padding: 100) {
            snakes.append(Snake(
                name: playerName,
                color: SnakeColor.palette[0],
                position: spawn,
                heading: .pi / 4,
                isPlayer: true
            ))
        }

        for i in 0..<GameConstants.maxPointsBotCount {
            guard let spawn = arena.randomPointInside(padding: 80) else { continue }
            snakes.append(Snake(
                name: "Bot\(i + 1)",
                color: SnakeColor.palette[(i + 2) % SnakeColor.palette.count],
                position: spawn,
                heading: CGFloat.random(in: 0...(2 * .pi)),
                isBot: true
            ))
        }
    }

    func update(delta: TimeInterval, at time: TimeInterval, input: InputController) {
        elapsedTime += delta

        for snake in snakes {
            let heading: CGFloat
            let boosting: Bool

            if snake.isPlayer {
                heading = input.playerInput.targetHeading
                boosting = input.playerInput.boosting
            } else if snake.isBot {
                let bot = BotController(snake: snake, arena: arena, food: food, threats: snakes)
                let decision = bot.decide(aggression: 0.3)
                heading = decision.heading
                boosting = decision.boosting
            } else {
                continue
            }

            snake.update(delta: delta, targetHeading: heading, boosting: boosting)
        }

        var mutableFood = food
        for snake in snakes where snake.state == .alive {
            _ = CollisionSystem.checkFoodCollisions(snake: snake, food: &mutableFood)
        }
        food = mutableFood

        let deaths = CollisionSystem.checkSnakeCollisions(snakes: snakes)
        applyDeaths(deaths)

        // Respawn food to keep action going
        while food.count < GameConstants.maxPointsFoodCount / 2 {
            if let pos = arena.randomPointInside(padding: 30) {
                food.append(FoodOrb(position: pos))
            } else {
                break
            }
        }

        if elapsedTime >= GameConstants.maxPointsDuration {
            isFinished = true
            playerSnake?.cashOut()
        }
    }

    func resultMessage() -> String? {
        guard isFinished, let player = playerSnake else { return nil }
        let playerScore = player.scoreCents
        if playerScore > opponentScore {
            return "You win! \(playerScore)¢ vs \(opponentName)'s \(opponentScore)¢"
        } else if playerScore < opponentScore {
            return "\(opponentName) wins. \(opponentScore)¢ vs your \(playerScore)¢"
        }
        return "Tie! \(playerScore)¢ each."
    }
}
