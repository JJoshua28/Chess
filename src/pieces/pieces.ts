/* eslint-disable @typescript-eslint/no-useless-constructor */

import { BoardPosition, ColumnIds, RowIds, TileIdsType, } from "../types/boardTypes";
import {createNewColumnId, createNewTileId, getColumnIndexArray, separateId, } from "../helperFunctions/helperFunction";
import { PieceType, Movesets, PieceNames, PieceTemplate, ActivePieces, PlayerIdType, MovementType, PieceSymbol, TranslucentPieceSymbol, PawnTemplate } from "../types/pieceTypes";
import { knightMovementMapper, KnightPositions, movementMapper, Position } from "../position/position";
import { getPlayerById, getPlayersPiecePositions, indexOfOppositionPieceOnTile } from "../players/players";

function returnPawnType(moveUp: boolean, translucentPawn: boolean): PieceType {
    const symbol = translucentPawn? TranslucentPieceSymbol.PAWN : PieceSymbol.PAWN;
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
        symbolCharacter: symbol, 
        maxMovements: 1,
        moveset: moveset
    }
}

//["r","h","b","q","k","b","h","r"]
function returnRookType(translucentPiece: boolean): PieceType {
    const symbol = translucentPiece? TranslucentPieceSymbol.ROOK : PieceSymbol.ROOK;
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


function returnKnightType(translucentPiece: boolean): PieceType {
    const symbol = translucentPiece? TranslucentPieceSymbol.KNIGHT : PieceSymbol.KNIGHT;
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


function returnBishopType(translucentPiece: boolean): PieceType {
    const symbol = translucentPiece? TranslucentPieceSymbol.BISHOP : PieceSymbol.BISHOP;
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

function returnKingType(translucentPiece: boolean): PieceType {
    const symbol = translucentPiece? TranslucentPieceSymbol.KING : PieceSymbol.KING;
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

function returnQueenType(translucentPiece: boolean): PieceType {
    const symbol = translucentPiece? TranslucentPieceSymbol.QUEEN : PieceSymbol.QUEEN;
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
    returnPiecePositions(): TileIdsType[] | null{
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
        return possibleMoves.length > 0? possibleMoves : null;;
    };
}

export class King extends Piece {
    constructor(id: PlayerIdType, type: PieceType, currentColumnPosition: ColumnIds, currentRowPosition: RowIds, symbol: string) {
        super(id, type, currentColumnPosition, currentRowPosition, symbol);
    }
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
        const possibleCastlingMoves = castlingIds(this.playerId);
        possibleCastlingMoves.forEach(move => possibleMoves.push(move))
        return possibleMoves.length > 0? possibleMoves : null;
    }   
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
    return [new King(playerId, pawnType, "e", rowIndex, pawnType.symbolCharacter)]
}

function returnPlayerActivePieces (playerId: PlayerIdType, rowIndex: RowIds, pawnRowIndex:RowIds, pawnToMoveUP: boolean, usetranslucentPiece: boolean): ActivePieces {
    return {
        pawns: createPawnsArray(playerId, 
            pawnRowIndex, returnPawnType(pawnToMoveUP, usetranslucentPiece)
        ),
        rooks: createRooksArray(playerId, rowIndex, returnRookType(usetranslucentPiece)),
        bishops: createBishopArray(playerId, rowIndex, returnBishopType(usetranslucentPiece)),
        knights: createKnightArray(playerId, rowIndex, returnKnightType(usetranslucentPiece)),
        queens: createQueenArray(playerId, rowIndex, returnQueenType(usetranslucentPiece)),
        king: createKingArray(playerId, rowIndex, returnKingType(usetranslucentPiece))
    }
}

export function createNewPiece (playerId: PlayerIdType, name: PieceNames, rowId: RowIds, columnId: ColumnIds): PieceTemplate {
    const usetranslucentPiece = playerId === 1? false : true;
    let newPiece: PieceTemplate;
    switch (name) {
        case PieceNames.QUEEN:
            const queenPieceType = returnQueenType(usetranslucentPiece);
            newPiece = new Piece(playerId, queenPieceType, columnId, rowId, queenPieceType.symbolCharacter, true);
            break;
        case PieceNames.ROOK:
            const rookPieceType = returnRookType(usetranslucentPiece);
            newPiece = new Piece(playerId, rookPieceType, columnId, rowId, rookPieceType.symbolCharacter, true);
            break;
        case PieceNames.BISHOP:
            const bishopPieceType = returnBishopType(usetranslucentPiece);
            newPiece = new Piece(playerId, bishopPieceType, columnId, rowId, bishopPieceType.symbolCharacter, true);
            break;
        default:
            const knightPieceType = returnKnightType(usetranslucentPiece);
            newPiece = new Piece(playerId, knightPieceType, columnId, rowId, knightPieceType.symbolCharacter, true);
            break;
    }
    return newPiece;

}

function validKingCastlingPositions (rook: PieceTemplate, kingsPosition: TileIdsType): TileIdsType | null {
    const {columnId, rowId} = separateId(kingsPosition);
    const columnIdIndexArray = getColumnIndexArray(); 
    const rookColumnIdIndex = columnIdIndexArray.indexOf(rook.currentColumnPosition)
    const kingColumnIdIndex = columnIdIndexArray.indexOf(columnId);
    if(kingColumnIdIndex < rookColumnIdIndex) {
        for(let index = kingColumnIdIndex + 1; index < rookColumnIdIndex; index++) {
            const tileOccupied = getPlayersPiecePositions(rook.playerId).includes(`${columnIdIndexArray[index]}${rowId}`)
            if(tileOccupied) return null;
        }
        const kingsPotentialColumnId = createNewColumnId(columnId, 2);
        const kingsPotentialTileId: TileIdsType | null = kingsPotentialColumnId && createNewTileId(kingsPotentialColumnId, rowId)
        return kingsPotentialTileId;
    }
    if(kingColumnIdIndex > rookColumnIdIndex) {
        for(let index = kingColumnIdIndex - 1; index > rookColumnIdIndex; index--) {
            const tileOccupied = getPlayersPiecePositions(rook.playerId).includes(`${columnIdIndexArray[index]}${rowId}`)
            if(tileOccupied) return null;
        }
        const kingsPotentialColumnId = createNewColumnId(columnId, -2);
        const kingsPotentialTileId: TileIdsType | null = kingsPotentialColumnId && createNewTileId(kingsPotentialColumnId, rowId)
        return kingsPotentialTileId;
    }
    return null;
}

export function castlingIds(playerId: PlayerIdType): TileIdsType[] {
    const possibleTileIds: TileIdsType[] = [];
    const player = getPlayerById(playerId);
    const [king] = player.activePieces.king;
    if(!king.hasMoved) {
        const [rook1, rook2] = player.activePieces.rooks;
        const possibleCastlingPosition1 = !rook1.hasMoved && validKingCastlingPositions(rook1, king.getCurrentPosition())
        const possibleCastlingPosition2 = !rook2.hasMoved && validKingCastlingPositions(rook2, king.getCurrentPosition())
        possibleCastlingPosition1 && possibleTileIds.push(possibleCastlingPosition1);
        possibleCastlingPosition2 && possibleTileIds.push(possibleCastlingPosition2);
    }
    return possibleTileIds;
}

export function isACastlingMove(king: PieceTemplate, newTileId: TileIdsType): boolean {
    if(king.hasMoved || king.type.name !== PieceNames.KING) return false
    const {columnId} = separateId(newTileId);
    const columnIdIndexArray = getColumnIndexArray();
    const indexOfColumnId = columnIdIndexArray.indexOf(columnId)
    const indexOfKingsColumnId = columnIdIndexArray.indexOf(king.currentColumnPosition)
    return (indexOfKingsColumnId + 2) === indexOfColumnId || (indexOfKingsColumnId - 2) === indexOfColumnId;
}

export const player1ActivePieces = returnPlayerActivePieces(1, "8", "7", false, false);

export const player2ActivePieces = returnPlayerActivePieces(2, "1", "2", true, true);
