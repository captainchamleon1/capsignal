import Foundation

struct WireEnvelope: Codable {
    let type: String
    let payload: Data?

    static func encode<T: Codable>(_ type: String, _ value: T) throws -> Data {
        let payload = try JSONEncoder().encode(value)
        return try JSONEncoder().encode(WireEnvelope(type: type, payload: payload))
    }
}

/// Simplified wire messages for WebSocket transport.
enum GameWireMessage {
    case join(JoinPayload)
    case input(InputPayload)
    case state(StatePayload)
    case matchFound(MatchFoundPayload)
    case cashOut(CashOutPayload)
    case eliminated(EliminatedPayload)
    case pong

    func encode() throws -> Data {
        switch self {
        case .join(let p): return try WireEnvelope.encode("join", p)
        case .input(let p): return try WireEnvelope.encode("input", p)
        case .state(let p): return try WireEnvelope.encode("state", p)
        case .matchFound(let p): return try WireEnvelope.encode("matchFound", p)
        case .cashOut(let p): return try WireEnvelope.encode("cashOut", p)
        case .eliminated(let p): return try WireEnvelope.encode("eliminated", p)
        case .pong: return try WireEnvelope.encode("pong", EmptyPayload())
        }
    }

    static func decode(from data: Data) throws -> GameWireMessage {
        let envelope = try JSONDecoder().decode(WireEnvelope.self, from: data)
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .millisecondsSince1970
        guard let payload = envelope.payload else { throw WireError.missingPayload }

        switch envelope.type {
        case "join": return .join(try decoder.decode(JoinPayload.self, from: payload))
        case "input": return .input(try decoder.decode(InputPayload.self, from: payload))
        case "state": return .state(try decoder.decode(StatePayload.self, from: payload))
        case "matchFound": return .matchFound(try decoder.decode(MatchFoundPayload.self, from: payload))
        case "cashOut": return .cashOut(try decoder.decode(CashOutPayload.self, from: payload))
        case "eliminated": return .eliminated(try decoder.decode(EliminatedPayload.self, from: payload))
        case "pong": return .pong
        default: throw WireError.unknownType
        }
    }

    enum WireError: Error {
        case missingPayload, unknownType
    }
}

private struct EmptyPayload: Codable {}
