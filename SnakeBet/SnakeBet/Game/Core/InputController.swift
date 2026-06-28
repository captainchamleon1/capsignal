import Foundation

struct PlayerInput {
    var targetHeading: CGFloat = 0
    var boosting: Bool = false
}

final class InputController {
    var playerInput = PlayerInput()
    private(set) var touchActive = false

    func setTouchDirection(from origin: CGPoint, to point: CGPoint) {
        let dx = point.x - origin.x
        let dy = point.y - origin.y
        guard hypot(dx, dy) > 8 else { return }
        touchActive = true
        playerInput.targetHeading = atan2(dy, dx)
        playerInput.boosting = hypot(dx, dy) > 70
    }

    func endTouch() {
        touchActive = false
        playerInput.boosting = false
    }
}
