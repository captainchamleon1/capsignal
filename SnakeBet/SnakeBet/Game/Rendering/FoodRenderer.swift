import SpriteKit
import UIKit

enum FoodRenderer {
    static func render(food: [FoodOrb], in parent: SKNode) {
        for orb in food {
            let node = SKShapeNode(circleOfRadius: orb.radius)
            node.position = orb.position.point
            node.fillColor = UIColor(hue: orb.hue, saturation: 0.75, brightness: 0.95, alpha: 1)
            node.strokeColor = UIColor(hue: orb.hue, saturation: 0.5, brightness: 1, alpha: 0.6)
            node.lineWidth = 1
            node.glowWidth = 3
            node.zPosition = 5
            parent.addChild(node)
        }
    }
}

enum ArenaRenderer {
    static func render(arena: Arena, in parent: SKNode) {
        let ring = SKShapeNode(circleOfRadius: arena.radius + 40)
        ring.position = arena.center.point
        ring.strokeColor = SKColor(red: 0.8, green: 0.1, blue: 0.2, alpha: 0.15)
        ring.lineWidth = 80
        ring.fillColor = .clear
        ring.zPosition = 1.5
        parent.addChild(ring)

        let circle = SKShapeNode(circleOfRadius: arena.radius)
        circle.position = arena.center.point
        circle.strokeColor = SKColor(red: 0.55, green: 0.35, blue: 0.95, alpha: 0.85)
        circle.lineWidth = 6
        circle.fillColor = .clear
        circle.glowWidth = 8
        circle.zPosition = 2
        parent.addChild(circle)
    }
}
