import Foundation

protocol GameMode: AnyObject {
    var kind: GameModeKind { get }
    var isFinished: Bool { get }
    var playerSnake: Snake? { get }
    var snakes: [Snake] { get }
    var food: [FoodOrb] { get }
    var arena: Arena { get }
    var elapsedTime: TimeInterval { get }
    var outsideArenaSince: [UUID: TimeInterval] { get }

    func setup(playerName: String)
    func update(delta: TimeInterval, at time: TimeInterval, input: InputController)
    func resultMessage() -> String?
}

extension GameMode {
    func applyDeaths(_ ids: Set<UUID>) {
        for snake in snakes where ids.contains(snake.id) {
            snake.kill()
        }
    }

    func aliveCount() -> Int {
        snakes.filter { $0.state == .alive }.count
    }
}
