import { addTemporaryRemovedPiece, getOppositionPlayersPossibleCheckmatePositions, removePieceOnCheckmate } from "../players/playerHelperFunction";
import { getPlayerById } from "../players/players";
import { BoardPosition, ColumnIds, ColumnIndexsArrayType, RowIds, RowIndexsArrayType, TileIdsType } from "../types/boardTypes";
import { ActivePowerPieceKeys, PieceNames, PieceTemplate, PlayerIdType } from "../types/pieceTypes";

export function getColumnIndexArray(): ColumnIndexsArrayType {
    return ["a","b","c", "d","e","f","g", "h"];
}
export function getRowIndexArray(): RowIndexsArrayType {
    return ["8","7","6", "5","4","3","2", "1"];
}

export function separateId(id: TileIdsType): BoardPosition {
    const splitIndex = id.length / 2;
    const columnId = id.slice(0, splitIndex);
    const rowId = id.slice(splitIndex, id.length);
    return {
        columnId: columnId as ColumnIds,
        rowId: rowId as RowIds
    }
}

export function isInCheckmate(playerId: PlayerIdType): boolean {
    const player = getPlayerById(playerId);
    const [king] = player.activePieces.king
    const oppositionPossiblePositions = getOppositionPlayersPossibleCheckmatePositions(playerId);
    return oppositionPossiblePositions.includes(king.getCurrentPosition())
}

export function createNewRowId (rowId: RowIds, offSetBy: number): RowIds | null {
    let rowIdNumber = parseInt(rowId); 
    if((rowIdNumber + offSetBy) > getRowIndexArray().length || (rowIdNumber + offSetBy ) < 1) return null;
   
    rowIdNumber += offSetBy;
    return rowIdNumber.toString() as RowIds;
}

export function createNewColumnId (columnId: ColumnIds, offSetBy: number): ColumnIds | null {
    let columnIdIndex = getColumnIndexArray().indexOf(columnId);
    if ((columnIdIndex +  offSetBy) < 0 || (columnIdIndex +  offSetBy) >= getColumnIndexArray().length) return null;    
    columnIdIndex += offSetBy;
    return getColumnIndexArray()[columnIdIndex] as ColumnIds;
}

function validateColumnId(columnId: ColumnIds) {
    return getColumnIndexArray().includes(columnId);
}

function validateRowId(rowId: RowIds) {
    return getRowIndexArray().includes(rowId);
}

export function createNewTileId(columnId: ColumnIds, rowId: RowIds): TileIdsType | null {
    if(validateColumnId(columnId) && validateRowId(rowId)) return `${columnId}${rowId}` as TileIdsType;
    return null
}

export function setNewPosition(choosenPiece: PieceTemplate, tile: HTMLDivElement, previousTileElement: HTMLDivElement): boolean {
    choosenPiece.setCurrentPosition(separateId(tile.id as TileIdsType));
    const isOppositionPieceOnTile = removePieceOnCheckmate(choosenPiece.playerId, tile.id as  TileIdsType)
    const checkmate = isInCheckmate(choosenPiece.playerId)
    isOppositionPieceOnTile && addTemporaryRemovedPiece(isOppositionPieceOnTile.piece, isOppositionPieceOnTile.pieceLocation)
    if(!checkmate) {
        if(!choosenPiece.hasMoved) choosenPiece.hasMoved = true; 
        previousTileElement.innerHTML = "X";
        tile.innerHTML = choosenPiece.getSymbol();  
        choosenPiece.getSelectedStatus() && choosenPiece.setSelected(!choosenPiece.getSelectedStatus());
        return true
    }
    choosenPiece.setCurrentPosition(separateId(previousTileElement.id as TileIdsType));
    return false;
}

export function updateTileColour(tile: HTMLDivElement, colour: string) {
    tile.style.backgroundColor = colour;
}

export function updateSelectedTilesColour(tileElement: HTMLDivElement, selectedPieceStatus: boolean, selectedPiecePreviousTileColour: string): string | void {
    const selectedPieceTileColour = "red";
    if(selectedPieceStatus) {
        const tilesColour =  window.getComputedStyle(tileElement).backgroundColor;
         updateTileColour(tileElement, selectedPieceTileColour)
        return tilesColour;
    } else {
        updateTileColour(tileElement, selectedPiecePreviousTileColour)
    }
}

export function validPawnPromotion(piece: PieceTemplate): boolean {
    if(!(piece.type.name === PieceNames.PAWN)) return false;
    switch (piece.playerId) {
        case 1:
            if(piece.currentRowPosition === "1") return true
            break;
        case 2:
            if(piece.currentRowPosition === "8") return true
            break;
    }
    return false
}

function setKingAndRooksPosition(king:PieceTemplate, rook: PieceTemplate, previousTileElement: HTMLDivElement,
     newTileElement: HTMLDivElement, rooksNewTileId: TileIdsType) {
    const rooksNewTileElement = document.getElementById(rooksNewTileId) as HTMLDivElement;
    const rooksCurrentPosition = rook.getCurrentPosition();
    const rooksCurrentTileElement = document.getElementById(rooksCurrentPosition);
    king.setCurrentPosition(separateId(newTileElement.id as TileIdsType));
    rook.setCurrentPosition(separateId(rooksNewTileElement.id as TileIdsType))
    const checkmate = isInCheckmate(king.playerId)
    if(!checkmate && rooksCurrentTileElement && rooksNewTileElement) {
        king.hasMoved = true; 
        rook.hasMoved = true;
        previousTileElement.innerHTML = "X";
        rooksCurrentTileElement.innerHTML = "X"
        newTileElement.innerHTML = king.getSymbol();
        rooksNewTileElement.innerHTML = rook.getSymbol();  
        king.getSelectedStatus() && king.setSelected(!king.getSelectedStatus());
        return true
    } else {
        king.setCurrentPosition(separateId(previousTileElement.id as TileIdsType));
        rook.setCurrentPosition(separateId(rooksCurrentPosition))
    }
    return false;
}

export function moveRookandKing (id: TileIdsType, king: PieceTemplate, kingsNewElement: HTMLDivElement, previousTileElement: HTMLDivElement): boolean {
    const player = getPlayerById(king.playerId)
    const {columnId, rowId} = separateId(id);
    const columnIdIndexArray = getColumnIndexArray();
    const indexOfColumnId = columnIdIndexArray.indexOf(columnId)
    const indexOfKingsColumnId = columnIdIndexArray.indexOf(king.currentColumnPosition);
    let rookToMove: PieceTemplate | undefined;
    let rooksNewColumnId: ColumnIds | null = null;
    if((indexOfKingsColumnId + 2) === indexOfColumnId) {
        rookToMove = player.activePieces.rooks.find(rook => {
            const columnIdIndexOfRook = columnIdIndexArray.indexOf(rook.currentColumnPosition);
            return !rook.hasMoved && columnIdIndexOfRook > indexOfColumnId; 
        })
        rooksNewColumnId = rookToMove? createNewColumnId(columnId, -1) : null;
    } 
    if ((indexOfKingsColumnId - 2) === indexOfColumnId) {
        rookToMove = player.activePieces.rooks.find(rook => {
            const columnIdIndexOfRook = columnIdIndexArray.indexOf(rook.currentColumnPosition);
            return !rook.hasMoved && columnIdIndexOfRook < indexOfColumnId; 
        })
        rooksNewColumnId = rookToMove? createNewColumnId(columnId, 1) : null;

    };
    if (rooksNewColumnId && rookToMove) {
        const rooksNewTileId = createNewTileId(rooksNewColumnId, rowId)
        const hasSetKingsPosition = rooksNewTileId && setKingAndRooksPosition(king, rookToMove, previousTileElement, kingsNewElement, rooksNewTileId)
        if(hasSetKingsPosition) return true;
    }
    return false;
}

export function gameOver(playerId: PlayerIdType) {
    const player = getPlayerById(playerId);
    let endGame = true;
    for (const pieces in player.activePieces) {
        // eslint-disable-next-line no-loop-func
        player.activePieces[pieces as ActivePowerPieceKeys].every(piece => {
            const i = piece.getAvailableMoves()
            return i
        .every(potentialPosition => {
            const piecesCurrentPosition = piece.getCurrentPosition();
            piece.setCurrentPosition(separateId(potentialPosition as TileIdsType))
            const oppositionPieceOnTile = removePieceOnCheckmate(piece.playerId, potentialPosition)
            const checkmate = isInCheckmate(player.id)
            piece.setCurrentPosition(separateId(piecesCurrentPosition))
            oppositionPieceOnTile && addTemporaryRemovedPiece(oppositionPieceOnTile.piece, oppositionPieceOnTile.pieceLocation);
            if(!checkmate) {
                endGame = false;
                return false;
            }
            return true;
        })})
        if(!endGame) {
            return false;
        }
    }
   //
    return endGame;
}