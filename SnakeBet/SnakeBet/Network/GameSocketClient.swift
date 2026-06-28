import Foundation
import Combine

/// Low-latency WebSocket client prepared for authoritative multiplayer.
/// Currently runs in offline/demo mode until server URL is connected.
@MainActor
final class GameSocketClient: ObservableObject {
    @Published private(set) var isConnected = false
    @Published private(set) var latencyMs: Double = 0
    @Published private(set) var lastServerTick: UInt64 = 0

    private var webSocketTask: URLSessionWebSocketTask?
    private var pingTask: Task<Void, Never>?
    private var receiveTask: Task<Void, Never>?
    private var reconnectAttempts = 0
    private let session = URLSession(configuration: .default)

    var onState: ((StatePayload) -> Void)?
    var onMatchFound: ((MatchFoundPayload) -> Void)?

    func connect(playerId: String, playerName: String, mode: GameModeKind) async {
        disconnect()

        #if DEBUG
        // Demo mode: skip real connection if localhost server isn't running
        if NetworkConfig.gameServerURL.host == "localhost" {
            isConnected = false
            return
        }
        #endif

        var request = URLRequest(url: NetworkConfig.gameServerURL)
        request.timeoutInterval = 8
        webSocketTask = session.webSocketTask(with: request)
        webSocketTask?.resume()

        let join = JoinPayload(
            playerId: playerId,
            playerName: playerName,
            mode: mode.rawValue,
            entryFeeCents: mode == .battleRoyale ? TournamentEconomics.entryFeeCents : nil
        )

        await send(.join(join))
        isConnected = true
        reconnectAttempts = 0
        startReceiveLoop()
        startPingLoop()
    }

    func sendInput(tick: UInt64, heading: Float, boosting: Bool) async {
        let payload = InputPayload(tick: tick, heading: heading, boosting: boosting, timestamp: Date())
        await send(.input(payload))
    }

    func disconnect() {
        pingTask?.cancel()
        receiveTask?.cancel()
        webSocketTask?.cancel(with: .goingAway, reason: nil)
        webSocketTask = nil
        isConnected = false
    }

    private func send(_ message: GameWireMessage) async {
        guard let task = webSocketTask else { return }
        do {
            let data = try message.encode()
            try await task.send(.data(data))
        } catch {
            await handleDisconnect()
        }
    }

    private func startReceiveLoop() {
        receiveTask = Task {
            while !Task.isCancelled, let task = webSocketTask {
                do {
                    let message = try await task.receive()
                    switch message {
                    case .data(let data):
                        try handle(data: data)
                    case .string(let text):
                        if let data = text.data(using: .utf8) {
                            try handle(data: data)
                        }
                    @unknown default:
                        break
                    }
                } catch {
                    await handleDisconnect()
                    break
                }
            }
        }
    }

    private func handle(data: Data) throws {
        let message = try GameWireMessage.decode(from: data)
        switch message {
        case .state(let state):
            lastServerTick = state.tick
            onState?(state)
        case .matchFound(let match):
            onMatchFound?(match)
        case .pong:
            break
        default:
            break
        }
    }

    private func startPingLoop() {
        pingTask = Task {
            while !Task.isCancelled {
                try? await Task.sleep(nanoseconds: UInt64(NetworkConfig.pingIntervalSeconds * 1_000_000_000))
                let sent = Date()
                await send(.pong)
                latencyMs = Date().timeIntervalSince(sent) * 1000
            }
        }
    }

    private func handleDisconnect() async {
        isConnected = false
        guard reconnectAttempts < NetworkConfig.maxReconnectAttempts else { return }
        reconnectAttempts += 1
        try? await Task.sleep(nanoseconds: UInt64(NetworkConfig.reconnectDelaySeconds * 1_000_000_000))
        // Caller should re-invoke connect with stored credentials
    }
}
