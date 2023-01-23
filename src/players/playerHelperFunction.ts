import { getColumnIndexArray } from "../helperFunctions/helperFunction";
import { RowIds, TileIdsType } from "../types/boardTypes";
import { ActivePieceKeys, ActivePowerPieceKeys, PawnTemplate, PieceTemplate, PlayerIdType } from "../types/pieceTypes";
import { PieceLocation } from "../types/playersTypes";
import { getOppositionPlayer, getPlayerById } from "./players";

export function displayPawns(playerId: PlayerIdType) {
   const player = getPlayerById(playerId)
    return player.activePieces.pawns.map(pawn => {
       return pawn.getSymbol();
   }) 
}

export function displayPieces (playerId: PlayerIdType) {
   const player = getPlayerById(playerId)
    const piecesToDisplay: PieceTemplate[] = [];
    const rowID: RowIds = playerId === 1? "8" : "1"; 
    for (const columnID of getColumnIndexArray()) {
        for (const pieces in player.activePieces){
            const pieceToDisplay: PieceTemplate | undefined = player.activePieces[pieces as keyof typeof player.activePieces].find(piece => piece.getCurrentPosition() === `${columnID}${rowID}` as TileIdsType)
            pieceToDisplay && piecesToDisplay.push(pieceToDisplay);
        }
    }
    return piecesToDisplay.map(piece => piece.getSymbol());
}

export function changeTurn (playerId: PlayerIdType) {
    const player = getPlayerById(playerId)
    player.setIsThereTurn(!player.getIsThereTurn());
    const oppositePlayer = getOppositionPlayer(playerId) 
    oppositePlayer.setIsThereTurn(!player.getIsThereTurn());
}

export function getPlayersPiecePositions(id: PlayerIdType): TileIdsType[] {
    const player = getPlayerById(id)
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

export function getOppositionPlayersPossibleCheckmatePositions(playerId: PlayerIdType) {
    const oppositionPlayer = getOppositionPlayer(playerId);
    const allPositions: TileIdsType[] = []; 
    for (const pieces in oppositionPlayer.activePieces) {
        const pieceArray =  oppositionPlayer.activePieces[pieces as keyof typeof oppositionPlayer.activePieces];
        pieceArray.forEach(piece => piece.getAvailableMoves()
        .forEach(move => !allPositions.includes(move) && allPositions.push(move)))
    }
    return allPositions;
}

export function getOppositionPlayersPiecePosition(playerId: PlayerIdType): TileIdsType[] {
    const {id} = getOppositionPlayer(playerId);
    return getPlayersPiecePositions(id);
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

export function removePieceOnCheckmate(playerId: PlayerIdType, potentialPosition: TileIdsType): 
{piece: PieceTemplate,
pieceLocation: PieceLocation
} | null {
    let removedPiece:  PieceTemplate | undefined;
    const oppositionPlayer = getOppositionPlayer(playerId);
    const oppositionPieceOnTile = indexOfOppositionPieceOnTile(playerId,potentialPosition);
    if(oppositionPieceOnTile){
        const {key, index} = oppositionPieceOnTile;
        removedPiece = oppositionPlayer.activePieces[key].splice(index,1).pop();
        if (removedPiece) return {piece: removedPiece, pieceLocation: oppositionPieceOnTile}
    }
    return null;
}

export function addTemporaryRemovedPiece(piece: PieceTemplate| PawnTemplate, pieceLocation: PieceLocation) {
    const player = getPlayerById(piece.playerId)
    player.activePieces[pieceLocation.key as ActivePowerPieceKeys].push(piece);
}

export function hasNotSelectedMulitplePieces(playerId: PlayerIdType, tileId: TileIdsType): boolean {
    const player = getPlayerById(playerId)
    let hasNotPreviouslySelectedAPiece: boolean = true;
    for (const pieces in player.activePieces) {
        hasNotPreviouslySelectedAPiece = player.activePieces[pieces as keyof typeof player.activePieces]
        .every(piece => piece.getSelectedStatus() === false || piece.getCurrentPosition() === tileId);
        if(!hasNotPreviouslySelectedAPiece) return hasNotPreviouslySelectedAPiece; 
    }
    return hasNotPreviouslySelectedAPiece;
}

export function disablePlayerTurn(playerId: PlayerIdType): void{
    const player = getPlayerById(playerId)
    player.setIsThereTurn(false);
}

export function removeOppositionPiece(playerId: PlayerIdType, pieceLocation: PieceLocation) {
    const oppositionPlayer = getOppositionPlayer(playerId);
    const {key, index} = pieceLocation;
    const [removedPiece] = oppositionPlayer.activePieces[key].splice(index,1)
    oppositionPlayer.setUnavailablePieces(removedPiece);
}