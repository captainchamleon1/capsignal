import Foundation

final class BattleRoyaleMode: GameMode {
    let kind: GameModeKind = .battleRoyale
    private(set) var snakes: [Snake] = []
    private(set) var food: [FoodOrb] = []
    private(set) var arena = Arena()
    private(set) var elapsedTime: TimeInterval = 0
    private(set) var outsideArenaSince: [UUID: TimeInterval] = [:]
    private(set) var isFinished = false

    private var startTime: TimeInterval?
    private(set) var cashOutProgress: TimeInterval = 0
    private(set) var isCashingOut = false
    private var totalFoodSpawned = 0
    private var nextPocketTimer: TimeInterval = 0
    private let botNames = [
        "ViperX", "CoilKing", "SlitherPro", "NeonFang", "ScaleLord",
        "HexHunter", "GlowWorm", "SerpentAce", "TailChaser", "OrbSnatcher",
        "CrimsonCoil", "AzureAsp", "JadeJolt", "GoldGlide", "ShadowScale",
        "TurboTail", "LuckyLoop", "SwiftSerpent", "MegaMamba", "PrimePython"
    ]

    var playerSnake: Snake? { snakes.first { $0.isPlayer } }

    var cashOutFraction: CGFloat {
        CGFloat(min(1, cashOutProgress / GameConstants.cashOutHoldSeconds))
    }

    var isPlayerOutsideArena: Bool {
        guard let player = playerSnake else { return false }
        return !arena.contains(player.head)
    }

    var playerOutsideSeconds: TimeInterval {
        guard let player = playerSnake, let start = outsideArenaSince[player.id] else { return 0 }
        return elapsedTime - (start - (startTime ?? 0))
    }

    func setup(playerName: String) {
        snakes.removeAll()
        food.removeAll()
        outsideArenaSince.removeAll()
        isFinished = false
        elapsedTime = 0
        startTime = nil
        arena = Arena()
        totalFoodSpawned = 0
        nextPocketTimer = randomPocketInterval()
        food = spawnInitialFood()

        let playerColor = SnakeColor.palette[0]
        if let spawn = arena.randomPointInside(padding: 120) {
            let player = Snake(
                name: playerName,
                color: playerColor,
                position: spawn,
                heading: CGFloat.random(in: 0...(2 * .pi)),
                isPlayer: true
            )
            snakes.append(player)
        }

        for i in 0..<(GameConstants.maxPlayers - 1) {
            guard let spawn = arena.randomPointInside(padding: 120) else { continue }
            let bot = Snake(
                name: botNames[i % botNames.count],
                color: SnakeColor.palette[(i + 1) % SnakeColor.palette.count],
                position: spawn,
                heading: CGFloat.random(in: 0...(2 * .pi)),
                isBot: true
            )
            snakes.append(bot)
        }
    }

    func update(delta: TimeInterval, at time: TimeInterval, input: InputController) {
        if startTime == nil {
            startTime = time
            arena.startShrinking(at: time)
        }
        elapsedTime += delta
        arena.update(at: time, delta: delta)

        for snake in snakes {
            let heading: CGFloat
            let boosting: Bool

            if snake.isPlayer {
                heading = input.playerInput.targetHeading
                boosting = input.playerInput.boosting
            } else if snake.isBot {
                let bot = BotController(snake: snake, arena: arena, food: food, threats: snakes)
                let decision = bot.decide()
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

        spawnFoodPockets(delta: delta)

        let collisionDeaths = CollisionSystem.checkSnakeCollisions(snakes: snakes)
        applyDeaths(collisionDeaths)

        let arenaDeaths = CollisionSystem.snakesOutsideArena(
            snakes,
            arena: arena,
            outsideSince: &outsideArenaSince,
            now: time
        )
        applyDeaths(arenaDeaths)

        if aliveCount() <= 1 {
            isFinished = true
        }
    }

    func beginCashOut() {
        isCashingOut = true
        cashOutProgress = 0
    }

    func cancelCashOut() {
        isCashingOut = false
        cashOutProgress = 0
    }

    func updateCashOut(delta: TimeInterval) -> Bool {
        guard isCashingOut, let player = playerSnake, player.state == .alive else {
            cancelCashOut()
            return false
        }
        cashOutProgress += delta
        if cashOutProgress >= GameConstants.cashOutHoldSeconds {
            player.cashOut()
            isFinished = true
            isCashingOut = false
            return true
        }
        return false
    }

    func resultMessage() -> String? {
        guard isFinished else { return nil }
        if let player = playerSnake {
            if player.state == .cashedOut {
                return "Cashed out $\(String(format: "%.2f", Double(player.scoreCents) / 100))"
            }
            if player.state == .alive && aliveCount() == 1 {
                return "Victory! You won the arena."
            }
            if player.state == .dead {
                return "Eliminated. Better luck next round."
            }
        }
        return "Round over."
    }

    private func spawnInitialFood() -> [FoodOrb] {
        let batch = FoodSpawner.spawn(
            count: GameConstants.battleRoyaleInitialFoodCount,
            in: arena
        )
        totalFoodSpawned = batch.count
        return batch
    }

    private func spawnFoodPockets(delta: TimeInterval) {
        guard totalFoodSpawned < GameConstants.battleRoyaleTotalFoodSpawn else { return }

        nextPocketTimer -= delta
        guard nextPocketTimer <= 0 else { return }

        let remaining = GameConstants.battleRoyaleTotalFoodSpawn - totalFoodSpawned
        let pocketSize = min(
            remaining,
            Int.random(in: GameConstants.foodPocketMinOrbs...GameConstants.foodPocketMaxOrbs)
        )
        guard pocketSize > 0 else { return }

        let pocket = FoodSpawner.spawnPocket(in: arena, count: pocketSize)
        food.append(contentsOf: pocket)
        totalFoodSpawned += pocket.count
        nextPocketTimer = randomPocketInterval()
    }

    private func randomPocketInterval() -> TimeInterval {
        Double.random(
            in: GameConstants.foodPocketMinInterval...GameConstants.foodPocketMaxInterval
        )
    }
}
