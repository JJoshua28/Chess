import { RowIds, TileIdsType } from "../types/boardTypes";
import { getColumnIndexArray } from "../helperFunctions/helperFunction";
import { ActivePieces, PieceTemplate } from "../types/pieceTypes";
import { player1ActivePieces, player2ActivePieces } from "../pieces/pieces";
import { PlayerTemplate } from "../types/playersTypes";

export class Player {
    readonly id: number;
    activePieces:ActivePieces;
    isThereTurn: boolean;
    hasMoved: boolean = false;
    unavailablePieces: PieceTemplate[] = [];
    constructor(id:number, isThereTurn: boolean, activePieces: ActivePieces) {
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

export const player1 = new Player(1, true, player1ActivePieces);

export const player2 = new Player(2, false, player2ActivePieces);

export function changeTurn (player: PlayerTemplate) {
    player.setIsThereTurn(!player.getIsThereTurn()); 
    player.id === 1? player2.setIsThereTurn(!player.getIsThereTurn()) : player1.setIsThereTurn(!player.getIsThereTurn());
    
}

export function displayPawns(player: PlayerTemplate) {
    return player.activePieces.pawns.map(pawn => {
        return pawn.getSymbol();
    }) 
}

export function displayPieces (player: PlayerTemplate) {
    const piecesToDisplay: PieceTemplate[] = [];
    const rowID: RowIds = player.id === 1? "8" : "1"; 
    for (const columnID of getColumnIndexArray()) {
        for (const pieces in player.activePieces){
            const pieceToDisplay: PieceTemplate | undefined = player.activePieces[pieces as keyof typeof player.activePieces].find(piece => piece.getCurrentPosition() === `${columnID}${rowID}` as TileIdsType)
            pieceToDisplay && piecesToDisplay.push(pieceToDisplay);
        }
    }
    return piecesToDisplay.map(piece => piece.getSymbol());
}