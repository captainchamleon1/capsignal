import SwiftUI
import SpriteKit

struct GameContainerView: View {
    let mode: GameModeKind
    let playerName: String
    let onExit: () -> Void

    @State private var hud = GameHUDState()
    @State private var resultMessage: String?
    @State private var isCashingOut = false
    @State private var scene: GameScene = {
        let s = GameScene()
        s.size = CGSize(width: UIScreen.main.bounds.width, height: UIScreen.main.bounds.height)
        return s
    }()

    var body: some View {
        ZStack {
            SpriteView(scene: scene, options: [.ignoresSiblingOrder])
                .ignoresSafeArea()

            HUDOverlay(hud: hud, isCashingOut: $isCashingOut, mode: mode, onCashOutStart: {
                isCashingOut = true
                scene.beginCashOut()
            }, onCashOutEnd: {
                isCashingOut = false
                scene.cancelCashOut()
            })

            if hud.isOutsideArena && mode == .battleRoyale {
                DangerVignette(remaining: hud.outsideTimeRemaining)
            }

            if let resultMessage {
                ResultOverlay(message: resultMessage, onDismiss: onExit)
            }
        }
        .onAppear {
            scene.gameDelegate = GameSceneDelegateHandler(
                onFinish: { msg in resultMessage = msg },
                onHUD: { hud = $0 }
            )
            scene.configure(modeKind: mode, playerName: playerName)
        }
    }
}

private final class GameSceneDelegateHandler: GameSceneDelegate {
    let onFinish: (String) -> Void
    let onHUD: (GameHUDState) -> Void

    init(onFinish: @escaping (String) -> Void, onHUD: @escaping (GameHUDState) -> Void) {
        self.onFinish = onFinish
        self.onHUD = onHUD
    }

    func gameDidFinish(message: String) { onFinish(message) }
    func gameStateDidUpdate(hud: GameHUDState) { onHUD(hud) }
}

struct DangerVignette: View {
    let remaining: TimeInterval

    var body: some View {
        ZStack {
            RadialGradient(
                colors: [.clear, .red.opacity(0.55)],
                center: .center,
                startRadius: 80,
                endRadius: 400
            )
            .ignoresSafeArea()
            .allowsHitTesting(false)

            VStack {
                Text("OUTSIDE ARENA")
                    .font(.system(size: 14, weight: .black, design: .rounded))
                    .foregroundStyle(.white)
                Text(String(format: "%.1fs", remaining))
                    .font(.system(size: 28, weight: .bold, design: .monospaced))
                    .foregroundStyle(.red)
            }
            .padding(.top, 60)
            .frame(maxHeight: .infinity, alignment: .top)
            .allowsHitTesting(false)
        }
    }
}

struct ResultOverlay: View {
    let message: String
    let onDismiss: () -> Void

    var body: some View {
        ZStack {
            Color.black.opacity(0.7).ignoresSafeArea()
            VStack(spacing: 20) {
                Image(systemName: "flag.checkered")
                    .font(.system(size: 48))
                    .foregroundStyle(.yellow)
                Text(message)
                    .font(.title3.bold())
                    .multilineTextAlignment(.center)
                    .foregroundStyle(.white)
                    .padding(.horizontal)
                Button("Continue", action: onDismiss)
                    .buttonStyle(SnakeBetButtonStyle(variant: .primary))
            }
            .padding(32)
            .background(
                RoundedRectangle(cornerRadius: 24)
                    .fill(Color(red: 0.12, green: 0.1, blue: 0.2))
                    .overlay(RoundedRectangle(cornerRadius: 24).stroke(.white.opacity(0.15)))
            )
            .padding()
        }
    }
}
