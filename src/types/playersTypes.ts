import { ColumnIds, RowIds, TileIdsType } from "./boardTypes";
import { ActivePieceKeys, ActivePieces, PieceTemplate, PlayerIdType } from "./pieceTypes";


export interface PlayerTemplate {
    readonly id: PlayerIdType
    activePieces:ActivePieces;
    isThereTurn: boolean;
    hasMoved: boolean;
    unavailablePieces: PieceTemplate[];
    setIsThereTurn: (value: boolean) => void 
    getIsThereTurn:() => boolean
    setUnavailablePieces: (value: PieceTemplate)  => void
    getUnavailablePieces: () => PieceTemplate[]
    addNewQueen: (columnId: ColumnIds, rowId: RowIds) => PieceTemplate
    addNewRook: (columnId: ColumnIds, rowId: RowIds) => PieceTemplate 
    addNewBishop: (columnId: ColumnIds, rowId: RowIds) => PieceTemplate 
    addNewKnight: (columnId: ColumnIds, rowId: RowIds) => PieceTemplate 
    removePawn: (tileId: TileIdsType) => void 
};

export interface PieceLocation {
    index: number;
    key: ActivePieceKeys;
}