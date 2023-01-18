import { ColumnIds, RowIds, TileIdsType } from "../types/boardTypes";
import {  getColumnIndexArray, separateId } from "../helperFunctions/helperFunction";
import { ActivePieceKeys, ActivePieces, ActivePowerPieceKeys, PawnTemplate, PieceNames, PieceTemplate, PlayerIdType } from "../types/pieceTypes";
import { createNewPiece, player1ActivePieces, player2ActivePieces } from "../pieces/pieces";
import { PieceLocation, PlayerTemplate } from "../types/playersTypes";

export class Player implements PlayerTemplate {
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

export const player1 = new Player(1, false, player1ActivePieces);

export const player2 = new Player(2, true, player2ActivePieces);

export function changeTurn (player: PlayerTemplate) {
    player.setIsThereTurn(!player.getIsThereTurn()); 
    player.id === 1? player2.setIsThereTurn(!player.getIsThereTurn()) : player1.setIsThereTurn(!player.getIsThereTurn());
    
}

export function displayPawns(player: PlayerTemplate) {
    return player.activePieces.pawns.map(pawn => {
        return pawn.getSymbol();
    }) 
}

export function getPlayerById(playerId: PlayerIdType): PlayerTemplate {
    const player = player1.id === playerId? player1 : player2;
    return player;
}

export function getOppositionPlayer(playerId: PlayerIdType): PlayerTemplate {
    const player = player1.id === playerId? player2 : player1;
    return player;
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

export function getPlayersPiecePositions(id: PlayerIdType): TileIdsType[] {
    const player = player1.id === id? player1 : player2;
    const allPositions: TileIdsType[] = []; 
    for (const pieces in player.activePieces) {
        const pieceArray =  player.activePieces[pieces as keyof typeof player.activePieces];
        pieceArray.forEach(piece => allPositions.push(piece.getCurrentPosition()))
    }
    return allPositions;
}

export function getPlayersNewPiecePositions(playerId: PlayerIdType, pieceCurrentPosition: TileIdsType, pieceNewPosition: TileIdsType) {
    const playersCurrentPosition = getPlayersPiecePositions(playerId)
    const indexOfCurrentPiecePosition = playersCurrentPosition.indexOf(pieceCurrentPosition);
    playersCurrentPosition.splice(indexOfCurrentPiecePosition,1);
    playersCurrentPosition.push(pieceNewPosition);

}

function getOppositionPlayersPossibleCheckmatePositions(playerId: PlayerIdType) {
    const player = player1.id === playerId? player2 : player1;
    const allPositions: TileIdsType[] = []; 
    for (const pieces in player.activePieces) {
        const pieceArray =  player.activePieces[pieces as keyof typeof player.activePieces];
        pieceArray.forEach(piece => piece.getAvailableMoves()
        .forEach(move => !allPositions.includes(move) && allPositions.push(move)))
    }
    return allPositions;
}

export function isInCheckmate(playerId: PlayerIdType): boolean {
    const player = getPlayerById(playerId);
    const [king] = player.activePieces.king
    const oppositionPossiblePositions = getOppositionPlayersPossibleCheckmatePositions(playerId);
    return oppositionPossiblePositions.includes(king.getCurrentPosition())
}


export function getOppositionPlayersPiecePosition(id: PlayerIdType): TileIdsType[] {
    const oppositionId = player1.id === id? player2.id : player1.id;
    return getPlayersPiecePositions(oppositionId);
}

export function removePieceOnCheckmate(playerId: PlayerIdType, potentialPosition: TileIdsType): 
{piece: PieceTemplate,
pieceLocation: PieceLocation
} | null {
    let removedPiece:  PieceTemplate | null = null;
    const oppositionPlayer = getOppositionPlayer(playerId);
    const oppositionPieceOnTile = indexOfOppositionPieceOnTile(playerId,potentialPosition);
    if(oppositionPieceOnTile){
        const {key, index} = oppositionPieceOnTile;
        removedPiece = oppositionPlayer.activePieces[key].splice(index,1).pop() || null;
        if (removedPiece) return {piece: removedPiece, pieceLocation: oppositionPieceOnTile}
    }
    return null;
}

export function addTemporaryRemovedPiece(piece: PieceTemplate| PawnTemplate, pieceLocation: PieceLocation) {
    const player = getPlayerById(piece.playerId)
    player.activePieces[pieceLocation.key as ActivePowerPieceKeys].push(piece);
}

export function gameOver(playerId: PlayerIdType) {
    const player = getPlayerById(playerId);
    let endGame = true;
    for (const pieces in player.activePieces) {
        // eslint-disable-next-line no-loop-func
        const test = player.activePieces[pieces as ActivePowerPieceKeys].every(piece => {
            const i = piece.getAvailableMoves()
            return i
        .every(potentialPosition => {
            const piecesCurrentPosition = piece.getCurrentPosition();
            piece.setCurrentPosition(separateId(potentialPosition as TileIdsType))
            const oppositionPieceOnTile = removePieceOnCheckmate(piece.playerId, potentialPosition)
            const checkmate = isInCheckmate(player.id)
            const validPosition = piece.getCurrentPosition();
            piece.setCurrentPosition(separateId(piecesCurrentPosition))
            oppositionPieceOnTile && addTemporaryRemovedPiece(oppositionPieceOnTile.piece, oppositionPieceOnTile.pieceLocation);
            if(!checkmate) {
                console.log(piece)
                console.log(i)
                console.log(validPosition)
                endGame = false;
                return false;
            }
            return true;
        })})
        console.log(test);
        if(!endGame) {
            return false;
        }
    }
   //
    return endGame;
}
export function hasNotSelectedMulitplePieces(player: PlayerTemplate, tileId: TileIdsType): boolean {
    let hasNotPreviouslySelectedAPiece: boolean = true;
    for (const pieces in player.activePieces) {
        hasNotPreviouslySelectedAPiece = player.activePieces[pieces as keyof typeof player.activePieces]
        .every(piece => piece.getSelectedStatus() === false || piece.getCurrentPosition() === tileId);
        if(!hasNotPreviouslySelectedAPiece) return hasNotPreviouslySelectedAPiece; 
    }
    return hasNotPreviouslySelectedAPiece;
}

export function indexOfOppositionPieceOnTile(playerId: PlayerIdType, tileId: TileIdsType): PieceLocation | null {
    const oppositionPlayer = getOppositionPlayer(playerId);
    for (const pieces in oppositionPlayer.activePieces) {
        const pieceArray =  oppositionPlayer.activePieces[pieces as keyof typeof oppositionPlayer.activePieces];
        const pieceIndex = pieceArray.findIndex((piece) => piece.getCurrentPosition() === tileId); 
        if(pieceIndex >= 0) return {key: pieces as ActivePieceKeys, index: pieceIndex}
    }
    return null;
}

export function disablePlayerTurn(player: PlayerTemplate): void{
    player.setIsThereTurn(false);
}

export function getPlayersTurn (): PlayerTemplate {
    if(player1.getIsThereTurn()) return player1
    return player2
}

export function removeOppositionPiece(playerId: PlayerIdType, pieceLocation: PieceLocation) {
    const oppositionPlayer = getOppositionPlayer(playerId);
    const {key, index} = pieceLocation;
    const [removedPiece] = oppositionPlayer.activePieces[key].splice(index,1)
    oppositionPlayer.setUnavailablePieces(removedPiece);
}