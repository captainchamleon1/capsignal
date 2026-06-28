import SpriteKit
import Combine

protocol GameSceneDelegate: AnyObject {
    func gameDidFinish(message: String)
    func gameStateDidUpdate(hud: GameHUDState)
}

struct GameHUDState {
    var scoreCents: Int = 0
    var aliveCount: Int = 0
    var elapsedTime: TimeInterval = 0
    var isOutsideArena: Bool = false
    var outsideTimeRemaining: TimeInterval = 3
    var cashOutProgress: CGFloat = 0
    var mode: GameModeKind = .battleRoyale
    var timerRemaining: TimeInterval?
    var opponentScore: Int?
}

final class GameScene: SKScene {
    weak var gameDelegate: GameSceneDelegate?

    private var mode: GameMode!
    private let input = InputController()
    private var battleRoyale: BattleRoyaleMode?
    private var maxPoints: MaxPointsMode?
    private var lastUpdateTime: TimeInterval = 0
    private var currentGameTime: TimeInterval = 0
    private var worldNode = SKNode()
    private var entitiesNode = SKNode()
    private var touchOrigin: CGPoint?

    func configure(modeKind: GameModeKind, playerName: String) {
        switch modeKind {
        case .battleRoyale:
            let br = BattleRoyaleMode()
            br.setup(playerName: playerName)
            mode = br
            battleRoyale = br
        case .maxPoints:
            let mp = MaxPointsMode()
            mp.setup(playerName: playerName)
            mode = mp
            maxPoints = mp
        }
    }

    override func didMove(to view: SKView) {
        backgroundColor = SKColor(red: 0.06, green: 0.05, blue: 0.12, alpha: 1)
        removeAllChildren()

        worldNode = SKNode()
        worldNode.addChild(HexGridBackground.makeNode(worldSize: GameConstants.worldSize))
        entitiesNode = SKNode()
        worldNode.addChild(entitiesNode)
        addChild(worldNode)

        scaleMode = .resizeFill
    }

    override func update(_ currentTime: TimeInterval) {
        guard let mode else { return }

        let delta = lastUpdateTime == 0 ? 0 : min(currentTime - lastUpdateTime, 1.0 / 30)
        lastUpdateTime = currentTime
        currentGameTime = currentTime

        mode.update(delta: delta, at: currentTime, input: input)

        if let br = battleRoyale, br.isCashingOut {
            _ = br.updateCashOut(delta: delta)
        }

        renderWorld()
        updateCamera()
        publishHUD()

        if mode.isFinished, let message = mode.resultMessage() {
            gameDelegate?.gameDidFinish(message: message)
            self.isPaused = true
        }
    }

    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
        guard let touch = touches.first else { return }
        touchOrigin = touch.location(in: self)
    }

    override func touchesMoved(_ touches: Set<UITouch>, with event: UIEvent?) {
        guard let touch = touches.first, let origin = touchOrigin else { return }
        let point = touch.location(in: self)
        input.setTouchDirection(from: origin, to: point)
    }

    override func touchesEnded(_ touches: Set<UITouch>, with event: UIEvent?) {
        input.endTouch()
        touchOrigin = nil
    }

    func beginCashOut() {
        battleRoyale?.beginCashOut()
    }

    func cancelCashOut() {
        battleRoyale?.cancelCashOut()
    }

    private func renderWorld() {
        guard let mode else { return }
        entitiesNode.removeAllChildren()

        ArenaRenderer.render(arena: mode.arena, in: entitiesNode)
        FoodRenderer.render(food: mode.food, in: entitiesNode)

        let sorted = mode.snakes.sorted { $0.foodEaten < $1.foodEaten }
        for snake in sorted {
            SnakeRenderer.render(snake: snake, in: entitiesNode)
        }
    }

    private func updateCamera() {
        guard let player = mode?.playerSnake else { return }
        let target = player.head.point
        let viewSize = size
        let scale: CGFloat = 0.55

        worldNode.setScale(scale)
        worldNode.position = CGPoint(
            x: viewSize.width / 2 - target.x * scale,
            y: viewSize.height / 2 - target.y * scale
        )
    }

    private func publishHUD() {
        guard let mode, let player = mode.playerSnake else { return }

        var hud = GameHUDState()
        hud.scoreCents = player.scoreCents
        hud.aliveCount = mode.snakes.filter { $0.state == .alive }.count
        hud.elapsedTime = mode.elapsedTime
        hud.mode = mode.kind

        if let br = battleRoyale {
            hud.isOutsideArena = br.isPlayerOutsideArena
            if br.isPlayerOutsideArena, let start = br.outsideArenaSince[player.id] {
                hud.outsideTimeRemaining = max(0, GameConstants.outsideArenaDeathSeconds - (currentGameTime - start))
            }
            hud.cashOutProgress = br.cashOutFraction
        }

        if let mp = maxPoints {
            hud.timerRemaining = max(0, GameConstants.maxPointsDuration - mp.elapsedTime)
            hud.opponentScore = mp.opponentScore
        }

        gameDelegate?.gameStateDidUpdate(hud: hud)
    }
}
