import { BoardPosition, ColumnIds, ColumnIndexsArrayType, RowIds, RowIndexsArrayType, TileIdsType } from "../types/boardTypes";
import { PieceTemplate } from "../types/pieceTypes";

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

export function createNewRowId (rowId: RowIds, increaseRowId: boolean): RowIds | null {
    let rowIdNumber = parseInt(rowId); 
    if((rowIdNumber >= getRowIndexArray().length && increaseRowId) || (rowIdNumber <= 0 && !increaseRowId)) return null;
   
    increaseRowId && rowIdNumber++;
    !increaseRowId && rowIdNumber--;
    return rowIdNumber.toString() as RowIds;
}

export function createNewColumnId (columnId: ColumnIds, increaseColumnId: boolean): ColumnIds | null {
    let columnIdIndex = getColumnIndexArray().indexOf(columnId);
    if ((columnIdIndex <= 0 && !increaseColumnId) || (columnIdIndex >= getColumnIndexArray().length && increaseColumnId)) return null;    
    increaseColumnId && columnIdIndex++;
    !increaseColumnId && columnIdIndex--;
    return getColumnIndexArray()[columnIdIndex] as ColumnIds;
}

export function setNewPosition(choosenPiece: PieceTemplate, tile: HTMLDivElement) {
    const currentPosition = choosenPiece.getCurrentPosition();
    const piecesCurrentTile: HTMLDivElement = document.getElementById(currentPosition) as HTMLDivElement;
    piecesCurrentTile.innerHTML = "X";
    choosenPiece.setCurrentPosition(separateId(tile.id as TileIdsType));
    choosenPiece.setSelected(!choosenPiece.getSelectedStatus());
    (tile as HTMLDivElement).innerHTML = choosenPiece.getSymbol();
}

