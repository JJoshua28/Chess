import { ColumnIds, RowIds, BoardPosition } from "./boardTypes";

export interface PositionBlueprint {
    columnId: ColumnIds;
    rowId: RowIds;
    moveUp: () => RowIds | null;
    moveDown: () => RowIds | null;
    moveLeft: () =>  ColumnIds | null;
    moveRight: () =>  ColumnIds | null;
    moveUpLeft: () =>  BoardPosition | null;
    moveDownLeft: () =>  BoardPosition | null;
    moveUpRight: () =>  BoardPosition | null;
    moveDownRight: () =>  BoardPosition | null;
}

export interface  KnightPositionBlueprint {
    columnId: ColumnIds;
    rowId: RowIds;
    moveUpLeft: () =>  BoardPosition[] | null;
    moveDownLeft: () =>  BoardPosition[] | null;
    moveUpRight: () =>  BoardPosition[] | null;
    moveDownRight: () =>  BoardPosition[] | null;
}

export type OffsetKnightIdBy = 1 | -1 | 2 | -2;
