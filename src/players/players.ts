import { returnPlayerActivePieces } from "../pieces/pieces";
import { ActivePieces,  PieceTemplate, PlayerIdType } from "../types/pieceTypes";
import { PlayerTemplate } from "../types/playersTypes";

const player1ActivePieces = returnPlayerActivePieces(1, "8", "7");

const player2ActivePieces = returnPlayerActivePieces(2, "1", "2");

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