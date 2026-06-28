import SwiftUI

struct HUDOverlay: View {
    let hud: GameHUDState
    @Binding var isCashingOut: Bool
    let mode: GameModeKind
    let onCashOutStart: () -> Void
    let onCashOutEnd: () -> Void

    var body: some View {
        VStack {
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 4) {
                    Text("$\(String(format: "%.2f", Double(hud.scoreCents) / 100))")
                        .font(.system(size: 28, weight: .bold, design: .rounded))
                        .foregroundStyle(.white)
                    if mode == .battleRoyale {
                        Text("\(hud.aliveCount) alive")
                            .font(.caption.weight(.semibold))
                            .foregroundStyle(.white.opacity(0.7))
                    }
                    if let timer = hud.timerRemaining {
                        Text(String(format: "%.0fs", timer))
                            .font(.title2.monospacedDigit().bold())
                            .foregroundStyle(.cyan)
                    }
                    if let opp = hud.opponentScore {
                        Text("Rival: \(opp)¢")
                            .font(.caption)
                            .foregroundStyle(.orange)
                    }
                }
                .padding(12)
                .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 14))

                Spacer()

                MiniMapPlaceholder()
            }
            .padding()

            Spacer()

            if mode == .battleRoyale {
                CashOutButton(
                    progress: hud.cashOutProgress,
                    isHolding: $isCashingOut,
                    onStart: onCashOutStart,
                    onEnd: onCashOutEnd
                )
                .padding(.bottom, 40)
            }
        }
    }
}

struct MiniMapPlaceholder: View {
    var body: some View {
        RoundedRectangle(cornerRadius: 10)
            .fill(Color.black.opacity(0.45))
            .frame(width: 90, height: 90)
            .overlay(
                RoundedRectangle(cornerRadius: 10)
                    .stroke(Color.purple.opacity(0.6), lineWidth: 2)
            )
            .overlay(
                Circle()
                    .fill(Color.green)
                    .frame(width: 6, height: 6)
            )
    }
}

struct CashOutButton: View {
    let progress: CGFloat
    @Binding var isHolding: Bool
    let onStart: () -> Void
    let onEnd: () -> Void

    var body: some View {
        ZStack {
            Circle()
                .stroke(Color.white.opacity(0.2), lineWidth: 6)
                .frame(width: 88, height: 88)

            Circle()
                .trim(from: 0, to: progress)
                .stroke(Color.green, style: StrokeStyle(lineWidth: 6, lineCap: .round))
                .frame(width: 88, height: 88)
                .rotationEffect(.degrees(-90))

            Text("CASH\nOUT")
                .font(.system(size: 11, weight: .black, design: .rounded))
                .multilineTextAlignment(.center)
                .foregroundStyle(.white)
        }
        .gesture(
            DragGesture(minimumDistance: 0)
                .onChanged { _ in
                    if !isHolding {
                        isHolding = true
                        onStart()
                    }
                }
                .onEnded { _ in
                    isHolding = false
                    onEnd()
                }
        )
        .accessibilityLabel("Cash out. Hold for 2.5 seconds.")
    }
}
