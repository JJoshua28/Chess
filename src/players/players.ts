import { ColumnIds, RowIds, TileIdsType } from "../types/boardTypes";
import { ActivePieces, PieceNames, PieceTemplate, PlayerIdType } from "../types/pieceTypes";
import { createNewPiece, player1ActivePieces, player2ActivePieces } from "../pieces/pieces";
import { PlayerTemplate } from "../types/playersTypes";

class Player implements PlayerTemplate {
    readonly id: PlayerIdType;
    activePieces:ActivePieces;
    isThereTurn: boolean;
    hasMoved: boolean = false;
    unavailablePieces: PieceTemplate[] = [];
    constructor(id:PlayerIdType, isThereTurn: boolean, activePieces: ActivePieces) {
        this.activePieces = activePieces;
        this.isThereTurn = isThereTurn;
        this.id = id;
    }
    addNewQueen(columnId: ColumnIds, rowId: RowIds): PieceTemplate {
        const newPiece = createNewPiece(this.id, PieceNames.QUEEN, rowId, columnId);
        newPiece && this.activePieces.queens.push(newPiece);
        return newPiece;
    }
    addNewRook(columnId: ColumnIds, rowId: RowIds): PieceTemplate {
        const newPiece = createNewPiece(this.id, PieceNames.ROOK, rowId, columnId);
        newPiece && this.activePieces.rooks.push(newPiece);
        return newPiece;
    }
    addNewBishop(columnId: ColumnIds, rowId: RowIds): PieceTemplate {
        const newPiece = createNewPiece(this.id, PieceNames.BISHOP, rowId, columnId);
        newPiece && this.activePieces.bishops.push(newPiece);
        return newPiece;
    }
    addNewKnight(columnId: ColumnIds, rowId: RowIds): PieceTemplate {
        const newPiece = createNewPiece(this.id, PieceNames.KNIGHT, rowId, columnId);
        newPiece && this.activePieces.knights.push(newPiece);
        return newPiece;
    }
    removePawn(tileId: TileIdsType) {
        const pawnToRemoveIndex = this.activePieces.pawns.findIndex(pawn => pawn.getCurrentPosition() === tileId)
        this.activePieces.pawns.splice(pawnToRemoveIndex,1)
    }
    setIsThereTurn(value: boolean) {
        this.isThereTurn = value;
    }
    getIsThereTurn(): boolean {
        return this.isThereTurn;
    }
    setUnavailablePieces(value: PieceTemplate) {
        this.unavailablePieces.push(value);
    }
    getUnavailablePieces(): PieceTemplate[] {
        return this.unavailablePieces;
    }
}

const player1 = new Player(1, false, player1ActivePieces);

const player2 = new Player(2, true, player2ActivePieces);

export function getPlayerById(playerId: PlayerIdType): PlayerTemplate {
    switch (playerId) {
        case 1:
            return player1;
        default:
            return player2;
    }
}

export function getOppositionPlayer(playerId: PlayerIdType): PlayerTemplate {
    switch (playerId) {
        case 1:
            return player2;
        default:
            return player1;
    }
}

export function getPlayersTurn (): PlayerTemplate {
    if(player1.getIsThereTurn()) return player1
    return player2
}