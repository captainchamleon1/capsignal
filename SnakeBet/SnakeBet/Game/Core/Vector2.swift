import CoreGraphics
import Foundation

struct Vector2: Codable, Hashable {
    var x: CGFloat
    var y: CGFloat

    static let zero = Vector2(x: 0, y: 0)

    init(x: CGFloat, y: CGFloat) {
        self.x = x
        self.y = y
    }

    init(_ point: CGPoint) {
        x = point.x
        y = point.y
    }

    var point: CGPoint { CGPoint(x: x, y: y) }

    var length: CGFloat { sqrt(x * x + y * y) }

    var normalized: Vector2 {
        let len = length
        guard len > 0.0001 else { return .zero }
        return Vector2(x: x / len, y: y / len)
    }

    func distance(to other: Vector2) -> CGFloat {
        hypot(x - other.x, y - other.y)
    }

    static func + (lhs: Vector2, rhs: Vector2) -> Vector2 {
        Vector2(x: lhs.x + rhs.x, y: lhs.y + rhs.y)
    }

    static func - (lhs: Vector2, rhs: Vector2) -> Vector2 {
        Vector2(x: lhs.x - rhs.x, y: lhs.y - rhs.y)
    }

    static func * (lhs: Vector2, rhs: CGFloat) -> Vector2 {
        Vector2(x: lhs.x * rhs, y: lhs.y * rhs)
    }
}
