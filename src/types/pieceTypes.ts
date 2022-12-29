import { TileIdsType, ColumnIds, RowIds, BoardPosition } from "./boardTypes";

export type PlayerIdType = 1 | 2;

export enum PieceSymbol {
    PAWN = "o",
    ROOK = "t",
    KNIGHT = "j",
    BISHOP = "n",
    QUEEN = "w",
    KING = "l"
};

export enum TranslucentPieceSymbol {
    PAWN = "p",
    ROOK = "r",
    KNIGHT = "h",
    BISHOP = "b",
    QUEEN = "q",
    KING = "k"
}

export enum PieceNames {
    PAWN = "pawn",
    KNIGHT = "knight",
    ROOK = "rook",
    BISHOP = "bishop",
    QUEEN = "queen",
    KING = "king",
};

export interface PieceDetail {
    name: PieceNames;
    symbol:PieceSymbol;
}

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

export interface PieceType {
    name: PieceNames,
    symbolCharacter: PieceSymbol | TranslucentPieceSymbol,
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

export type ActivePieceKeys = "pawns" | "rooks" | "bishops" | "knights" | "queens" | "king";

export interface ActivePieces {
    pawns: PieceTemplate[],
    rooks: PieceTemplate[],
    bishops: PieceTemplate[],
    knights: PieceTemplate[],
    queens:PieceTemplate[],
    king: PieceTemplate[]
}

