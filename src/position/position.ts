import { getRowIndexArray, getColumnIndexArray, createNewColumnId, createNewRowId } from "../helperFunctions/helperFunction";
import { ColumnIds, RowIds, BoardPosition, TileIdsType } from "../types/boardTypes";
import { KnightPositionBlueprint, PositionBlueprint } from "../types/positionTypes";
import {PieceTemplate, MovementType} from "../types/pieceTypes";
import { MoveValidator } from "./moveValidator";
class PositionParent implements BoardPosition {
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
    const newColumnId = createNewColumnId(this.columnId, false);
    if(!newColumnId) return newColumnId;
    this.columnId = newColumnId;
    return this.columnId
}
moveRight(){  
    const newColumnId = createNewColumnId(this.columnId, true);
    if(!newColumnId) return newColumnId;
    this.columnId = newColumnId;
    return this.columnId
}    
moveUpLeft() {
    const offsetRowIdBy = 1;
    const columnIdIndex = getColumnIndexArray().indexOf(this.columnId);
    if(!createNewRowId(this.rowId, offsetRowIdBy)|| columnIdIndex <= 0) return null;
    return {
        columnId: this.moveLeft() as ColumnIds,
        rowId: this.moveUp() as RowIds
    }
}
moveUpRight() {
    const offsetRowIdBy = 1;
    const columnIdIndex = getColumnIndexArray().indexOf(this.columnId);
    if(!createNewRowId(this.rowId, offsetRowIdBy)|| columnIdIndex >= (getColumnIndexArray().length - 1)) return null;
    return {
        columnId: this.moveRight() as ColumnIds,
        rowId: this.moveUp() as RowIds
    }

}
moveDownLeft () {
    const offsetRowIdBy = -1;
    const columnIdIndex = getColumnIndexArray().indexOf(this.columnId);
    if (!createNewRowId(this.rowId, offsetRowIdBy)|| columnIdIndex <= 0) {
        return null;
        }    
    return {
        columnId: this.moveLeft() as ColumnIds,
        rowId: this.moveDown() as RowIds
    }
}
moveDownRight () {
    const offsetRowIdBy = -1;
    const columnIdIndex = getColumnIndexArray().indexOf(this.columnId);
    if (!createNewRowId(this.rowId, offsetRowIdBy)|| columnIdIndex >= (getColumnIndexArray().length - 1)) return null;
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
!((rowIdNumber + 1) > getRowIndexArray().length) && ght combinations
rx3 ux1
rx1 ux3
rx3 dx1
rx1 dx3
*/

export class KnightPositions extends PositionParent implements KnightPositionBlueprint {
// eslint-disable-next-line @typescript-eslint/no-useless-constructor
constructor(columnId: ColumnIds, rowId: RowIds) {
    super(columnId, rowId)
}
moveUpLeft()  {
    const possibleTileIds: BoardPosition[] = []
    let rowIdNumber = parseInt(this.rowId);
    const columnIdIndex = getColumnIndexArray().indexOf(this.columnId);
    let potentialRowId: RowIds | null = null;
    if(!((rowIdNumber + 2) > getRowIndexArray().length) && !((columnIdIndex - 1) < 0)) {
        const newRowId: number = rowIdNumber + 2;
        potentialRowId = newRowId.toString() as RowIds;
        const newBoardPosition: BoardPosition = {
            columnId: getColumnIndexArray()[columnIdIndex -1],
            rowId: potentialRowId
        }    
        possibleTileIds.push(newBoardPosition);
    }
    if(!((rowIdNumber + 1) > getRowIndexArray().length) && !((columnIdIndex - 2) < 0)) {
        const newRowId: number = rowIdNumber + 1;
        potentialRowId = newRowId.toString() as RowIds;
        const newBoardPosition: BoardPosition = {
            columnId: getColumnIndexArray()[columnIdIndex - 2],
            rowId: potentialRowId
        }
        possibleTileIds.push(newBoardPosition);  
    };
    console.log(possibleTileIds)
    if(possibleTileIds.length > 0) return possibleTileIds;
    return null;
}
moveUpRight(): null | BoardPosition[]  {
    const possibleTileIds: BoardPosition[] = []
    let rowIdNumber = parseInt(this.rowId);
    const columnIdIndex = getColumnIndexArray().indexOf(this.columnId);
    let potentialRowId: RowIds | null = null;
    if(!((rowIdNumber + 2) > getRowIndexArray().length) && !((columnIdIndex + 1) >= getColumnIndexArray().length)) {
        const newRowId: number = rowIdNumber + 2;
        potentialRowId = newRowId.toString() as RowIds;
        const newBoardPosition: BoardPosition = {
            columnId: getColumnIndexArray()[columnIdIndex + 1],
            rowId: potentialRowId
        }    
        possibleTileIds.push(newBoardPosition);
    }
    if(!((rowIdNumber + 1) > getRowIndexArray().length) && !((columnIdIndex + 2) >= getColumnIndexArray().length)) {
        const newRowId: number = rowIdNumber + 1;
        potentialRowId = newRowId.toString() as RowIds;
        const newBoardPosition: BoardPosition = {
            columnId: getColumnIndexArray()[columnIdIndex + 2],
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
    const columnIdIndex = getColumnIndexArray().indexOf(this.columnId);
    let potentialRowId: RowIds | null = null;
    if(!((rowIdNumber - 2) <= 0) && !((columnIdIndex - 1) < 0)) {
        const newRowId: number = rowIdNumber - 2
        potentialRowId = newRowId.toString() as RowIds;
        const newBoardPosition: BoardPosition = {
            columnId: getColumnIndexArray()[columnIdIndex - 1],
            rowId: potentialRowId
        }    
        possibleTileIds.push(newBoardPosition);
    }
    if(!((rowIdNumber - 1) <= 0) && !((columnIdIndex - 2) < 0)) {
        const newRowId: number = rowIdNumber - 1
        potentialRowId = newRowId.toString() as RowIds;
        const newBoardPosition: BoardPosition = {
            columnId: getColumnIndexArray()[columnIdIndex - 2],
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
    const columnIdIndex = getColumnIndexArray().indexOf(this.columnId);
    let potentialRowId: RowIds | null = null;
    if(!((rowIdNumber - 2) <= 0) && !((columnIdIndex + 1) >= getColumnIndexArray().length)) {
        const newRowId: number = rowIdNumber - 2
        potentialRowId = newRowId.toString() as RowIds;
        const newBoardPosition: BoardPosition = {
            columnId: getColumnIndexArray()[columnIdIndex + 1],
            rowId: potentialRowId
        }    
        possibleTileIds.push(newBoardPosition);
    }
    if(!((rowIdNumber - 1) <= 0) && !((columnIdIndex + 2) >= getColumnIndexArray().length)) {
        const newRowId: number = rowIdNumber - 1
        potentialRowId = newRowId.toString() as RowIds;
        const newBoardPosition: BoardPosition = {
            columnId: getColumnIndexArray()[columnIdIndex + 2],
            rowId: potentialRowId
        }
        possibleTileIds.push(newBoardPosition);  
    };
    if(possibleTileIds.length > 0) return possibleTileIds;
    return null;
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
        case "left":
            newColumnId = createNewColumnId(potentialPositions.columnId, false);
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
            break;
        case "right":
            newColumnId = createNewColumnId(potentialPositions.columnId, true);
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
            break;
        case "upLeft": {
            const offsetRowIdBy = 1;
            newColumnId = createNewColumnId(potentialPositions.columnId, false);
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
            }
            break;
        case "upRight": {
            const offsetRowIdBy = 1;
            newColumnId = createNewColumnId(potentialPositions.columnId, true);
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
            }
            break;
        case "downLeft": {
            const offsetRowIdBy = -1;
            newColumnId = createNewColumnId(potentialPositions.columnId, false);
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
            }
            break;
        case "downRight": {
            const offsetRowIdBy = -1;
            newColumnId = createNewColumnId(potentialPositions.columnId, true);
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
            }
            break
    }
    if(newPosition) {
        const {columnId, rowId} = newPosition;
        const tileId: TileIdsType = `${columnId}${rowId}`;
        return tileId;
    }
    return newPosition;

}

