import { createNewColumnId, createNewRowId, getColumnIndexArray, getRowIndexArray, separateId } from "../helperFunctions/helperFunction";
import { getOppositionPlayersPiecePosition, getPlayersPiecePositions } from "../players/players";
import { BoardPosition, ColumnIndexsArrayType, RowIndexsArrayType, TileIdsType } from "../types/boardTypes";
import { MovementType, PlayerIdType } from "../types/pieceTypes";

export function isAValidMove (playerId: PlayerIdType, boardPosition: BoardPosition): boolean {
    const tileId: TileIdsType = `${boardPosition.columnId}${boardPosition.rowId}`
    const currentPiecePosition = getPlayersPiecePositions(playerId);
    let validMove = !currentPiecePosition.includes(tileId);
    return validMove;
}

export class MoveValidator {
    playerId: PlayerIdType;
    currentPosition: BoardPosition;
    boardPosition: BoardPosition;
    movementType: MovementType;
    constructor(id: PlayerIdType, curentPosition: BoardPosition, boardPosition: BoardPosition, moveset: MovementType) {
        this.playerId = id;
        this.currentPosition = curentPosition;
        this.boardPosition = boardPosition;
        this.movementType = moveset
    }
    canMoveLeft() {
        const oppositionPiecePosition = getOppositionPlayersPiecePosition(this.playerId);
        const columnIndexArray: ColumnIndexsArrayType = getColumnIndexArray();
        const piecesOnTheSameRow = oppositionPiecePosition.filter(piece => {
            const {rowId} = separateId(piece);
            return rowId === this.boardPosition.rowId
        }).filter(piece => {
            const {columnId} = separateId(piece);
            const indexOfColumnId = columnIndexArray.indexOf(columnId)
            const indexOfCurrentPositionColumnId = columnIndexArray.indexOf(this.currentPosition.columnId)
            return  indexOfColumnId < indexOfCurrentPositionColumnId;
        })
        return piecesOnTheSameRow;
    }
    canMoveRight() {
        const oppositionPiecePosition = getOppositionPlayersPiecePosition(this.playerId);
        const columnIndexArray: ColumnIndexsArrayType = getColumnIndexArray();
        const piecesOnTheSameRow = oppositionPiecePosition.filter(piece => {
            const {rowId} = separateId(piece);
            return rowId === this.boardPosition.rowId
        }).filter(piece => {
            const {columnId} = separateId(piece);
            const indexOfColumnId = columnIndexArray.indexOf(columnId)
            const indexOfCurrentPositionColumnId = columnIndexArray.indexOf(this.currentPosition.columnId)
            return  indexOfColumnId > indexOfCurrentPositionColumnId;
        })
        return piecesOnTheSameRow;
    }
    canMoveDown() {
        const oppositionPiecePosition = getOppositionPlayersPiecePosition(this.playerId);
        const rowIndexArray: RowIndexsArrayType = getRowIndexArray();
        const piecesOnTheSameColumn = oppositionPiecePosition.filter(piece => {
            const {columnId} = separateId(piece);
            return columnId === this.boardPosition.columnId
        }).filter(piece => {
            const {rowId} = separateId(piece);
            const indexOfRowId = rowIndexArray.indexOf(rowId)
            const indexOfCurrentPositionRowId = rowIndexArray.indexOf(this.currentPosition.rowId)
            return  indexOfRowId > indexOfCurrentPositionRowId;
        })
        return piecesOnTheSameColumn;
    }
    canMoveUp() {
        const oppositionPiecePosition = getOppositionPlayersPiecePosition(this.playerId);
        const rowIndexArray: RowIndexsArrayType = getRowIndexArray();
        const piecesOnTheSameColumn = oppositionPiecePosition.filter(piece => {
            const {columnId} = separateId(piece);
            return columnId === this.boardPosition.columnId
        }).filter(piece => {
            const {rowId} = separateId(piece);
            const indexOfRowId = rowIndexArray.indexOf(rowId)
            const indexOfCurrentPositionRowId = rowIndexArray.indexOf(this.currentPosition.rowId)
            return  indexOfRowId < indexOfCurrentPositionRowId;
        })
        return piecesOnTheSameColumn;
    }
    canMoveDownRight() {
        const offsetRowIdBy = 1;
        const offsetColumnIdBy = -1;
        const oppositionPiecePosition = getOppositionPlayersPiecePosition(this.playerId);
        const previousColumnId = createNewColumnId(this.boardPosition.columnId, offsetColumnIdBy);
        const previousRowId = createNewRowId(this.boardPosition.rowId, offsetRowIdBy);
        const piecesOnThePreviousPosition = oppositionPiecePosition.filter(piece => {
            const {columnId, rowId} = separateId(piece);
            return columnId === previousColumnId && rowId === previousRowId; 
        })
        return piecesOnThePreviousPosition;
    }
    canMoveDownLeft() {
        const offsetRowIdBy = 1;
        const offsetColumnIdBy = 1;
        const oppositionPiecePosition = getOppositionPlayersPiecePosition(this.playerId);
        const previousColumnId = createNewColumnId(this.boardPosition.columnId, offsetColumnIdBy);
        const previousRowId = createNewRowId(this.boardPosition.rowId, offsetRowIdBy);
        const piecesOnThePreviousPosition = oppositionPiecePosition.filter(piece => {
            const {columnId, rowId} = separateId(piece);
            return columnId === previousColumnId && rowId === previousRowId; 
        })
        return piecesOnThePreviousPosition;
    }
    canMoveUpRight() {
        const offsetRowIdBy = -1;
        const offsetColumnIdBy = -1;
        const oppositionPiecePosition = getOppositionPlayersPiecePosition(this.playerId);
        const previousRowId = createNewRowId(this.boardPosition.rowId, offsetRowIdBy);
        const previousColumnId = createNewColumnId(this.boardPosition.columnId, offsetColumnIdBy);
        const piecesOnThePreviousPosition = oppositionPiecePosition.filter(piece => {
            const {columnId, rowId} = separateId(piece);
            return columnId === previousColumnId && rowId === previousRowId; 
        })
        return piecesOnThePreviousPosition;
    }
    canMoveUpLeft() {
        const offsetRowIdBy = -1;
        const offsetColumnIdBy = 1;
        const oppositionPiecePosition = getOppositionPlayersPiecePosition(this.playerId);
        const previousColumnId = createNewColumnId(this.boardPosition.columnId, offsetColumnIdBy);
        const previousRowId = createNewRowId(this.boardPosition.rowId, offsetRowIdBy);
        const piecesOnThePreviousPosition = oppositionPiecePosition.filter(piece => {
            const {columnId, rowId} = separateId(piece);
            return columnId === previousColumnId && rowId === previousRowId; 
        })
        return piecesOnThePreviousPosition;
    }
    validateMove() {
        let validMove: boolean = isAValidMove(this.playerId, this.boardPosition);
        if(!validMove) return validMove;
        const columnIndexArray: ColumnIndexsArrayType = getColumnIndexArray();
        const rowIndexArray: RowIndexsArrayType = getRowIndexArray();
        switch(this.movementType) {
            case "right":
                this.canMoveRight().forEach(tileID => {
                    const {columnId} = separateId(tileID);
                    const indexOfPieceColumnId = columnIndexArray.indexOf(columnId);
                    const indexOfPotentialColumnId = columnIndexArray.indexOf(this.boardPosition.columnId);
                    if(indexOfPieceColumnId < indexOfPotentialColumnId) validMove = false;
                })
                break;
            case "left":
                this.canMoveLeft().forEach(tileID => {
                    const {columnId} = separateId(tileID);
                    const indexOfPieceColumnId = columnIndexArray.indexOf(columnId);
                    const indexOfPotentialColumnId = columnIndexArray.indexOf(this.boardPosition.columnId);
                    if(indexOfPieceColumnId > indexOfPotentialColumnId) validMove = false;
                })
                break;
            case "down": 
                this.canMoveDown().forEach(tileID => {
                    const {rowId} = separateId(tileID);
                    const indexOfPieceRowId = rowIndexArray.indexOf(rowId);
                    const indexOfPotentialRowId = rowIndexArray.indexOf(this.boardPosition.rowId);
                    if(indexOfPieceRowId < indexOfPotentialRowId) validMove = false;
                })
                break;
            case "up": 
                this.canMoveUp().forEach(tileID => {
                    const {rowId} = separateId(tileID);
                    const indexOfPieceRowId = rowIndexArray.indexOf(rowId);
                    const indexOfPotentialRowId = rowIndexArray.indexOf(this.boardPosition.rowId);
                    if(indexOfPieceRowId > indexOfPotentialRowId) validMove = false;
                })
                break;
            case "downRight": 
                if(this.canMoveDownRight().length > 0) validMove = false;
                break;
            case "downLeft": 
                if(this.canMoveDownLeft().length > 0) validMove = false;
                break;
            case "upRight": 
                if(this.canMoveUpRight().length > 0) validMove = false;
                break;
            case "upLeft": 
                if(this.canMoveUpLeft().length > 0) validMove = false;
                break;
        }
        return validMove;
    }
}