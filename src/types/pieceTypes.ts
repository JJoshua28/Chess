import { TileIdsType, ColumnIds, RowIds, BoardPosition } from "./boardTypes";

export type PlayerIdType = 1 | 2;

export const colouredPieceSymbol = {
    pawn: "o",
    rook: "t",
    knight: "j",
    bishop: "n",
    queen: "w",
    king: "l",
} as const;

export const translucentPieceSymbol = {
    pawn: "p",
    rook: "r",
    knight: "h",
    bishop: "b",
    queen: "q",
    king: "k",
} as const;

export type PiecesSymbolsObjectType = typeof translucentPieceSymbol | typeof colouredPieceSymbol;

type TranslucentPieceSymbolsType = typeof translucentPieceSymbol[keyof typeof translucentPieceSymbol];

type ColouredSymbolsType = typeof colouredPieceSymbol[keyof typeof colouredPieceSymbol];

export type PieceSymbolType = ColouredSymbolsType | TranslucentPieceSymbolsType;

export enum PieceNames {
    PAWN = "pawn",
    KNIGHT = "knight",
    ROOK = "rook",
    BISHOP = "bishop",
    QUEEN = "queen",
    KING = "king",
};

export interface PlayerPieceDetails {
    playerId: PlayerIdType,
    pieceColour: "White" | "Black",
    piecesSymbols: PiecesSymbolsObjectType
}

export interface PieceDetail {
    name: PieceNames,
    symbol:PieceSymbolType,
}

interface Movesets {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    upLeft: boolean;
    upRight: boolean;
    downLeft: boolean;
    downRight: boolean;
}

interface CastlingRookPosition {
    currentTileId: TileIdsType,
    potentialTileId: TileIdsType,
}
export interface CastlingTileIds {
    rookTileIds: CastlingRookPosition,
    potentialKingTileId: TileIdsType,
}

export type MovementType = "up" | "down" | "left"
| "right" | "upLeft" | "upRight" | "downLeft" | "downRight";

export interface PieceType {
    name: PieceNames,
    maxMovements: number;
    moveset: Movesets,
};


export interface PieceTemplate {
    readonly symbol: string;
    readonly playerId: PlayerIdType;
    readonly type: PieceType;
    hasMoved:boolean;
    selected: boolean;
    readonly startingPosition: TileIdsType;
    currentColumnPosition: ColumnIds;
    currentRowPosition: RowIds;
    getCurrentPosition: () =>TileIdsType; 
    getAvailableMoves: () => TileIdsType[];
    getSymbol: () => PieceSymbolType;
    setSelected: (value: boolean) => void;
    getSelectedStatus (): boolean;
    setCurrentPosition: (boardPosition: BoardPosition) => void;
}

export interface PawnTemplate extends PieceTemplate  {
    canMoveTwoSpaces: (movement: MovementType) => boolean;
    validMove: (potentialTileID: TileIdsType, movement: MovementType, movementDuration: 1 | 2) => boolean
}

export type ActivePieceKeys = "pawns" | "rooks" | "bishops" | "knights" | "queens" | "king";

export type ActivePowerPieceKeys = "rooks" | "bishops" | "knights" | "queens" | "king";

export type PawnPromotionPieceKeys = "rooks" | "bishops" | "knights" | "queens";

export interface ActivePieces {
    pawns: PawnTemplate[],
    rooks: PieceTemplate[],
    bishops: PieceTemplate[],
    knights: PieceTemplate[],
    queens:PieceTemplate[],
    king: PieceTemplate[]
}



const player1sPieceDetails: PlayerPieceDetails = {
    playerId: 1,
    pieceColour: "Black",
    piecesSymbols: colouredPieceSymbol,
}

const player2sPieceDetails: PlayerPieceDetails = {
    playerId: 2,
    pieceColour: "White",
    piecesSymbols: translucentPieceSymbol,
}

export function returnPlayersPieceDetails(playerId: PlayerIdType): PlayerPieceDetails {
    switch (playerId) {
        case 1:
            return player1sPieceDetails;
        default:
            return player2sPieceDetails;
    }

}