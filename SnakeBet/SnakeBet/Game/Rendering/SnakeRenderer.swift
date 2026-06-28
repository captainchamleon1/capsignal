import SpriteKit
import UIKit

enum SnakeRenderer {
    static func render(snake: Snake, in parent: SKNode, zBase: CGFloat = 10) {
        guard snake.state != .dead else { return }

        let color = snake.color
        let primary = uiColor(color.primary)
        let secondary = uiColor(color.secondary)

        var headNode: SKNode?
        for (index, segment) in snake.segments.enumerated() {
            let t = CGFloat(index) / CGFloat(max(snake.segments.count - 1, 1))
            let radius = index == 0 ? snake.headRadius : snake.headRadius * 0.85
            let node = SKShapeNode(circleOfRadius: radius)
            node.position = segment.point
            node.fillColor = blend(primary, secondary, t: t)
            node.strokeColor = primary.withAlphaComponent(0.35)
            node.lineWidth = 1.5
            node.zPosition = zBase - CGFloat(index) * 0.01
            node.glowWidth = index == 0 ? 4 : 1.5
            parent.addChild(node)
            if index == 0 { headNode = node }
        }

        if let headNode, snake.segments.count > 0 {
            let heading = snake.segments.count > 1
                ? atan2(snake.segments[0].y - snake.segments[1].y, snake.segments[0].x - snake.segments[1].x)
                : 0
            addEyes(to: headNode, heading: heading)
        }

        // Name label
        let label = SKLabelNode(text: snake.name)
        label.fontName = "AvenirNext-Bold"
        label.fontSize = 11
        label.fontColor = .white
        label.position = CGPoint(x: snake.head.x, y: snake.head.y + snake.headRadius + 14)
        label.zPosition = zBase + 1
        parent.addChild(label)
    }

    private static func addEyes(to head: SKNode, heading: CGFloat) {
        let eyeOffset: CGFloat = 5
        let forward = CGPoint(x: cos(heading), y: sin(heading))
        let side = CGPoint(x: -forward.y, y: forward.x)

        for sign in [-1.0 as CGFloat, 1.0] {
            let eye = SKShapeNode(circleOfRadius: 3.5)
            eye.fillColor = .white
            eye.strokeColor = .clear
            eye.position = CGPoint(
                x: forward.x * 6 + side.x * eyeOffset * sign,
                y: forward.y * 6 + side.y * eyeOffset * sign
            )
            eye.zPosition = 1

            let pupil = SKShapeNode(circleOfRadius: 1.8)
            pupil.fillColor = .black
            pupil.strokeColor = .clear
            pupil.position = CGPoint(x: forward.x * 1.2, y: forward.y * 1.2)
            eye.addChild(pupil)
            head.addChild(eye)
        }
    }

    private static func uiColor(_ c: CodableColor) -> UIColor {
        UIColor(red: c.r, green: c.g, blue: c.b, alpha: 1)
    }

    private static func blend(_ a: UIColor, _ b: UIColor, t: CGFloat) -> UIColor {
        var ar: CGFloat = 0, ag: CGFloat = 0, ab: CGFloat = 0, aa: CGFloat = 0
        var br: CGFloat = 0, bg: CGFloat = 0, bb: CGFloat = 0, ba: CGFloat = 0
        a.getRed(&ar, green: &ag, blue: &ab, alpha: &aa)
        b.getRed(&br, green: &bg, blue: &bb, alpha: &ba)
        return UIColor(
            red: ar + (br - ar) * t,
            green: ag + (bg - ag) * t,
            blue: ab + (bb - ab) * t,
            alpha: 1
        )
    }
}
