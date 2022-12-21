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

export function setNewPosition(choosenPiece: PieceTemplate, tile: HTMLDivElement) {
    console.log("I am for reallllll!")
    const currentPosition = choosenPiece.getCurrentPosition();
    const piecesCurrentTile: HTMLDivElement = document.getElementById(currentPosition) as HTMLDivElement;
    piecesCurrentTile.innerHTML = "X";
    choosenPiece.setCurrentPosition(separateId(tile.id as TileIdsType));
    choosenPiece.setSelected(!choosenPiece.getSelectedStatus());
    (tile as HTMLDivElement).innerHTML = choosenPiece.getSymbol();
}

