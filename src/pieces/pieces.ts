/* eslint-disable @typescript-eslint/no-useless-constructor */

import { BoardPosition, ColumnIds, RowIds, TileIdsType, } from "../types/boardTypes";
import { getColumnIndexArray } from "../helperFunctions/helperFunction";
import { PieceType, PieceNames, PieceTemplate, ActivePieces, PlayerIdType, MovementType, PawnTemplate, PieceSymbolType, PiecesSymbolsObjectType } from "../types/pieceTypes";
import { knightMovementMapper, KnightPositions, movementMapper, Position } from "../position/position";
import { indexOfOppositionPieceOnTile, kingsCastlingIds } from "../players/playerHelperFunction";
import { returnPlayersPieceDetails } from "./piecesHelper";

abstract class Piece implements PieceTemplate {
    readonly symbol: PieceSymbolType;
    readonly playerId: PlayerIdType;
    abstract readonly type: PieceType;
    readonly startingPosition: TileIdsType;
    hasMoved: boolean;
    currentColumnPosition: ColumnIds;
    currentRowPosition: RowIds;
    selected: boolean = false;
    constructor(id: PlayerIdType, currentColumnPosition: ColumnIds, currentRowPosition: RowIds, symbol: PieceSymbolType, hasMoved = false) {
        this.playerId = id;
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
    getSymbol (): PieceSymbolType {
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

class Bishop extends Piece {
    readonly type = {
        name: PieceNames.BISHOP,
        maxMovements: 8, 
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
    constructor(id: PlayerIdType, currentColumnPosition: ColumnIds, currentRowPosition: RowIds, symbol: PieceSymbolType, hasMoved:boolean = false) {
        super(id, currentColumnPosition, currentRowPosition, symbol, hasMoved);
    }
}

class Rook extends Piece {
    readonly type = {
        name: PieceNames.ROOK,
        maxMovements: 8,
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
    constructor(id: PlayerIdType, currentColumnPosition: ColumnIds, currentRowPosition: RowIds, symbol: PieceSymbolType, hasMoved = false) {
        super(id, currentColumnPosition, currentRowPosition, symbol, hasMoved);
    }
}

class Queen extends Piece {
    readonly type = {
        name: PieceNames.QUEEN,
        maxMovements: 8,
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
    constructor(id: PlayerIdType, currentColumnPosition: ColumnIds, currentRowPosition: RowIds, symbol: PieceSymbolType, hasMoved = false) {
        super(id, currentColumnPosition, currentRowPosition, symbol, hasMoved);
    }
}

class Knight extends Piece {
    readonly type = {
        name: PieceNames.KNIGHT,
        maxMovements: 1,
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
    constructor(id: PlayerIdType, currentColumnPosition: ColumnIds, currentRowPosition: RowIds, symbol: PieceSymbolType, hasMoved = false) {
        super(id, currentColumnPosition, currentRowPosition, symbol, hasMoved);
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

class Pawn extends Piece implements PawnTemplate {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    readonly type = {
        name: PieceNames.PAWN,
        maxMovements: 1, 
        moveset: this.playerId === 1? {
            up: false,
            down: true,
            left: false,
            right: false,
            upLeft: false,
            upRight: false,
            downRight: true,
            downLeft: true,
        } : {
            up: true,
            down: false,
            left: false,
            right: false,
            upLeft: true,
            upRight: true,
            downRight: false,
            downLeft: false,
        } 
    }
    constructor(id: PlayerIdType, currentColumnPosition: ColumnIds, currentRowPosition: RowIds, symbol: PieceSymbolType) {
        super(id, currentColumnPosition, currentRowPosition, symbol);
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

class King extends Piece {
    readonly type = {
        name: PieceNames.KING,
        maxMovements: 1,
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
    constructor(id: PlayerIdType, currentColumnPosition: ColumnIds, currentRowPosition: RowIds, symbol: PieceSymbolType) {
        super(id, currentColumnPosition, currentRowPosition, symbol);
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
    const playerDetails = returnPlayersPieceDetails(playerId);
    return playerDetails.piecesSymbols;
}

function createPawnsArray(playerId: PlayerIdType, rowIndex: RowIds): Pawn[] {
    const pieceSymbolObject = playersPieceColour(playerId)
    return getColumnIndexArray().map((columnId: ColumnIds) => new Pawn(
        playerId,
        columnId, 
        rowIndex, 
        pieceSymbolObject.pawn)
    );
}

function createRooksArray(playerId: PlayerIdType, rowIndex: RowIds): Rook[] {
    const pieceSymbolObject = playersPieceColour(playerId)
    const rooksArray: Rook[] = [];
    rooksArray.push(new Rook(playerId, "a",rowIndex, pieceSymbolObject.rook));
    rooksArray.push(new Rook(playerId, "h", rowIndex, pieceSymbolObject.rook));
    return rooksArray;
}

function createKnightArray(playerId: PlayerIdType, rowIndex: RowIds): Knight[] {
    const pieceSymbolObject = playersPieceColour(playerId)
    const knightsArray: Knight[] = [];
    knightsArray.push(new Knight(playerId, "b",rowIndex, pieceSymbolObject.knight));
    knightsArray.push(new Knight(playerId, "g",rowIndex, pieceSymbolObject.knight));
    return knightsArray;
}

function createBishopArray(playerId: PlayerIdType, rowIndex: RowIds): Bishop[] {
    const pieceSymbolObject = playersPieceColour(playerId)
    const rooksArray: Bishop[] = [];
    rooksArray.push(new Bishop(playerId, "c",rowIndex, pieceSymbolObject.bishop));
    rooksArray.push(new Bishop(playerId, "f",rowIndex, pieceSymbolObject.bishop));
    return rooksArray;
}

function createQueenArray(playerId: PlayerIdType, rowIndex: RowIds): Queen[] {
    const pieceSymbolObject = playersPieceColour(playerId)
    return [new Queen(playerId, "d", rowIndex, pieceSymbolObject.queen)]
}

function createKingArray(playerId: PlayerIdType, rowIndex: RowIds): King[] {
    const pieceSymbolObject = playersPieceColour(playerId)
    return [new King(playerId, "e", rowIndex, pieceSymbolObject.king)]
}

function returnPlayerActivePieces (playerId: PlayerIdType, rowIndex: RowIds, pawnRowIndex:RowIds): ActivePieces {
    return {
        pawns: createPawnsArray(playerId, 
            pawnRowIndex),
        rooks: createRooksArray(playerId, rowIndex),
        bishops: createBishopArray(playerId, rowIndex),
        knights: createKnightArray(playerId, rowIndex),
        queens: createQueenArray(playerId, rowIndex),
        king: createKingArray(playerId, rowIndex)
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
            newPiece = new Queen(playerId, columnId, rowId, queenCharacter, true);
            break;
        case PieceNames.ROOK:
            newPiece = new Rook(playerId, columnId, rowId, rookCharacter, true);
            break;
        case PieceNames.BISHOP:
            newPiece = new Bishop(playerId, columnId, rowId, bishopCharacter, true);
            break;
        default:
            newPiece = new Knight(playerId, columnId, rowId, knightCharacter, true);
            break;
    }
    return newPiece;

}

export const player1ActivePieces = returnPlayerActivePieces(1, "8", "7");

export const player2ActivePieces = returnPlayerActivePieces(2, "1", "2");
