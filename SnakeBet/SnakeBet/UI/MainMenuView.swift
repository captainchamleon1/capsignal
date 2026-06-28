import SwiftUI

struct MainMenuView: View {
    @EnvironmentObject var wallet: WalletService
    @EnvironmentObject var matchmaking: MatchmakingService
    @State private var selectedMode: GameModeKind?
    @State private var playerName = "Player"
    @State private var showEntrySheet = false
    @State private var pendingMode: GameModeKind?

    var body: some View {
        NavigationStack {
            ZStack {
                SlitherBackground()

                VStack(spacing: 28) {
                    header
                    balanceCard
                    modeCards
                    Spacer()
                    footer
                }
                .padding()
            }
            .navigationDestination(item: $selectedMode) { mode in
                GameContainerView(mode: mode, playerName: playerName) {
                    selectedMode = nil
                }
            }
            .sheet(isPresented: $showEntrySheet) {
                EntryConfirmationSheet(
                    mode: pendingMode ?? .battleRoyale,
                    wallet: wallet,
                    onConfirm: {
                        showEntrySheet = false
                        if let mode = pendingMode {
                            selectedMode = mode
                        }
                    },
                    onCancel: { showEntrySheet = false }
                )
                .presentationDetents([.medium])
            }
        }
    }

    private var header: some View {
        VStack(spacing: 8) {
            Text("SNAKEBET")
                .font(.system(size: 42, weight: .black, design: .rounded))
                .foregroundStyle(
                    LinearGradient(colors: [.green, .cyan], startPoint: .leading, endPoint: .trailing)
                )
            Text("Skill-based snake battles")
                .font(.subheadline.weight(.medium))
                .foregroundStyle(.white.opacity(0.65))
        }
        .padding(.top, 24)
    }

    private var balanceCard: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text("Balance")
                    .font(.caption.weight(.semibold))
                    .foregroundStyle(.white.opacity(0.6))
                Text("$\(String(format: "%.2f", wallet.balanceDollars))")
                    .font(.title2.bold())
                    .foregroundStyle(.white)
            }
            Spacer()
            Button("Add Funds") {
                Task { try? await wallet.deposit(amountCents: 500) }
            }
            .buttonStyle(SnakeBetButtonStyle(variant: .secondary))
        }
        .padding()
        .background(cardBackground)
    }

    private var modeCards: some View {
        VStack(spacing: 16) {
            ForEach(GameModeKind.allCases) { mode in
                Button {
                    startMode(mode)
                } label: {
                    ModeCard(mode: mode)
                }
                .buttonStyle(.plain)
            }
        }
    }

    private var footer: some View {
        Text("Payments & online play ready — local demo mode")
            .font(.caption2)
            .foregroundStyle(.white.opacity(0.4))
            .padding(.bottom, 8)
    }

    private var cardBackground: some View {
        RoundedRectangle(cornerRadius: 18)
            .fill(Color(red: 0.11, green: 0.09, blue: 0.2).opacity(0.9))
            .overlay(RoundedRectangle(cornerRadius: 18).stroke(.white.opacity(0.1)))
    }

    private func startMode(_ mode: GameModeKind) {
        pendingMode = mode
        if mode == .battleRoyale {
            showEntrySheet = true
        } else {
            Task {
                _ = try? await matchmaking.findAsyncMatch(mode: mode)
                selectedMode = mode
            }
        }
    }
}

struct ModeCard: View {
    let mode: GameModeKind

    var body: some View {
        HStack(spacing: 16) {
            Image(systemName: mode.icon)
                .font(.title)
                .foregroundStyle(.green)
                .frame(width: 48, height: 48)
                .background(Circle().fill(.green.opacity(0.15)))

            VStack(alignment: .leading, spacing: 4) {
                Text(mode.rawValue)
                    .font(.headline.bold())
                    .foregroundStyle(.white)
                Text(mode.subtitle)
                    .font(.caption)
                    .foregroundStyle(.white.opacity(0.6))
            }
            Spacer()
            Image(systemName: "chevron.right")
                .foregroundStyle(.white.opacity(0.4))
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 18)
                .fill(Color(red: 0.14, green: 0.11, blue: 0.26))
                .overlay(RoundedRectangle(cornerRadius: 18).stroke(.purple.opacity(0.35), lineWidth: 1))
        )
    }
}

struct SlitherBackground: View {
    var body: some View {
        ZStack {
            LinearGradient(
                colors: [
                    Color(red: 0.05, green: 0.04, blue: 0.12),
                    Color(red: 0.1, green: 0.06, blue: 0.22)
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()

            Canvas { context, size in
                let hexR: CGFloat = 18
                let w = hexR * sqrt(3)
                let h = hexR * 2 * 0.75
                let cols = Int(size.width / w) + 2
                let rows = Int(size.height / h) + 2
                for row in 0..<rows {
                    for col in 0..<cols {
                        let x = CGFloat(col) * w + (row % 2 == 0 ? 0 : w / 2)
                        let y = CGFloat(row) * h
                        var path = Path()
                        for i in 0..<6 {
                            let a = CGFloat(i) * .pi / 3 - .pi / 6
                            let px = x + hexR * cos(a)
                            let py = y + hexR * sin(a)
                            if i == 0 { path.move(to: CGPoint(x: px, y: py)) }
                            else { path.addLine(to: CGPoint(x: px, y: py)) }
                        }
                        path.closeSubpath()
                        context.stroke(path, with: .color(.white.opacity(0.04)), lineWidth: 0.8)
                    }
                }
            }
            .ignoresSafeArea()
        }
    }
}

struct SnakeBetButtonStyle: ButtonStyle {
    enum Variant { case primary, secondary }

    let variant: Variant

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.subheadline.bold())
            .padding(.horizontal, 18)
            .padding(.vertical, 10)
            .background(background)
            .foregroundStyle(foreground)
            .clipShape(Capsule())
            .scaleEffect(configuration.isPressed ? 0.96 : 1)
    }

    private var background: some ShapeStyle {
        switch variant {
        case .primary:
            AnyShapeStyle(LinearGradient(colors: [.green, .cyan], startPoint: .leading, endPoint: .trailing))
        case .secondary:
            AnyShapeStyle(Color.white.opacity(0.12))
        }
    }

    private var foreground: Color {
        variant == .primary ? .black : .white
    }
}

struct EntryConfirmationSheet: View {
    let mode: GameModeKind
    @ObservedObject var wallet: WalletService
    let onConfirm: () -> Void
    let onCancel: () -> Void

    var body: some View {
        VStack(spacing: 20) {
            Text("Enter Tournament")
                .font(.title2.bold())
            Text("Entry fee: $\(String(format: "%.2f", Double(TournamentEconomics.entryFeeCents) / 100))")
            Text("Max win: $\(String(format: "%.2f", Double(TournamentEconomics.maxWinCents) / 100))")
                .foregroundStyle(.secondary)

            HStack(spacing: 12) {
                Button("Cancel", action: onCancel)
                    .buttonStyle(SnakeBetButtonStyle(variant: .secondary))
                Button("Pay & Play") {
                    Task {
                        try? await wallet.payEntryFee()
                        onConfirm()
                    }
                }
                .buttonStyle(SnakeBetButtonStyle(variant: .primary))
            }
        }
        .padding()
    }
}
