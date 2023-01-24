/* eslint-disable @typescript-eslint/no-useless-constructor */

import { BoardPosition, ColumnIds, RowIds, TileIdsType, } from "../types/boardTypes";
import { getColumnIndexArray } from "../helperFunctions/helperFunction";
import { PieceType, Movesets, PieceNames, PieceTemplate, ActivePieces, PlayerIdType, MovementType, PawnTemplate, colouredPieceSymbol, translucentPieceSymbol, PieceSymbolType, PiecesSymbolsObjectType } from "../types/pieceTypes";
import { knightMovementMapper, KnightPositions, movementMapper, Position } from "../position/position";
import { indexOfOppositionPieceOnTile, kingsCastlingIds } from "../players/playerHelperFunction";

function returnPawnType(moveUp: boolean, pieceDisplay: PieceSymbolType): PieceType {
    const movesetTemplate: Movesets = {
        up: false,
        down: false,
        left: false,
        right: false,
        upLeft: false,
        upRight: false,
        downRight: false,
        downLeft: false,
    }
    const moveset: Movesets = moveUp? {
        ...movesetTemplate,
        up: true,
        upLeft: true,
        upRight: true,
    } : {
        ...movesetTemplate,
        down: true,
        downLeft: true,
        downRight: true,
    }
    
    return {
        name: PieceNames.PAWN,
        symbolCharacter: pieceDisplay, 
        maxMovements: 1,
        moveset: moveset
    }
}

function returnRookType(pieceDisplay: PieceSymbolType): PieceType {
    return {
        name: PieceNames.ROOK,
        maxMovements: 8,
        symbolCharacter: pieceDisplay, 
        moveset: {
            up: true,
            down: true,
            left: true,
            right: true,
            upLeft: false,
            upRight: false,
            downRight: false,
            downLeft: false,
        }
    }

}

function returnKnightType(pieceDisplay: PieceSymbolType): PieceType {
    return {
        name: PieceNames.KNIGHT,
        maxMovements: 1,
        symbolCharacter: pieceDisplay, 
        moveset: {
            up: false,
            down: false,
            left: false,
            right: false,
            upLeft: true,
            upRight: true,
            downRight: true,
            downLeft: true,
        }
    }
}

function returnBishopType(pieceDisplay: PieceSymbolType): PieceType {
    return {
        name: PieceNames.BISHOP,
        maxMovements: 8,
        symbolCharacter: pieceDisplay, 
        moveset: {
            up: false,
            down: false,
            left: false,
            right: false,
            upLeft: true,
            upRight: true,
            downRight: true,
            downLeft: true,
        }
    }
}

function returnKingType(pieceDisplay: PieceSymbolType): PieceType {
    return {
        name: PieceNames.KING,
        maxMovements: 1,
        symbolCharacter: pieceDisplay, 
        moveset: {
            up: true,
            down: true,
            left: true,
            right: true,
            upLeft: true,
            upRight: true,
            downRight: true,
            downLeft: true,
        }
    }
}

function returnQueenType(pieceDisplay: PieceSymbolType): PieceType {
    return {
        name: PieceNames.QUEEN,
        maxMovements: 8,
        symbolCharacter: pieceDisplay, 
        moveset: {
            up: true,
            down: true,
            left: true,
            right: true,
            upLeft: true,
            upRight: true,
            downRight: true,
            downLeft: true,
        }
    }
}
class Piece implements PieceTemplate {
    readonly symbol: string
    readonly playerId: PlayerIdType;
    readonly type: PieceType;
    readonly startingPosition: TileIdsType;
    hasMoved: boolean;
    currentColumnPosition: ColumnIds;
    currentRowPosition: RowIds;
    selected: boolean = false;
    constructor(id: PlayerIdType, type: PieceType, currentColumnPosition: ColumnIds, currentRowPosition: RowIds, symbol: string, hasMoved = false) {
        this.playerId = id;
        this.type = type;
        this.currentColumnPosition = currentColumnPosition;
        this.currentRowPosition = currentRowPosition;
        this.startingPosition = `${this.currentColumnPosition}${this.currentRowPosition}` as TileIdsType;
        this.symbol = symbol;
        this.hasMoved = hasMoved;
    }
    getCurrentPosition(): TileIdsType {
        return `${this.currentColumnPosition}${this.currentRowPosition}` as TileIdsType;
    }
    setCurrentPosition(boardPosition: BoardPosition) {
        const {columnId, rowId} = boardPosition;
        this.currentColumnPosition = columnId;
        this.currentRowPosition = rowId; 
    }
    getSymbol (): string {
        return this.symbol;
    };
    setSelected (value: boolean) {
        this.selected = value;
    };
    getSelectedStatus (): boolean {
        return this.selected;
    };

    getAvailableMoves (): TileIdsType[] {
        const possibleMoves: TileIdsType[] = [];
        for (const movement in this.type.moveset) {
            const potentialPositions = new Position(this.currentColumnPosition, this.currentRowPosition) ;
            for(let moves: number = 0; moves < this.type.maxMovements; moves++) {
                if((this.type.moveset[movement as keyof typeof this.type.moveset])) {
                    const potentialTileID: TileIdsType | null = movementMapper(this, potentialPositions, movement as MovementType);
                    potentialTileID && possibleMoves.push(potentialTileID);
                }
            }
        }
        return possibleMoves;
    }   
}
 class Knight extends Piece {
    constructor(id: PlayerIdType, type: PieceType, currentColumnPosition: ColumnIds, currentRowPosition: RowIds, symbol: string, hasMoved = false) {
        super(id, type, currentColumnPosition, currentRowPosition, symbol, hasMoved);
    }
    getAvailableMoves (): TileIdsType[] {
        const possibleMoves: TileIdsType[] = [];
        for (const movement in this.type.moveset) {
            const potentialPositions = new KnightPositions(this.currentColumnPosition, this.currentRowPosition);
            for(let moves: number = 0; moves < this.type.maxMovements; moves++) {
                if((this.type.moveset[movement as keyof typeof this.type.moveset])) {
                    const knightMoves = knightMovementMapper(this.playerId, potentialPositions, movement as MovementType);
                    knightMoves && possibleMoves.push(...knightMoves);
                }
            }
        }
        return possibleMoves
    };
}

export class Pawn extends Piece implements PawnTemplate {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(id: PlayerIdType, type: PieceType, currentColumnPosition: ColumnIds, currentRowPosition: RowIds, symbol: string) {
        super(id, type, currentColumnPosition, currentRowPosition, symbol);
    }
    canMoveTwoSpaces (movement: MovementType): boolean {
        return (movement === "up" || movement === "down") && this.getCurrentPosition() === this.startingPosition;
    }
    validMove(potentialTileID: TileIdsType, movement: MovementType): boolean {
        switch(movement) {
            case "up":
            case "down":
                return !indexOfOppositionPieceOnTile(this.playerId, potentialTileID)
            case "upLeft":
            case "upRight":
            case "downLeft":
            case "downRight":
                return indexOfOppositionPieceOnTile(this.playerId, potentialTileID)? true : false;
        }
        return false;
    }
    getAvailableMoves(): TileIdsType[]{
        const possibleMoves: TileIdsType[] = [];
        for (const movement in this.type.moveset) {
            const movementDuration = this.canMoveTwoSpaces(movement as MovementType)? 2 : this.type.maxMovements;
            const potentialPositions = new Position(this.currentColumnPosition, this.currentRowPosition) ;
            for(let moves: number = 0; moves < movementDuration; moves++) {
                if((this.type.moveset[movement as MovementType])) {
                    const potentialTileID: TileIdsType | null = movementMapper(this, potentialPositions, movement as MovementType);
                    potentialTileID && this.validMove(potentialTileID, movement as MovementType) 
                    && possibleMoves.push(potentialTileID) 
                }
            }
        }
        return possibleMoves;
    };
}

export class King extends Piece {
    constructor(id: PlayerIdType, type: PieceType, currentColumnPosition: ColumnIds, currentRowPosition: RowIds, symbol: string) {
        super(id, type, currentColumnPosition, currentRowPosition, symbol);
    }
    getAvailableMoves (): TileIdsType[] {
        const possibleMoves: TileIdsType[] = [];
        for (const movement in this.type.moveset) {
            const potentialPositions = new Position(this.currentColumnPosition, this.currentRowPosition) ;
            for(let moves: number = 0; moves < this.type.maxMovements; moves++) {
                if((this.type.moveset[movement as keyof typeof this.type.moveset])) {
                    const potentialTileID: TileIdsType | null = movementMapper(this, potentialPositions, movement as MovementType);
                    potentialTileID && possibleMoves.push(potentialTileID);
                }
            }
        }
        const possibleCastlingMoves = kingsCastlingIds(this.playerId);
        possibleCastlingMoves.forEach(move => possibleMoves.push(move))
        return possibleMoves;
    }   
}

export function playersPieceColour (playerId: PlayerIdType): PiecesSymbolsObjectType {
    /*
        The function that returns a collection of chess pieces for one player, but their playerId will dictate the colour
        
        if the playerId is 1, that player will use the piece associated to the coloured object (black pieces).
        
        otherwise the player will use translucent pieces (white)
        
        (see the "return${pieceType}Type" functions at the top of the file to see how this is individually implemented)
        */
    switch(playerId) {
        case 1:
            return colouredPieceSymbol;
        default:
            return translucentPieceSymbol;
    }
}

function createPawnsArray(playerId: PlayerIdType, rowIndex: RowIds, pieceType: PieceType): Pawn[] {
    return getColumnIndexArray().map((columnId: ColumnIds) => new Pawn(
        playerId,
        pieceType, 
        columnId, 
        rowIndex, 
        pieceType.symbolCharacter)
    );
}

function createRooksArray(playerId: PlayerIdType, rowIndex: RowIds, pieceType: PieceType): Piece[] {
    const rooksArray: Piece[] = [];
    rooksArray.push(new Piece(playerId, pieceType, "a",rowIndex, pieceType.symbolCharacter));
    rooksArray.push(new Piece(playerId, pieceType, "h",rowIndex, pieceType.symbolCharacter));
    return rooksArray;
}

function createKnightArray(playerId: PlayerIdType, rowIndex: RowIds, pieceType: PieceType): Knight[] {
    const knightsArray: Knight[] = [];
    knightsArray.push(new Knight(playerId, pieceType, "b",rowIndex, pieceType.symbolCharacter));
    knightsArray.push(new Knight(playerId, pieceType, "g",rowIndex, pieceType.symbolCharacter));
    return knightsArray;
}

function createBishopArray(playerId: PlayerIdType, rowIndex: RowIds, pieceType: PieceType): Piece[] {
    const rooksArray: Piece[] = [];
    rooksArray.push(new Piece(playerId, pieceType, "c",rowIndex, pieceType.symbolCharacter));
    rooksArray.push(new Piece(playerId, pieceType, "f",rowIndex, pieceType.symbolCharacter));
    return rooksArray;
}

function createQueenArray(playerId: PlayerIdType, rowIndex: RowIds, pieceType: PieceType): Piece[] {
    return [new Piece(playerId, pieceType, "d", rowIndex, pieceType.symbolCharacter)]
}

function createKingArray(playerId: PlayerIdType, rowIndex: RowIds, pieceType: PieceType): Piece[] {
    return [new King(playerId, pieceType, "e", rowIndex, pieceType.symbolCharacter)]
}

function returnPlayerActivePieces (playerId: PlayerIdType, rowIndex: RowIds, pawnRowIndex:RowIds, pawnToMoveUP: boolean): ActivePieces {
    const {
        pawn: pawnCharacter,
        queen: queenCharacter,
        king: kingCharacter,
        rook: rookCharacter,
        knight: knightCharacter,
        bishop: bishopCharacter
    } = playersPieceColour(playerId);
    return {
        pawns: createPawnsArray(playerId, 
            pawnRowIndex, returnPawnType(pawnToMoveUP, pawnCharacter)
        ),
        rooks: createRooksArray(playerId, rowIndex, returnRookType(rookCharacter)),
        bishops: createBishopArray(playerId, rowIndex, returnBishopType(bishopCharacter)),
        knights: createKnightArray(playerId, rowIndex, returnKnightType(knightCharacter)),
        queens: createQueenArray(playerId, rowIndex, returnQueenType(queenCharacter)),
        king: createKingArray(playerId, rowIndex, returnKingType(kingCharacter))
    }
}

export function createNewPiece (playerId: PlayerIdType, name: PieceNames, rowId: RowIds, columnId: ColumnIds): PieceTemplate {
    const {
        queen: queenCharacter,
        rook: rookCharacter,
        knight: knightCharacter,
        bishop: bishopCharacter
    } = playersPieceColour(playerId);
    let newPiece: PieceTemplate;
    switch (name) {
        case PieceNames.QUEEN:
            const queenPieceType = returnQueenType(queenCharacter);
            newPiece = new Piece(playerId, queenPieceType, columnId, rowId, queenPieceType.symbolCharacter, true);
            break;
        case PieceNames.ROOK:
            const rookPieceType = returnRookType(rookCharacter);
            newPiece = new Piece(playerId, rookPieceType, columnId, rowId, rookPieceType.symbolCharacter, true);
            break;
        case PieceNames.BISHOP:
            const bishopPieceType = returnBishopType(bishopCharacter);
            newPiece = new Piece(playerId, bishopPieceType, columnId, rowId, bishopPieceType.symbolCharacter, true);
            break;
        default:
            const knightPieceType = returnKnightType(knightCharacter);
            newPiece = new Knight(playerId, knightPieceType, columnId, rowId, knightPieceType.symbolCharacter, true);
            break;
    }
    return newPiece;

}

export const player1ActivePieces = returnPlayerActivePieces(1, "8", "7", false);

export const player2ActivePieces = returnPlayerActivePieces(2, "1", "2", true);
