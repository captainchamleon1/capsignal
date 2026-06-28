# SnakeBet

Skill-based slither.io-style iPhone game inspired by Triumph's Snake Royale.

## Modes

| Mode | Description |
|------|-------------|
| **Battle Royale** | 20-player arena, $0.60 entry, 100 food orbs (1¢ each), shrinking then drifting safe zone, 3s outside-zone death, 2.5s cash-out hold |
| **Max Points** | 60-second solo run vs bots, async score compared to a paired opponent |

## Run the iOS app

```bash
cd SnakeBet
xcodegen generate
open SnakeBet.xcodeproj
```

Build and run on an iPhone simulator or device (iOS 17+).

### Controls

- Touch and drag anywhere to steer your snake
- Drag farther from touch origin to boost
- Battle Royale: hold **Cash Out** for 2.5 seconds to exit safely with your collected value

## Architecture

```
SnakeBet/
├── SnakeBet/           # iOS app (SwiftUI + SpriteKit)
│   ├── Game/           # Core engine, modes, AI, rendering
│   ├── Network/        # WebSocket client, matchmaking, interpolation
│   ├── Payments/       # Wallet + PaymentProvider abstraction
│   └── UI/             # Menus, HUD, overlays
└── Server/             # Low-latency WebSocket game server stub
```

### Online play (prepared, not required for local demo)

1. Start the game server: `cd Server && npm install && npm start`
2. Set `SNAKEBET_WS_URL=ws://localhost:8787/game` in the Xcode scheme environment
3. The client uses 60 Hz server ticks with client-side input buffering and state interpolation

### Payments (prepared, not wired)

- `PaymentProvider` protocol with `DemoPaymentProvider` for local testing
- `WalletService` handles balance, entry fees, and winnings
- Replace with `StripePaymentProviderFactory` when compliance and Apple Pay are ready

## Assets

- **In-game visuals**: Procedural slither.io-style hex grid, glowing snake segments, orb food (matches original aesthetic)
- **Bundled**: OpenGameArt snake graphics in `SnakeBet/Resources/` (CC0 / attribution-friendly)
- **UI**: Custom SwiftUI components with hex background; swap in [Kenney UI Pack](https://kenney.nl/assets/ui-pack) PNGs for production polish

## Economics

- Entry: $0.60 (60¢)
- Max win: $10.00
- Food: 100 orbs × 1¢
- Rake computed in `TournamentEconomics.rakePercent`

## Legal note

Real-money skill gaming requires jurisdiction-specific licenses. The payment layer is stubbed for development only.

## Next steps

1. Authoritative server simulation (move physics server-side)
2. Stripe / Apple Pay integration behind `PaymentProvider`
3. Matchmaking queue with Redis
4. Anti-cheat validation on server
5. App Store assets and compliance review
