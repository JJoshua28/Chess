import { getPlayerById } from "../players/players";
import { BoardPosition, ColumnIds, ColumnIndexsArrayType, RowIds, RowIndexsArrayType, TileIdsType } from "../types/boardTypes";
import { PieceNames, PieceTemplate } from "../types/pieceTypes";

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

export function setNewPosition(choosenPiece: PieceTemplate, tile: HTMLDivElement) {
    const currentPosition = choosenPiece.getCurrentPosition();
    const piecesCurrentTile: HTMLDivElement = document.getElementById(currentPosition) as HTMLDivElement;
    piecesCurrentTile.innerHTML = "X";
    choosenPiece.setCurrentPosition(separateId(tile.id as TileIdsType));
    choosenPiece.getSelectedStatus() && choosenPiece.setSelected(!choosenPiece.getSelectedStatus());
    tile.innerHTML = choosenPiece.getSymbol();
    if(!choosenPiece.hasMoved) choosenPiece.hasMoved = true;
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

export function moveRookandKing (id: TileIdsType, king: PieceTemplate, kingsNewElement: HTMLDivElement) {
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
        const rooksNewTileElement: HTMLDivElement | null = rooksNewTileId && document.getElementById(rooksNewTileId) as HTMLDivElement;
        if(rooksNewTileElement) {
            setNewPosition(rookToMove, rooksNewTileElement)
            setNewPosition(king, kingsNewElement)
        }
    }

}