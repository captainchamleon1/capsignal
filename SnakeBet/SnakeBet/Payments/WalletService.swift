import Foundation
import Combine

@MainActor
final class WalletService: ObservableObject {
    @Published private(set) var balanceCents: Int = 1000
    @Published private(set) var receipts: [PaymentReceipt] = []

    private let provider: PaymentProvider
    private let userId: String

    var balanceDollars: Double { Double(balanceCents) / 100 }

    init(provider: PaymentProvider = DemoPaymentProvider(), userId: String = UUID().uuidString) {
        self.provider = provider
        self.userId = userId
    }

    func deposit(amountCents: Int) async throws {
        let receipt = try await provider.deposit(amountCents: amountCents, userId: userId)
        balanceCents += amountCents
        receipts.append(receipt)
    }

    func payEntryFee() async throws {
        let fee = TournamentEconomics.entryFeeCents
        guard balanceCents >= fee else {
            throw WalletError.insufficientFunds
        }
        let matchId = UUID().uuidString
        let receipt = try await provider.chargeEntryFee(amountCents: fee, userId: userId, matchId: matchId)
        balanceCents -= fee
        receipts.append(receipt)
    }

    func cashOutWinnings(scoreCents: Int, matchId: String) async throws {
        let payout = TournamentEconomics.payoutForScore(scoreCents: scoreCents, cashedOut: true)
        guard payout > 0 else { return }
        let receipt = try await provider.creditWinnings(amountCents: payout, userId: userId, matchId: matchId)
        balanceCents += payout
        receipts.append(receipt)
    }

    enum WalletError: LocalizedError {
        case insufficientFunds

        var errorDescription: String? {
            switch self {
            case .insufficientFunds: return "Insufficient balance for entry fee."
            }
        }
    }
}
