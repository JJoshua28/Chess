const ColumnIndexs =  {
    ColumnA: "a",
    ColumnB: "b",
    ColumnC: "c",
    ColumnD: "d",
    ColumnE: "e",
    ColumnF: "f",
    ColumnG: "g",
    ColumnH: "h"
} as const;

export type ColumnIds = typeof ColumnIndexs [keyof typeof ColumnIndexs];
export const RowIndexs = {
    Row1: "1",
    Row2: "2",
    Row3: "3",
    Row4: "4",
    Row5: "5",
    Row6: "6",
    Row7: "7",
    Row8: "8",
} as const;
export type RowIds = typeof RowIndexs [keyof typeof RowIndexs];

export type ColumnIndexsArrayType = ColumnIds[];
export type RowIndexsArrayType = RowIds[];

export type TileIdsType = `${ColumnIds}${RowIds}`;

export interface BoardPosition {
    columnId: ColumnIds;
    rowId: RowIds;
}
