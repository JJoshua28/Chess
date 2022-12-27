/* eslint-disable @typescript-eslint/no-useless-constructor */

import { BoardPosition, ColumnIds, RowIds, TileIdsType, } from "../types/boardTypes";
import {getColumnIndexArray, } from "../helperFunctions/helperFunction";
import { PieceType, Movesets, PieceNames, PieceTemplate, ActivePieces, PlayerIdType, MovementType } from "../types/pieceTypes";
import { knightMovementMapper, KnightPositions, movementMapper, Position } from "../position/position";
import { indexOfOppositionPieceOnTile } from "../players/players";


function returnPawnType(moveUp: boolean, whitePawn: boolean): PieceType {
    const symbol: string = whitePawn? "p" : "o";
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
        up: true
    } : {
        ...movesetTemplate,
        down: true
    }
    
    return {
        name: PieceNames.PAWN,
        symbolCharacter: symbol, 
        maxMovements: 1,
        moveset: moveset
    }
}



//["r","h","b","q","k","b","h","r"]
function returnRookType(whitePiece: boolean): PieceType {
    const symbol = whitePiece? "r" : "t";
    return {
        name: PieceNames.ROOK,
        maxMovements: 8,
        symbolCharacter: symbol, 
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

function returnKnightType(whitePiece: boolean): PieceType {
    const symbol = whitePiece? "h" : "j";
    return {
        name: PieceNames.KNIGHT,
        maxMovements: 1,
        symbolCharacter: symbol, 
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


function returnBishopType(whitePiece: boolean): PieceType {
    const symbol = whitePiece? "b" : "n";
    return {
        name: PieceNames.BISHOP,
        maxMovements: 8,
        symbolCharacter: symbol, 
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

function returnKingType(whitePiece: boolean): PieceType {
    const symbol = whitePiece? "k" : "l";
    return {
        name: PieceNames.KING,
        maxMovements: 1,
        symbolCharacter: symbol, 
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

function returnQueenType(whitePiece: boolean): PieceType {
    const symbol = whitePiece? "q" : "w";
    return {
        name: PieceNames.QUEEN,
        maxMovements: 8,
        symbolCharacter: symbol, 
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

export class Piece implements PieceTemplate {
    readonly symbol: string
    readonly playerId: PlayerIdType;
    readonly type: PieceType;

    readonly startingPosition: TileIdsType;
    currentColumnPosition: ColumnIds;
    currentRowPosition: RowIds;
    selected: boolean = false;
    constructor(id: PlayerIdType, type: PieceType, currentColumnPosition: ColumnIds, currentRowPosition: RowIds, symbol: string) {
        this.playerId = id;
        this.type = type;
        this.currentColumnPosition = currentColumnPosition;
        this.currentRowPosition = currentRowPosition;
        this.startingPosition = `${this.currentColumnPosition}${this.currentRowPosition}` as TileIdsType;
        this.symbol = symbol;
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
    returnKnightPositions (): TileIdsType[] | null {
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
        return possibleMoves.length > 0? possibleMoves : null;
    };
    returnPiecePositions (): TileIdsType[] | null {
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
        return possibleMoves.length > 0? possibleMoves : null;
    }    
    getAvailableMoves(): TileIdsType[] {
        let availableMoves: TileIdsType[] = [];
        if(this.type.name === PieceNames.KNIGHT) {
            const knightPositions: TileIdsType[] | null = this.returnKnightPositions();
            if(knightPositions) {
                availableMoves = knightPositions;
                return availableMoves;
            }
        }
        const piecePositions: TileIdsType[] | null = this.returnPiecePositions();
        if(piecePositions) availableMoves = piecePositions;
        return availableMoves;
    }
        
    
}

export class Pawn extends Piece {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(id: PlayerIdType, type: PieceType, currentColumnPosition: ColumnIds, currentRowPosition: RowIds, symbol: string) {
        super(id, type, currentColumnPosition, currentRowPosition, symbol);
    }
    canMoveTwoSpaces (): boolean {
        return this.getCurrentPosition() === this.startingPosition;
    }
    returnPiecePositions(): TileIdsType[] | null{
        const possibleMoves: TileIdsType[] = [];
        const movementDuration = this.canMoveTwoSpaces()? 2 : this.type.maxMovements;
        for (const movement in this.type.moveset) {
            const potentialPositions = new Position(this.currentColumnPosition, this.currentRowPosition) ;
            for(let moves: number = 0; moves < movementDuration; moves++) {
                if((this.type.moveset[movement as keyof typeof this.type.moveset])) {
                    const potentialTileID: TileIdsType | null = movementMapper(this, potentialPositions, movement as MovementType);
                    if(movement === "up" || movement === "down") potentialTileID && !indexOfOppositionPieceOnTile(this.playerId, potentialTileID) &&possibleMoves.push(potentialTileID);
                }
            }
        }
        return possibleMoves.length > 0? possibleMoves : null;;
    };
}

function createPawnsArray(playerId: PlayerIdType, rowIndex: RowIds, pawnType: PieceType): Pawn[] {
    return getColumnIndexArray().map((columnId: ColumnIds) => new Pawn(
        playerId,
        pawnType, 
        columnId, 
        rowIndex, 
        pawnType.symbolCharacter)
    );
}

function createRooksArray(playerId: PlayerIdType, rowIndex: RowIds, pawnType: PieceType): Piece[] {
    const rooksArray: Piece[] = [];
    rooksArray.push(new Piece(playerId, pawnType, "a",rowIndex, pawnType.symbolCharacter));
    rooksArray.push(new Piece(playerId, pawnType, "h",rowIndex, pawnType.symbolCharacter));
    return rooksArray;
}

function createKnightArray(playerId: PlayerIdType, rowIndex: RowIds, pawnType: PieceType): Piece[] {
    const rooksArray: Piece[] = [];
    rooksArray.push(new Piece(playerId, pawnType, "b",rowIndex, pawnType.symbolCharacter));
    rooksArray.push(new Piece(playerId, pawnType, "g",rowIndex, pawnType.symbolCharacter));
    return rooksArray;
}

function createBishopArray(playerId: PlayerIdType, rowIndex: RowIds, pawnType: PieceType): Piece[] {
    const rooksArray: Piece[] = [];
    rooksArray.push(new Piece(playerId, pawnType, "c",rowIndex, pawnType.symbolCharacter));
    rooksArray.push(new Piece(playerId, pawnType, "f",rowIndex, pawnType.symbolCharacter));
    return rooksArray;
}

function createQueenArray(playerId: PlayerIdType, rowIndex: RowIds, pawnType: PieceType): Piece[] {
    return [new Piece(playerId, pawnType, "d", rowIndex, pawnType.symbolCharacter)]
}

function createKingArray(playerId: PlayerIdType, rowIndex: RowIds, pawnType: PieceType): Piece[] {
    return [new Piece(playerId, pawnType, "e", rowIndex, pawnType.symbolCharacter)]
}

function returnPlayerActivePieces (playerId: PlayerIdType, rowIndex: RowIds, pawnRowIndex:RowIds, pawnToMoveUP: boolean, useWhitePiece: boolean): ActivePieces {
    return {
        pawns: createPawnsArray(playerId, 
            pawnRowIndex, returnPawnType(pawnToMoveUP, useWhitePiece)
        ),
        rooks: createRooksArray(playerId, rowIndex, returnRookType(useWhitePiece)),
        bishops: createBishopArray(playerId, rowIndex, returnBishopType(useWhitePiece)),
        knights: createKnightArray(playerId, rowIndex, returnKnightType(useWhitePiece)),
        queens: createQueenArray(playerId, rowIndex, returnQueenType(useWhitePiece)),
       king: createKingArray(playerId, rowIndex, returnKingType(useWhitePiece))
    }
}

export const player1ActivePieces = returnPlayerActivePieces(1, "8", "7", false, false);

export const player2ActivePieces = returnPlayerActivePieces(2, "1", "2", true, true);
