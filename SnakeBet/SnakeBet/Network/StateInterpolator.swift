import Foundation

/// Client-side prediction buffer for sub-100ms feel once online play is enabled.
struct InputBuffer {
    private var pending: [InputPayload] = []
    private let capacity: Int

    init(capacity: Int = NetworkConfig.inputBufferSize) {
        self.capacity = capacity
    }

    mutating func push(_ input: InputPayload) {
        pending.append(input)
        if pending.count > capacity {
            pending.removeFirst(pending.count - capacity)
        }
    }

    func latest() -> InputPayload? {
        pending.last
    }

    mutating func clear() {
        pending.removeAll()
    }
}

/// Interpolates remote snake positions between server ticks.
struct StateInterpolator {
    private var previous: StatePayload?
    private var current: StatePayload?

    mutating func ingest(_ state: StatePayload) {
        previous = current
        current = state
    }

    func lerp(at time: Date) -> StatePayload? {
        guard let current else { return nil }
        guard let previous, current.tick > previous.tick else { return current }

        let total = current.serverTime.timeIntervalSince(previous.serverTime)
        guard total > 0 else { return current }
        let t = min(1, max(0, time.timeIntervalSince(previous.serverTime) / total))

        // Simple position blend for remote snakes
        var blendedSnakes: [SnakeSnapshot] = []
        for snake in current.snakes {
            if let prev = previous.snakes.first(where: { $0.id == snake.id }),
               let head = snake.segments.first,
               let prevHead = prev.segments.first {
                var copy = snake
                let lx = prevHead.x + (head.x - prevHead.x) * t
                let ly = prevHead.y + (head.y - prevHead.y) * t
                var segs = snake.segments
                if !segs.isEmpty {
                    segs[0] = Vector2(x: lx, y: ly)
                }
                copy = SnakeSnapshot(
                    id: snake.id,
                    name: snake.name,
                    segments: segs,
                    heading: snake.heading,
                    scoreCents: snake.scoreCents,
                    alive: snake.alive
                )
                blendedSnakes.append(copy)
            } else {
                blendedSnakes.append(snake)
            }
        }

        return StatePayload(
            tick: current.tick,
            serverTime: time,
            snakes: blendedSnakes,
            food: current.food,
            arena: current.arena
        )
    }
}
