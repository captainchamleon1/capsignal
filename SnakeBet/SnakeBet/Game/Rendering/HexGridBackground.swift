import SpriteKit
import UIKit

enum HexGridBackground {
    static func makeNode(worldSize: CGFloat) -> SKNode {
        let container = SKNode()
        let hexRadius: CGFloat = 28
        let hexHeight = hexRadius * 2
        let hexWidth = sqrt(3) * hexRadius
        let vertSpacing = hexHeight * 0.75

        let cols = Int(worldSize / hexWidth) + 2
        let rows = Int(worldSize / vertSpacing) + 2

        for row in 0..<rows {
            for col in 0..<cols {
                let xOffset = (row % 2 == 0) ? 0 : hexWidth / 2
                let x = CGFloat(col) * hexWidth + xOffset
                let y = CGFloat(row) * vertSpacing

                let hex = SKShapeNode(path: hexPath(radius: hexRadius))
                hex.position = CGPoint(x: x, y: y)
                hex.strokeColor = SKColor(red: 0.18, green: 0.14, blue: 0.32, alpha: 0.55)
                hex.lineWidth = 1.2
                hex.fillColor = SKColor(red: 0.1, green: 0.08, blue: 0.18, alpha: 0.35)
                container.addChild(hex)
            }
        }

        return container
    }

    private static func hexPath(radius: CGFloat) -> CGPath {
        let path = CGMutablePath()
        for i in 0..<6 {
            let angle = CGFloat(i) * .pi / 3 - .pi / 6
            let px = radius * cos(angle)
            let py = radius * sin(angle)
            if i == 0 { path.move(to: CGPoint(x: px, y: py)) }
            else { path.addLine(to: CGPoint(x: px, y: py)) }
        }
        path.closeSubpath()
        return path
    }
}
