/* eslint-disable @typescript-eslint/no-useless-constructor */

import { BoardPosition, ColumnIds, RowIds, TileIdsType, } from "../types/boardTypes";
import { getColumnIndexArray, } from "../helperFunctions/helperFunction";
import { PieceType, Movesets, PieceNames, PieceTemplate, ActivePieces } from "../types/pieceTypes";
import { KnightPositions, Position } from "../position/position";


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
    readonly id: string;
    readonly type: PieceType;

    readonly startingPosition: TileIdsType;
    currentColumnPosition: ColumnIds;
    currentRowPosition: RowIds;
    selected: boolean = false;
    constructor(id: string, type: PieceType, currentColumnPosition: ColumnIds, currentRowPosition: RowIds, symbol: string) {
        this.id = id;
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
    canMoveTwoSpaces (): boolean {
        return this.getCurrentPosition() === this.startingPosition;
    }
    getId (): string {
        return this.id;
    };
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
                    let newPosition: BoardPosition[] | null = null;
                    switch (movement) {
                        case "upLeft": 
                            newPosition = potentialPositions.moveUpLeft();
                            break;
                        case "upRight":
                            newPosition = potentialPositions.moveUpRight();
                            break;
                        case "downLeft":
                            newPosition = potentialPositions.moveDownLeft();
                            break;
                        case "downRight":
                            newPosition = potentialPositions.moveDownRight();
                    }
                    if(newPosition) {
                        newPosition.forEach(position => {
                            const {columnId, rowId} = position;
                            const tileId: TileIdsType = `${columnId}${rowId}`;
                            possibleMoves.push(tileId)
                        })
                    }
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
                    let newColumnId: ColumnIds | null;
                    let newRowId: RowIds | null = null;
                    let newPosition: BoardPosition | null = null;
                    switch (movement) {
                    case "up":
                        newRowId = potentialPositions.moveUp();
                        newPosition = newRowId? {columnId: this.currentColumnPosition, rowId: newRowId} 
                            : null;
                        break;
                    case "down":
                        newRowId = potentialPositions.moveDown();
                        newPosition = newRowId? {columnId: this.currentColumnPosition, rowId: newRowId} 
                            : null;
                        break;
                    case "left":
                        newColumnId = potentialPositions.moveLeft();
                        newPosition = newColumnId? {columnId: newColumnId, rowId: this.currentRowPosition}
                            : null; 
                        break;
                    case "right":
                        newColumnId = potentialPositions.moveRight();
                        newPosition = newColumnId? {columnId: newColumnId, rowId: this.currentRowPosition}
                        : null;  
                        break;
                    case "upLeft": 
                        newPosition = potentialPositions.moveUpLeft();
                        break;
                    case "upRight":
                        newPosition = potentialPositions.moveUpRight();
                        break;
                    case "downLeft":
                        newPosition = potentialPositions.moveDownLeft();
                        break;
                    case "downRight":
                        newPosition = potentialPositions.moveDownRight();
                    }
                    if(newPosition) {
                        const {columnId, rowId} = newPosition;
                        const tileId: TileIdsType = `${columnId}${rowId}`;
                        possibleMoves.push(tileId)
                    }
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
                console.log("Knight positions: " + knightPositions)
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
    constructor(id: string, type: PieceType, currentColumnPosition: ColumnIds, currentRowPosition: RowIds, symbol: string) {
        super(id, type, currentColumnPosition, currentRowPosition, symbol);
    }
    getAvailableMoves(): TileIdsType[] {
        const possibleMoves: TileIdsType[] = [];
        const potentialPositions = new Position(this.currentColumnPosition, this.currentRowPosition);
        const movementDuration = this.canMoveTwoSpaces()? 2 : this.type.maxMovements;
        for(let moves: number = 0; moves < movementDuration; moves++) {
            for (const movement in this.type.moveset) {
                if((this.type.moveset[movement as keyof typeof this.type.moveset])) {
                    let newColumnId: ColumnIds | null;
                    let newRowId: RowIds | null;
                    let newPosition: BoardPosition | null = null;
                    switch (movement) {
                        case "up":
                            newRowId = potentialPositions.moveUp();
                            newPosition = newRowId? {columnId: this.currentColumnPosition, rowId: newRowId} 
                                : null;
                            break;
                        case "down":
                            newRowId = potentialPositions.moveDown();
                            newPosition = newRowId? {columnId: this.currentColumnPosition, rowId: newRowId} 
                                : null;
                            break;
                        case "left":
                            newColumnId = potentialPositions.moveLeft();
                            newPosition = newColumnId? {columnId: newColumnId, rowId: this.currentRowPosition}
                                : null; 
                            break;
                        case "right":
                            newColumnId = potentialPositions.moveRight();
                            newPosition = newColumnId? {columnId: newColumnId, rowId: this.currentRowPosition}
                            : null;  
                            break;
                        case "upLeft": 
                            newPosition = potentialPositions.moveUpLeft();
                            break;
                        case "upRight":
                            newPosition = potentialPositions.moveUpRight();
                            break;
                        case "downLeft":
                            newPosition = potentialPositions.moveDownLeft();
                            break;
                        case "downRight":
                            newPosition = potentialPositions.moveDownRight();
                        }
                        if(newPosition) {
                            const {columnId, rowId} = newPosition;
                            const tileId: TileIdsType = `${columnId}${rowId}`;
                            possibleMoves.push(tileId)
                        }
                }
            }
        }

        return possibleMoves;
    };
}
function createPawnsArray(rowIndex: RowIds, pawnType: PieceType): Pawn[] {
    return getColumnIndexArray().map((columnId: ColumnIds, index: number) => new Pawn(
        `p${index+1}`, 
        pawnType, 
        columnId, 
        rowIndex, 
        pawnType.symbolCharacter)
    );
}

function createRooksArray(rowIndex: RowIds, pawnType: PieceType): Piece[] {
    const rooksArray: Piece[] = [];
    rooksArray.push(new Piece("r1", pawnType, "a",rowIndex, pawnType.symbolCharacter));
    rooksArray.push(new Piece("r2", pawnType, "h",rowIndex, pawnType.symbolCharacter));
    return rooksArray;
}

function createKnightArray(rowIndex: RowIds, pawnType: PieceType): Piece[] {
    const rooksArray: Piece[] = [];
    rooksArray.push(new Piece("r1", pawnType, "b",rowIndex, pawnType.symbolCharacter));
    rooksArray.push(new Piece("r2", pawnType, "g",rowIndex, pawnType.symbolCharacter));
    return rooksArray;
}

function createBishopArray(rowIndex: RowIds, pawnType: PieceType): Piece[] {
    const rooksArray: Piece[] = [];
    rooksArray.push(new Piece("r1", pawnType, "c",rowIndex, pawnType.symbolCharacter));
    rooksArray.push(new Piece("r2", pawnType, "f",rowIndex, pawnType.symbolCharacter));
    return rooksArray;
}

function createQueenArray(rowIndex: RowIds, pawnType: PieceType): Piece[] {
    return [new Piece("q1", pawnType, "d", rowIndex, pawnType.symbolCharacter)]
}

function createKingArray(rowIndex: RowIds, pawnType: PieceType): Piece[] {
    return [new Piece("q1", pawnType, "e", rowIndex, pawnType.symbolCharacter)]
}

function returnPlayerActivePieces (rowIndex: RowIds, pawnRowIndex:RowIds, pawnToMoveUP: boolean, useWhitePiece: boolean): ActivePieces {
    return {
        pawns: createPawnsArray(
            pawnRowIndex, returnPawnType(pawnToMoveUP, useWhitePiece)
        ),
        rooks: createRooksArray(rowIndex, returnRookType(useWhitePiece)),
        bishops: createBishopArray(rowIndex, returnBishopType(useWhitePiece)),
        knights: createKnightArray(rowIndex, returnKnightType(useWhitePiece)),
        queens: createQueenArray(rowIndex, returnQueenType(useWhitePiece)),
       king: createKingArray(rowIndex, returnKingType(useWhitePiece))
    }
}

export const player1ActivePieces = returnPlayerActivePieces("8", "7", false, false);

export const player2ActivePieces = returnPlayerActivePieces("1", "2", true, true);
