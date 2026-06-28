import Foundation

/// Abstraction for real-money gambling payments.
/// Implement with Stripe, PayPal, or a licensed gaming wallet provider.
protocol PaymentProvider: Sendable {
    func deposit(amountCents: Int, userId: String) async throws -> PaymentReceipt
    func withdraw(amountCents: Int, userId: String) async throws -> PaymentReceipt
    func chargeEntryFee(amountCents: Int, userId: String, matchId: String) async throws -> PaymentReceipt
    func creditWinnings(amountCents: Int, userId: String, matchId: String) async throws -> PaymentReceipt
}

struct PaymentReceipt: Codable, Identifiable {
    let id: String
    let amountCents: Int
    let type: ReceiptType
    let timestamp: Date
    let providerReference: String?

    enum ReceiptType: String, Codable {
        case deposit, withdrawal, entryFee, winnings
    }
}

/// Demo provider — replace with StripePaymentProvider in production.
final class DemoPaymentProvider: PaymentProvider {
    func deposit(amountCents: Int, userId: String) async throws -> PaymentReceipt {
        try await simulateLatency()
        return PaymentReceipt(
            id: UUID().uuidString,
            amountCents: amountCents,
            type: .deposit,
            timestamp: Date(),
            providerReference: "demo_dep_\(amountCents)"
        )
    }

    func withdraw(amountCents: Int, userId: String) async throws -> PaymentReceipt {
        try await simulateLatency()
        return PaymentReceipt(
            id: UUID().uuidString,
            amountCents: amountCents,
            type: .withdrawal,
            timestamp: Date(),
            providerReference: "demo_wd_\(amountCents)"
        )
    }

    func chargeEntryFee(amountCents: Int, userId: String, matchId: String) async throws -> PaymentReceipt {
        try await simulateLatency()
        return PaymentReceipt(
            id: UUID().uuidString,
            amountCents: amountCents,
            type: .entryFee,
            timestamp: Date(),
            providerReference: "demo_entry_\(matchId)"
        )
    }

    func creditWinnings(amountCents: Int, userId: String, matchId: String) async throws -> PaymentReceipt {
        try await simulateLatency()
        return PaymentReceipt(
            id: UUID().uuidString,
            amountCents: amountCents,
            type: .winnings,
            timestamp: Date(),
            providerReference: "demo_win_\(matchId)"
        )
    }

    private func simulateLatency() async throws {
        try await Task.sleep(nanoseconds: 120_000_000)
    }
}

/// Future: Stripe integration stub
enum StripePaymentProviderFactory {
    static func make(apiKey: String) -> PaymentProvider {
        // TODO: Wire Stripe PaymentIntents + Apple Pay when legal/compliance ready
        DemoPaymentProvider()
    }
}
