import { TileIdsType, ColumnIds, RowIds, BoardPosition } from "./boardTypes";

export type PlayerIdType = 1 | 2;

export interface Movesets {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    upLeft: boolean;
    upRight: boolean;
    downLeft: boolean;
    downRight: boolean;
}

export type MovementType = "up" | "down" | "left"
| "right" | "upLeft" | "upRight" | "downLeft" | "downRight";

export enum PieceNames {
    PAWN = "pawn",
    KNIGHT = "knight",
    ROOK = "rook",
    BISHOP = "bishop",
    QUEEN = "queen",
    KING = "king",
};

export interface PieceType {
    name: PieceNames,
    symbolCharacter: string,
    maxMovements: number;
    moveset: Movesets,
};


export interface PieceTemplate {
    readonly symbol: string;
    readonly playerId: PlayerIdType;
    readonly type: PieceType;
    selected: boolean;
    readonly startingPosition: TileIdsType;
    currentColumnPosition: ColumnIds;
    currentRowPosition: RowIds;
    getCurrentPosition: () =>TileIdsType; 
    getAvailableMoves: () => TileIdsType[];
    getSymbol: () => string;
    setSelected: (value: boolean) => void;
    getSelectedStatus (): boolean;
    setCurrentPosition: (boardPosition: BoardPosition) => void;
}


export interface ActivePieces {
    pawns: PieceTemplate[],
    rooks: PieceTemplate[],
    bishops: PieceTemplate[],
    knights: PieceTemplate[],
    queens:PieceTemplate[],
    king: PieceTemplate[]
}
