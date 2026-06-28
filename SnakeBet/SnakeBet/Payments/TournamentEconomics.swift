import Foundation

enum TournamentEconomics {
    static let entryFeeCents = GameConstants.entryFeeCents
    static let maxWinCents = GameConstants.maxWinCents
    static let foodValueCents = GameConstants.foodValueCents
    static let totalPrizePoolCents = GameConstants.maxPlayers * entryFeeCents
    static let totalFoodValueCents = GameConstants.battleRoyaleTotalFoodSpawn * foodValueCents
    static let houseTakeCents = totalPrizePoolCents - totalFoodValueCents

    static func payoutForScore(scoreCents: Int, cashedOut: Bool) -> Int {
        guard cashedOut else { return 0 }
        return min(scoreCents, maxWinCents)
    }
}
