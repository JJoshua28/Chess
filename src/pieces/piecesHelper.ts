import { colouredPieceSymbol, PlayerIdType, PlayerPieceDetails, translucentPieceSymbol } from "../types/pieceTypes"

const player1sPieceDetails: PlayerPieceDetails = {
    playerId: 1,
    pieceColour: "Black",
    piecesSymbols: colouredPieceSymbol,
}

const player2sPieceDetails: PlayerPieceDetails = {
    playerId: 2,
    pieceColour: "White",
    piecesSymbols: translucentPieceSymbol,
}

export function returnPlayersPieceDetails(playerId: PlayerIdType): PlayerPieceDetails {
    switch (playerId) {
        case 1:
            return player1sPieceDetails;
        default:
            return player2sPieceDetails;
    }

}