import { createNewColumnId, createNewRowId } from "../helperFunctions/helperFunction";
import { ColumnIds, RowIds, BoardPosition, TileIdsType } from "../types/boardTypes";
import { KnightPositionBlueprint, OffsetKnightIdBy, PositionBlueprint } from "../types/positionTypes";
import {PieceTemplate, MovementType, PlayerIdType} from "../types/pieceTypes";
import { isAValidMove, MoveValidator } from "./moveValidator";
abstract class PositionParent implements BoardPosition {
    columnId;
    rowId
    constructor(columnId: ColumnIds, rowId: RowIds) {
        this.columnId = columnId;
        this.rowId = rowId;
    }
}

export class Position extends PositionParent implements PositionBlueprint {
// eslint-disable-next-line @typescript-eslint/no-useless-constructor
constructor(columnId: ColumnIds, rowId: RowIds) {
    super(columnId, rowId)
}
moveUp() {
    const offsetRowIdBy = 1;
    const newRowId = createNewRowId(this.rowId, offsetRowIdBy);
    if(!newRowId) return newRowId;
    this.rowId = newRowId;
    return this.rowId
}
moveDown() {
    const offsetRowIdBy = -1;
    const newRowId = createNewRowId(this.rowId, offsetRowIdBy);
    if(!newRowId) return newRowId;
    this.rowId = newRowId;
    return this.rowId
}
moveLeft(){
    const offsetColumnIdBy = -1
    const newColumnId = createNewColumnId(this.columnId, offsetColumnIdBy);
    if(!newColumnId) return newColumnId;
    this.columnId = newColumnId;
    return this.columnId
}
moveRight(){ 
    const offsetColumnIdBy = 1 
    const newColumnId = createNewColumnId(this.columnId, offsetColumnIdBy);
    if(!newColumnId) return newColumnId;
    this.columnId = newColumnId;
    return this.columnId
}    
moveUpLeft() {
    const offsetRowIdBy = 1;
    const offsetColumnIdBy = -1
    if(!createNewRowId(this.rowId, offsetRowIdBy)|| !createNewColumnId(this.columnId, offsetColumnIdBy)) return null;
    return {
        columnId: this.moveLeft() as ColumnIds,
        rowId: this.moveUp() as RowIds
    }
}
moveUpRight() {
    const offsetRowIdBy = 1;
    const offsetColumnIdBy = 1
    if(!createNewRowId(this.rowId, offsetRowIdBy)|| !createNewColumnId(this.columnId, offsetColumnIdBy)) return null;
    return {
        columnId: this.moveRight() as ColumnIds,
        rowId: this.moveUp() as RowIds
    }
}
moveDownLeft () {
    const offsetRowIdBy = -1;
    const offsetColumnIdBy = -1
    if (!createNewRowId(this.rowId, offsetRowIdBy)|| !createNewColumnId(this.columnId, offsetColumnIdBy)) return null;   
    return {
        columnId: this.moveLeft() as ColumnIds,
        rowId: this.moveDown() as RowIds
    }
}
moveDownRight () {
    const offsetRowIdBy = -1;
    const offsetColumnIdBy = 1
    if (!createNewRowId(this.rowId, offsetRowIdBy)||!createNewColumnId(this.columnId, offsetColumnIdBy)) return null;
    return {
        columnId: this.moveRight() as ColumnIds,
        rowId: this.moveDown() as RowIds
    }
}
}

/*
Left combinations
lx2 ux1
lx1 ux2
lx2 dx1
lx1 dx2
!((rowIdNumber + 1) > getRowIndexArray().length) && ght combinations
rx2 ux1
rx1 ux2
rx2 dx1
rx1 dx2
*/

export class KnightPositions extends PositionParent implements KnightPositionBlueprint {
// eslint-disable-next-line @typescript-eslint/no-useless-constructor
constructor(columnId: ColumnIds, rowId: RowIds) {
    super(columnId, rowId)
}
getPossiblePositions (offsetRowIdBy: OffsetKnightIdBy, offsetColumnIdBy: OffsetKnightIdBy ): BoardPosition[] | null {
    const possibleTileIds: BoardPosition[] = [];
    let potentialRowId = createNewRowId(this.rowId, offsetRowIdBy);
    let potentialColumnId = createNewColumnId(this.columnId, offsetColumnIdBy);
    if(potentialRowId && potentialColumnId) {
        const newBoardPosition: BoardPosition = {
            columnId: potentialColumnId,
            rowId: potentialRowId
        }    
        possibleTileIds.push(newBoardPosition);
    }
    offsetRowIdBy /= 2 ;
    potentialRowId = createNewRowId(this.rowId, offsetRowIdBy);
    offsetColumnIdBy *= 2;
    potentialColumnId = createNewColumnId(this.columnId, offsetColumnIdBy);
    if(potentialRowId && potentialColumnId) {
        const newBoardPosition: BoardPosition = {
            columnId: potentialColumnId,
            rowId: potentialRowId
        }    
        possibleTileIds.push(newBoardPosition);
    }
    if(possibleTileIds.length > 0) return possibleTileIds;
    return null;

}
moveUpLeft(): BoardPosition[] | null  {
    const offsetRowIdBy = 2;
    const offsetColumnIdBy = -1;
    return this.getPossiblePositions(offsetRowIdBy, offsetColumnIdBy)
}
moveUpRight(): null | BoardPosition[]  {
    const offsetRowIdBy = 2;
    const offsetColumnIdBy = 1;
    return this.getPossiblePositions(offsetRowIdBy, offsetColumnIdBy)
}
moveDownLeft(): null | BoardPosition[]  {
    const offsetRowIdBy = -2;
    const offsetColumnIdBy = -1;
    return this.getPossiblePositions(offsetRowIdBy, offsetColumnIdBy)
}
moveDownRight(): null | BoardPosition[]  {
    const offsetRowIdBy = -2;
    const offsetColumnIdBy = 1;
    return this.getPossiblePositions(offsetRowIdBy, offsetColumnIdBy)
}
}

export function movementMapper(piece: PieceTemplate, potentialPositions: PositionBlueprint, movement: MovementType): TileIdsType | null {
    let newColumnId: ColumnIds | null = null;
    let newRowId: RowIds | null = null;
    let newPosition: BoardPosition | null = null;
    switch (movement) {                            
        case "up": {
            const offsetRowIdBy = 1;
            newRowId = createNewRowId(potentialPositions.rowId, offsetRowIdBy);                            
            if(newRowId) {
                const boardPosition: BoardPosition = {columnId: potentialPositions.columnId, rowId: newRowId }
                const currentBoardPosition: BoardPosition = {columnId: piece.currentColumnPosition,
                rowId: piece.currentRowPosition}
                const moveValidator = new MoveValidator(piece.playerId, 
                    currentBoardPosition,
                    boardPosition,
                    movement
                )
                newRowId = moveValidator.validateMove() ? potentialPositions.moveUp() : null;
                newPosition = newRowId? {columnId: potentialPositions.columnId, rowId: newRowId} 
                    : null;                             
            }
        }
        break;
        case "down": {
            const offsetRowIdBy = -1;
            newRowId = createNewRowId(potentialPositions.rowId, offsetRowIdBy);
            if(newRowId) {
                const boardPosition: BoardPosition = {columnId: potentialPositions.columnId, rowId: newRowId }
                const currentBoardPosition: BoardPosition = {columnId: piece.currentColumnPosition,
                rowId: piece.currentRowPosition}
                const moveValidator = new MoveValidator(piece.playerId, 
                    currentBoardPosition,
                    boardPosition,
                    movement
                )
                newRowId = moveValidator.validateMove() ? potentialPositions.moveDown() : null;
                newPosition = newRowId? {columnId: potentialPositions.columnId, rowId: newRowId} 
                    : null;                             
            }
        }
        break;
        case "left": {
            const offsetRowIdBy = -1;
            newColumnId = createNewColumnId(potentialPositions.columnId, offsetRowIdBy);
            if(newColumnId) {
                const boardPosition: BoardPosition = {columnId: newColumnId, rowId: potentialPositions.rowId }
                const currentBoardPosition: BoardPosition = {columnId: piece.currentColumnPosition,
                rowId: piece.currentRowPosition}
                const moveValidator = new MoveValidator(piece.playerId, 
                    currentBoardPosition,
                    boardPosition,
                    movement
                )
                newColumnId = moveValidator.validateMove() ? potentialPositions.moveLeft() : null;
                newPosition = newColumnId? {columnId: newColumnId, rowId: potentialPositions.rowId} 
                    : null;                             
            }

        }break;
        case "right": {
            const offsetColumnIdBy = 1;
            newColumnId = createNewColumnId(potentialPositions.columnId, offsetColumnIdBy);
            if(newColumnId) {
                const boardPosition: BoardPosition = {columnId: newColumnId, rowId: potentialPositions.rowId }
                const currentBoardPosition: BoardPosition = {columnId: piece.currentColumnPosition,
                rowId: piece.currentRowPosition}
                const moveValidator = new MoveValidator(piece.playerId, 
                    currentBoardPosition,
                    boardPosition,
                    movement
                )
                newColumnId = moveValidator.validateMove() ? potentialPositions.moveRight() : null;
                newPosition = newColumnId? {columnId: newColumnId, rowId: potentialPositions.rowId} 
                    : null;                             
            }

        }break;
        case "upLeft": {
            const offsetRowIdBy = 1;
            const offsetColumnIdBy = -1;
            newColumnId = createNewColumnId(potentialPositions.columnId, offsetColumnIdBy);
            newRowId = createNewRowId(potentialPositions.rowId, offsetRowIdBy);
            if(newColumnId && newRowId) {
                const boardPosition: BoardPosition = {columnId: newColumnId, rowId: newRowId }
                const currentBoardPosition: BoardPosition = {columnId: piece.currentColumnPosition,
                rowId: piece.currentRowPosition}
                const moveValidator = new MoveValidator(piece.playerId, 
                    currentBoardPosition,
                    boardPosition,
                    movement
                )
                newPosition = moveValidator.validateMove() ? potentialPositions.moveUpLeft() : null;
            }
        }break;
        case "upRight": {
            const offsetRowIdBy = 1;
            const offsetColumnIdBy = 1;
            newColumnId = createNewColumnId(potentialPositions.columnId, offsetColumnIdBy);
            newRowId = createNewRowId(potentialPositions.rowId, offsetRowIdBy);
            if(newColumnId && newRowId) {
                const boardPosition: BoardPosition = {columnId: newColumnId, rowId: newRowId }
                const currentBoardPosition: BoardPosition = {columnId: piece.currentColumnPosition,
                rowId: piece.currentRowPosition}
                const moveValidator = new MoveValidator(piece.playerId, 
                    currentBoardPosition,
                    boardPosition,
                    movement
                )
                newPosition = moveValidator.validateMove() ? potentialPositions.moveUpRight() : null;
            }
        }break;
        case "downLeft": {
            const offsetRowIdBy = -1;
            const offsetColumnIdBy = -1;
            newColumnId = createNewColumnId(potentialPositions.columnId, offsetColumnIdBy);
            newRowId = createNewRowId(potentialPositions.rowId, offsetRowIdBy);
            if(newColumnId && newRowId) {
                const boardPosition: BoardPosition = {columnId: newColumnId, rowId: newRowId }
                const currentBoardPosition: BoardPosition = {columnId: piece.currentColumnPosition,
                rowId: piece.currentRowPosition}
                const moveValidator = new MoveValidator(piece.playerId, 
                    currentBoardPosition,
                    boardPosition,
                    movement
                )
                newPosition = moveValidator.validateMove() ? potentialPositions.moveDownLeft() : null;                         
            }
        }break;
        case "downRight": {
            const offsetRowIdBy = -1;
            const offsetColumnIdBy = 1;
            newColumnId = createNewColumnId(potentialPositions.columnId, offsetColumnIdBy);
            newRowId = createNewRowId(potentialPositions.rowId, offsetRowIdBy);
            if(newColumnId && newRowId) {
                const boardPosition: BoardPosition = {columnId: newColumnId, rowId: newRowId }
                const currentBoardPosition: BoardPosition = {columnId: piece.currentColumnPosition,
                rowId: piece.currentRowPosition}
                const moveValidator = new MoveValidator(piece.playerId, 
                    currentBoardPosition,
                    boardPosition,
                    movement
                )
                newPosition = moveValidator.validateMove() ? potentialPositions.moveDownRight() : null;                         
            }
        }break
    }
    if(newPosition) {
        const {columnId, rowId} = newPosition;
        const tileId: TileIdsType = `${columnId}${rowId}`;                      
        return tileId;

    }
    return newPosition;
}

export function knightMovementMapper(playerId: PlayerIdType, potentialPositions: KnightPositionBlueprint, movement: MovementType): TileIdsType[] | null {
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
        const availablePositions: TileIdsType[] = [];
        newPosition.forEach(position => {
            const {columnId, rowId} = position;
            const tileId: TileIdsType = `${columnId}${rowId}`;
            if(isAValidMove(playerId, position)) availablePositions.push(tileId);
        })
        return availablePositions;
    }
    return null;
}

