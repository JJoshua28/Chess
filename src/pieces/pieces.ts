/* eslint-disable @typescript-eslint/no-useless-constructor */

import { ColumnIds, RowIds, TileIdsType, rowIndexsArray, RowIndexs, columnIndexsArray } from "../components/board/board";

interface BoardPosition {
    columnId: ColumnIds;
    rowId: RowIds;
}

enum PieceNames {
    PAWN = "pawn",
    KNIGHT = "knight",
    ROOK = "rook",
    BISHOP = "bishop",
    QUEEN = "queen",
    KING = "king",
}

console.log(PieceNames.PAWN)

function separateId(id: TileIdsType): BoardPosition {
    const splitIndex = id.length / 2;
    const columnId = id.slice(0, splitIndex);
    const rowId = id.slice(splitIndex, id.length);
    return {
        columnId: columnId as ColumnIds,
        rowId: rowId as RowIds
    }

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

interface PositionBlueprint {
    columnId: ColumnIds;
    rowId: RowIds;
}

interface PositionDefaultBlueprint {
    columnId: ColumnIds;
    rowId: RowIds;
    moveUp: () => RowIds | null;
    moveDown: () => RowIds | null;
    moveLeft: () =>  ColumnIds | null;
    moveRight: () =>  ColumnIds | null;
    moveUpLeft: () =>  BoardPosition | null;
    moveDownLeft: () =>  BoardPosition | null;
    moveUpRight: () =>  BoardPosition | null;
    moveDownRight: () =>  BoardPosition | null;
}

class Position implements PositionBlueprint {
    columnId: ColumnIds;
    rowId: RowIds;
    constructor(columnId: ColumnIds, rowId: RowIds) {
        this.columnId = columnId;
        this.rowId = rowId;
    }
}
class PositionDefault extends Position implements PositionDefaultBlueprint {
    constructor(columnId: ColumnIds, rowId: RowIds) {
        super(columnId, rowId)
    }
    moveUp(): RowIds | null {
        let rowIdNumber = parseInt(this.rowId); 
        if(rowIdNumber >= rowIndexsArray.length) {
            return null;
        }
        rowIdNumber++;
        this.rowId = rowIdNumber.toString() as typeof RowIndexs [keyof typeof RowIndexs];
        return this.rowId
    }
    moveDown(): RowIds | null{
        let rowIdNumber = parseInt(this.rowId);
        if (rowIdNumber <= 1) {
            return null;
        }
        rowIdNumber--;
        this.rowId = rowIdNumber.toString() as typeof RowIndexs [keyof typeof RowIndexs];
        return this.rowId
    }
    moveLeft(): ColumnIds | null{
        const columnIdIndex = columnIndexsArray.indexOf(this.columnId);
        if (columnIdIndex <= 0) {
            return null;
        }        
        this.columnId = columnIndexsArray[columnIdIndex - 1];
        return this.columnId
    }
    moveRight(): ColumnIds | null{
        const columnIdIndex = columnIndexsArray.indexOf(this.columnId);
        if (columnIdIndex >= (columnIndexsArray.length - 1)) return null;   
        this.columnId = columnIndexsArray[columnIdIndex + 1];
        return this.columnId
    }    
    moveUpLeft(): BoardPosition | null {
        let rowIdNumber = parseInt(this.rowId);
        const columnIdIndex = columnIndexsArray.indexOf(this.columnId);
        if(rowIdNumber >= rowIndexsArray.length || columnIdIndex <= 0) return null;
        return {
            columnId: this.moveLeft() as ColumnIds,
            rowId: this.moveUp() as RowIds
        }
    }
    moveUpRight(): BoardPosition | null {
        let rowIdNumber = parseInt(this.rowId);
        const columnIdIndex = columnIndexsArray.indexOf(this.columnId);
        if(rowIdNumber >= rowIndexsArray.length || columnIdIndex >= (columnIndexsArray.length - 1)) return null;
        return {
            columnId: this.moveRight() as ColumnIds,
            rowId: this.moveUp() as RowIds
        }

    }moveDownLeft (): BoardPosition | null {

        let rowIdNumber = parseInt(this.rowId);
        const columnIdIndex = columnIndexsArray.indexOf(this.columnId);
        console.log("This is the current ColumnIdIndex: " + rowIdNumber);
        console.log("This is the current ColumnId:" + this.rowId);
        if (rowIdNumber <= 1|| columnIdIndex <= 0) {
            return null;
            }    
        return {
            columnId: this.moveLeft() as ColumnIds,
            rowId: this.moveDown() as RowIds
        }
    }
    moveDownRight (): BoardPosition | null {
        let rowIdNumber = parseInt(this.rowId);
        const columnIdIndex = columnIndexsArray.indexOf(this.columnId);
        if (rowIdNumber <= 1|| columnIdIndex >= (columnIndexsArray.length - 1)) return null;
        return {
            columnId: this.moveRight() as ColumnIds,
            rowId: this.moveDown() as RowIds
        }
    }
}

/*
    Left combinations
lx3 ux1
lx1 ux3
lx3 dx1
lx1 dx3

    Right combinations
rx3 ux1
rx1 ux3
rx3 dx1
rx1 dx3
*/

class KnightPositions extends Position {
    constructor(columnId: ColumnIds, rowId: RowIds) {
        super(columnId, rowId)
    }
    moveUpLeft(): null | BoardPosition[]  {
        const possibleTileIds: BoardPosition[] = []
        let rowIdNumber = parseInt(this.rowId);
        const columnIdIndex = columnIndexsArray.indexOf(this.columnId);
        let potentialRowId: RowIds | null = null;
        if(!((rowIdNumber + 2) > rowIndexsArray.length) && !((columnIdIndex - 1) <= 0)) {
            const newRowId: number = rowIdNumber + 2;
            potentialRowId = newRowId.toString() as RowIds;
            const newBoardPosition: BoardPosition = {
                columnId: columnIndexsArray[columnIdIndex -1],
                rowId: potentialRowId
            }    
            possibleTileIds.push(newBoardPosition);
        }
        if(!((columnIdIndex - 2) < 0)) {
            const newRowId: number = rowIdNumber + 1;
            potentialRowId = newRowId.toString() as RowIds;
            const newBoardPosition: BoardPosition = {
                columnId: columnIndexsArray[columnIdIndex - 2],
                rowId: potentialRowId
            }
            possibleTileIds.push(newBoardPosition);  
        };
        if(possibleTileIds.length > 0) return possibleTileIds;
        return null;
    }
    moveUpRight(): null | BoardPosition[]  {
        const possibleTileIds: BoardPosition[] = []
        let rowIdNumber = parseInt(this.rowId);
        const columnIdIndex = columnIndexsArray.indexOf(this.columnId);
        let potentialRowId: RowIds | null = null;
        if(!((rowIdNumber + 2) > rowIndexsArray.length) && !((columnIdIndex + 1) <= 0)) {
            const newRowId: number = rowIdNumber + 2;
            potentialRowId = newRowId.toString() as RowIds;
            const newBoardPosition: BoardPosition = {
                columnId: columnIndexsArray[columnIdIndex + 1],
                rowId: potentialRowId
            }    
            possibleTileIds.push(newBoardPosition);
        }
        if(!((columnIdIndex + 2) < 0)) {
            const newRowId: number = rowIdNumber + 1;
            potentialRowId = newRowId.toString() as RowIds;
            const newBoardPosition: BoardPosition = {
                columnId: columnIndexsArray[columnIdIndex + 2],
                rowId: potentialRowId
            }
            possibleTileIds.push(newBoardPosition);  
        };
        if(possibleTileIds.length > 0) return possibleTileIds;
        return null;
    }
    moveDownLeft(): null | BoardPosition[]  {
        const possibleTileIds: BoardPosition[] = []
        let rowIdNumber = parseInt(this.rowId);
        const columnIdIndex = columnIndexsArray.indexOf(this.columnId);
        let potentialRowId: RowIds | null = null;
        if(!((rowIdNumber - 2) <= 0) && !((columnIdIndex - 1) < 0)) {
            const newRowId: number = rowIdNumber - 2
            potentialRowId = newRowId.toString() as RowIds;
            console.log("new rowID: " + newRowId)
            console.log("Potential rowID: " + potentialRowId)
            const newBoardPosition: BoardPosition = {
                columnId: columnIndexsArray[columnIdIndex - 1],
                rowId: potentialRowId
            }    
            possibleTileIds.push(newBoardPosition);
        }
        if(!((columnIdIndex - 2) < 0)) {
            const newRowId: number = rowIdNumber - 1
            potentialRowId = newRowId.toString() as RowIds;
            const newBoardPosition: BoardPosition = {
                columnId: columnIndexsArray[columnIdIndex - 2],
                rowId: potentialRowId
            }
            possibleTileIds.push(newBoardPosition);  
        };
        if(possibleTileIds.length > 0) return possibleTileIds;
        return null;
    }
    moveDownRight(): null | BoardPosition[]  {
        const possibleTileIds: BoardPosition[] = []
        let rowIdNumber = parseInt(this.rowId);
        const columnIdIndex = columnIndexsArray.indexOf(this.columnId);
        let potentialRowId: RowIds | null = null;
        if(!((rowIdNumber - 2) <= 0) && !((columnIdIndex + 1) >= columnIndexsArray.length)) {
            const newRowId: number = rowIdNumber - 2
            potentialRowId = newRowId.toString() as RowIds;
            console.log("new rowID: " + newRowId)
            console.log("Potential rowID: " + potentialRowId)
            const newBoardPosition: BoardPosition = {
                columnId: columnIndexsArray[columnIdIndex + 1],
                rowId: potentialRowId
            }    
            possibleTileIds.push(newBoardPosition);
        }
        if(!((columnIdIndex + 2) >= columnIndexsArray.length)) {
            const newRowId: number = rowIdNumber - 1
            potentialRowId = newRowId.toString() as RowIds;
            const newBoardPosition: BoardPosition = {
                columnId: columnIndexsArray[columnIdIndex + 2],
                rowId: potentialRowId
            }
            possibleTileIds.push(newBoardPosition);  
        };
        if(possibleTileIds.length > 0) return possibleTileIds;
        return null;
    }
}  

export interface PieceType {
    name: PieceNames | string,
    symbolCharacter: string,
    maxMovements: number;
    moveset: Movesets,
}

export function returnPawnType(moveUp: boolean, whitePawn: boolean): PieceType {
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
export function returnRookType(whitePiece: boolean): PieceType {
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
export const rookType: PieceType = {
    name: PieceNames.ROOK,
    maxMovements: 8,
    symbolCharacter: "t", 
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

export function returnKnightType(whitePiece: boolean): PieceType {
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

export const knightType: PieceType = {
    name: PieceNames.KNIGHT,
    maxMovements: 1,
    symbolCharacter: "j", 
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

export function returnBishopType(whitePiece: boolean): PieceType {
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

export const bishopType: PieceType = {
    name: PieceNames.BISHOP,
    maxMovements: 8,
    symbolCharacter: "n", 
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

export function returnKingType(whitePiece: boolean): PieceType {
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

export const kingType: PieceType = {
    name: PieceNames.KING,
    maxMovements: 1,
    symbolCharacter: "l", 
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

export function returnQueenType(whitePiece: boolean): PieceType {
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
export const queenType: PieceType = {
    name: PieceNames.QUEEN,
    maxMovements: 8,
    symbolCharacter: "w", 
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

interface PieceTemplate {
    readonly symbol: string;
    readonly id: string;
    readonly type: PieceType;
    selected: boolean;
    readonly startingPosition: TileIdsType;
    currentColumnPosition: ColumnIds;
    currentRowPosition: RowIds;
    getCurrentPosition: () =>TileIdsType; 
    getAvailableMoves: () => TileIdsType[];
    getId: () => string;
    getSymbol: () => string;
    setSelected: (value: boolean) => void;
    getSelectedStatus (): boolean;
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
            const potentialPositions = new PositionDefault(this.currentColumnPosition, this.currentRowPosition) ;
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
        const potentialPositions = new PositionDefault(this.currentColumnPosition, this.currentRowPosition);
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

const player1PawnType = returnPawnType(false, false);
const player1Pawn1 = new Pawn("p1", player1PawnType, "a", "7", player1PawnType.symbolCharacter);
const player1pawn2 = new Pawn("p2", player1PawnType, "b", "7", player1PawnType.symbolCharacter);
const player1pawn3 = new Pawn("p3", player1PawnType, "c", "7", player1PawnType.symbolCharacter);
const player1pawn4 = new Pawn("p4", player1PawnType, "d", "7", player1PawnType.symbolCharacter);
const player1pawn5 = new Pawn("p5", player1PawnType, "e", "7", player1PawnType.symbolCharacter);
const player1pawn6 = new Pawn("p6", player1PawnType, "f", "7", player1PawnType.symbolCharacter);
const player1pawn7 = new Pawn("p7", player1PawnType, "g", "7", player1PawnType.symbolCharacter);
const player1pawn8 = new Pawn("p8", player1PawnType, "h", "7", player1PawnType.symbolCharacter);
export const player1Pawns: Pawn[] = [player1Pawn1, player1pawn2, player1pawn3, player1pawn4, 
    player1pawn5, player1pawn6, player1pawn7, player1pawn8];


export const rook1 = new Piece("r1", rookType, "a", "8", rookType.symbolCharacter)
export const rook2 = new Piece("r2", rookType, "h", "8", rookType.symbolCharacter)

export const knight1 = new Piece("h1", knightType, "b", "8", knightType.symbolCharacter)
export const knight2 = new Piece("h2", knightType, "g", "8", knightType.symbolCharacter)

export const bishop1 = new Piece("b1", bishopType, "c", "8", bishopType.symbolCharacter)
export const bishop2 = new Piece("b2", bishopType, "f", "8", bishopType.symbolCharacter)

export const queen1 = new Piece("q1", queenType, "d", "8", queenType.symbolCharacter)
export const king1 = new Piece("k1", kingType, "e", "8", kingType.symbolCharacter)

const player1Rooks = [rook1, rook2]
const player1Bishops = [bishop1, bishop2]
const player1Knights = [knight1, knight2]
const player1Queen = [queen1]
const player1King = [king1]

const activePieces = {
    pawns: player1Pawns,
    rooks: player1Rooks,
    bishops: player1Bishops,
    knights: player1Knights,
    queens:player1Queen,
    king: player1King
}



function setNewPosition(choosenPiece: Piece | Pawn, tile: HTMLDivElement) {
    console.log("I am for reallllll!")
    const currentPosition = choosenPiece.getCurrentPosition();
    const piecesCurrentTile: HTMLDivElement = document.getElementById(currentPosition) as HTMLDivElement;
    piecesCurrentTile.innerHTML = "X";
    choosenPiece.setCurrentPosition(separateId(tile.id as TileIdsType));
    choosenPiece.setSelected(!choosenPiece.getSelectedStatus());
    (tile as HTMLDivElement).innerHTML = choosenPiece.getSymbol();
}

export function movePieceLocation ({target}: React.MouseEvent) {
    const {id} = target as HTMLDivElement;
    let hasNowSelectedAPiece: boolean = false;
        for (const pieces in activePieces) {
            const choosenPiece = activePieces[pieces as keyof typeof activePieces].find(piece =>piece.getCurrentPosition() === id);
            if(choosenPiece) {
                choosenPiece.setSelected(!choosenPiece.getSelectedStatus());
                hasNowSelectedAPiece = true;
                console.log("ms Jackson")
                console.log("Get all available positions: " + choosenPiece.getAvailableMoves())
            }
        }  
        if(!hasNowSelectedAPiece) {
            let previouslySelectedPiece: Piece | undefined;
            for (const pieces in activePieces) {
                if (!previouslySelectedPiece) {
                    previouslySelectedPiece = activePieces[pieces as keyof typeof activePieces].find((piece: Piece) =>piece.getSelectedStatus() === true);
                }
            }
            if (previouslySelectedPiece) {
                console.log("Current position: " + previouslySelectedPiece.getCurrentPosition())
                console.log("all available moves: " + previouslySelectedPiece.getAvailableMoves())
                const isMovePossible = previouslySelectedPiece.getAvailableMoves().includes(id as TileIdsType) ;
                console.log("is the move possible: " + isMovePossible)
                isMovePossible && setNewPosition(previouslySelectedPiece, target as HTMLDivElement);
            }
        }
}


export function displayPawns() {
    return activePieces.pawns.map(pawn => {
        return pawn.getSymbol();
    }) 
}


export function displayPieces () {
    const piecesToDisplay: Piece[] = [];
    const rowID: RowIds = "8"; 
    for (const columnID of columnIndexsArray) {
        for (const pieces in activePieces){
            const pieceToDisplay: Piece | undefined = activePieces[pieces as keyof typeof activePieces].find(piece => piece.getCurrentPosition() === `${columnID}${rowID}` as TileIdsType)
            pieceToDisplay && piecesToDisplay.push(pieceToDisplay);
        }
    }
    return piecesToDisplay.map(piece => piece.getSymbol());
}


/*

export function createPawns(playerId: string, rowIndex: RowIds, pawnMovesets: Movesets): Pawn[] {
    return columnIndexsArray.map((columnId: ColumnIds, index) => new Pawn(
        `${playerId}Pawn${index}`, 
        pawnMovesets, columnId, 
        rowIndex, 
        "o")
    );
}

const player1Pawns = createPawns("p1", "7", pawnMovesets);

*/


