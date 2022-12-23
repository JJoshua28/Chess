import { getRowIndexArray, getColumnIndexArray, createNewColumnId, createNewRowId } from "../helperFunctions/helperFunction";
import { ColumnIds, RowIds, RowIndexs, BoardPosition } from "../types/boardTypes";
import { KnightPositionBlueprint, PositionBlueprint } from "../types/positionTypes";

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
    let rowIdNumber = parseInt(this.rowId); 
    if(rowIdNumber >= getRowIndexArray().length) {
        return null;
    }
    rowIdNumber++;
    this.rowId = rowIdNumber.toString() as typeof RowIndexs [keyof typeof RowIndexs];
    return this.rowId
}
moveDown() {
    const newRowId = createNewRowId(this.rowId, false);
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
    let rowIdNumber = parseInt(this.rowId);
    const columnIdIndex = getColumnIndexArray().indexOf(this.columnId);
    if(rowIdNumber >= getRowIndexArray().length || columnIdIndex <= 0) return null;
    return {
        columnId: this.moveLeft() as ColumnIds,
        rowId: this.moveUp() as RowIds
    }
}
moveUpRight() {
    let rowIdNumber = parseInt(this.rowId);
    const columnIdIndex = getColumnIndexArray().indexOf(this.columnId);
    if(rowIdNumber >= getRowIndexArray().length || columnIdIndex >= (getColumnIndexArray().length - 1)) return null;
    return {
        columnId: this.moveRight() as ColumnIds,
        rowId: this.moveUp() as RowIds
    }

}moveDownLeft () {
    let rowIdNumber = parseInt(this.rowId);
    const columnIdIndex = getColumnIndexArray().indexOf(this.columnId);
    if (rowIdNumber <= 1|| columnIdIndex <= 0) {
        return null;
        }    
    return {
        columnId: this.moveLeft() as ColumnIds,
        rowId: this.moveDown() as RowIds
    }
}
moveDownRight () {
    let rowIdNumber = parseInt(this.rowId);
    const columnIdIndex = getColumnIndexArray().indexOf(this.columnId);
    if (rowIdNumber <= 1|| columnIdIndex >= (getColumnIndexArray().length - 1)) return null;
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
    if(!((rowIdNumber + 2) > getRowIndexArray().length) && !((columnIdIndex - 1) <= 0)) {
        const newRowId: number = rowIdNumber + 2;
        potentialRowId = newRowId.toString() as RowIds;
        const newBoardPosition: BoardPosition = {
            columnId: getColumnIndexArray()[columnIdIndex -1],
            rowId: potentialRowId
        }    
        possibleTileIds.push(newBoardPosition);
    }
    if(!((columnIdIndex - 2) < 0)) {
        const newRowId: number = rowIdNumber + 1;
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
moveUpRight(): null | BoardPosition[]  {
    const possibleTileIds: BoardPosition[] = []
    let rowIdNumber = parseInt(this.rowId);
    const columnIdIndex = getColumnIndexArray().indexOf(this.columnId);
    let potentialRowId: RowIds | null = null;
    if(!((rowIdNumber + 2) > getRowIndexArray().length) && !((columnIdIndex + 1) <= 0)) {
        const newRowId: number = rowIdNumber + 2;
        potentialRowId = newRowId.toString() as RowIds;
        const newBoardPosition: BoardPosition = {
            columnId: getColumnIndexArray()[columnIdIndex + 1],
            rowId: potentialRowId
        }    
        possibleTileIds.push(newBoardPosition);
    }
    if(!((columnIdIndex + 2) < 0)) {
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
    if(!((columnIdIndex - 2) < 0)) {
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
    if(!((columnIdIndex + 2) >= getColumnIndexArray().length)) {
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