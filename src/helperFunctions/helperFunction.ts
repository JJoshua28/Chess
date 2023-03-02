import { addTemporaryRemovedPiece, changeTurn, disablePlayerTurn, getOppositionPlayersPossibleCheckmatePositions, removePieceOnCheckmate } from "../players/playerHelperFunction";
import { getOppositionPlayer, getPlayerById } from "../players/players";
import { BoardPosition, ColumnIds, ColumnIndexsArrayType, RowIds, RowIndexsArrayType, TileData, TileIdsType } from "../types/boardTypes";
import { GameStates, HandleGameStateType, HandleTilePieceUpdate } from "../types/eventHandlersTypes";
import { ActivePowerPieceKeys, PieceNames, PieceTemplate, PlayerIdType } from "../types/pieceTypes";

export function getColumnIndexArray(): ColumnIndexsArrayType {
    return ["a","b","c", "d","e","f","g", "h"];
}
export function getRowIndexArray(): RowIndexsArrayType {
    return ["8","7","6", "5","4","3","2", "1"];
}

export function separateId(id: TileIdsType): BoardPosition {
    const splitIndex = id.length / 2;
    const columnId = id.slice(0, splitIndex);
    const rowId = id.slice(splitIndex, id.length);
    return {
        columnId: columnId as ColumnIds,
        rowId: rowId as RowIds
    }
}

export function isInCheckmate(playerId: PlayerIdType): boolean {
    const player = getPlayerById(playerId);
    const [king] = player.activePieces.king
    const oppositionPossiblePositions = getOppositionPlayersPossibleCheckmatePositions(playerId);
    return oppositionPossiblePositions.includes(king.getCurrentPosition())
}

export function createNewRowId (rowId: RowIds, offSetBy: number): RowIds | null {
    let rowIdNumber = parseInt(rowId); 
    if((rowIdNumber + offSetBy) > getRowIndexArray().length || (rowIdNumber + offSetBy ) < 1) return null;
   
    rowIdNumber += offSetBy;
    return rowIdNumber.toString() as RowIds;
}

export function createNewColumnId (columnId: ColumnIds, offSetBy: number): ColumnIds | null {
    let columnIdIndex = getColumnIndexArray().indexOf(columnId);
    if ((columnIdIndex +  offSetBy) < 0 || (columnIdIndex +  offSetBy) >= getColumnIndexArray().length) return null;    
    columnIdIndex += offSetBy;
    return getColumnIndexArray()[columnIdIndex] as ColumnIds;
}

function validateColumnId(columnId: ColumnIds): columnId is ColumnIds{
    return getColumnIndexArray().includes(columnId);
}

function validateRowId(rowId: RowIds): rowId is RowIds{
    return getRowIndexArray().includes(rowId);
}

export function createNewTileId(columnId: ColumnIds, rowId: RowIds): TileIdsType | null {
    if(validateColumnId(columnId) && validateRowId(rowId)) return `${columnId}${rowId}` as TileIdsType;
    return null
}

export function setNewPosition(choosenPiece: PieceTemplate, newTileId: TileIdsType, previousTileId: TileIdsType, updateTilePiece: HandleTilePieceUpdate): boolean {
    const isOppositionPieceOnTile = removePieceOnCheckmate(choosenPiece.playerId, newTileId)
    choosenPiece.setCurrentPosition(separateId(newTileId));
    const checkmate = isInCheckmate(choosenPiece.playerId)
      isOppositionPieceOnTile && addTemporaryRemovedPiece(isOppositionPieceOnTile.piece, isOppositionPieceOnTile.pieceLocation)
    if(!checkmate) {
        if(!choosenPiece.hasMoved) choosenPiece.hasMoved = true; 
        updateTilePiece(previousTileId, null);
        updateTilePiece(newTileId, choosenPiece.getSymbol());
        choosenPiece.getSelectedStatus() && choosenPiece.setSelected(!choosenPiece.getSelectedStatus());
        return true
    }
    choosenPiece.setCurrentPosition(separateId(previousTileId));
    return false;
}

export function validPawnPromotion(piece: PieceTemplate): boolean {
    if(!(piece.type.name === PieceNames.PAWN)) return false;
    switch (piece.playerId) {
        case 1:
            if(piece.currentRowPosition === "1") return true
            break;
        case 2:
            if(piece.currentRowPosition === "8") return true
            break;
    }
    return false
}

function setKingAndRooksPosition(king:PieceTemplate, rook: PieceTemplate,
     kingsNewTile: TileData, rooksNewTileId: TileIdsType, updateTilePiece: HandleTilePieceUpdate) {
    const kingsCurrentPosition = king.getCurrentPosition();
    const rooksCurrentPosition = rook.getCurrentPosition();
    king.setCurrentPosition(separateId(kingsNewTile.tileId));
    rook.setCurrentPosition(separateId(rooksNewTileId))
    const checkmate = isInCheckmate(king.playerId)
    if(!checkmate) {
        king.hasMoved = true; 
        rook.hasMoved = true;
        //removes the kings and rooks piece value from the old tiles
        updateTilePiece(rooksCurrentPosition, null)
        updateTilePiece(kingsCurrentPosition, null) 
        //updates the piece value of the king and rooks new tile
        //address this
        updateTilePiece(kingsNewTile.tileId, king.getSymbol())
        updateTilePiece(rooksNewTileId, rook.getSymbol())
        king.getSelectedStatus() && king.setSelected(!king.getSelectedStatus());
        return true
    } else {
        king.setCurrentPosition(separateId(kingsCurrentPosition));
        rook.setCurrentPosition(separateId(rooksCurrentPosition))
    }
    return false;
}

export function moveRookandKing (id: TileIdsType, king: PieceTemplate, KingsTileData: TileData, updateTilePiece: HandleTilePieceUpdate): boolean {
    const player = getPlayerById(king.playerId)
    const {columnId, rowId} = separateId(id);
    const columnIdIndexArray = getColumnIndexArray();
    const indexOfColumnId = columnIdIndexArray.indexOf(columnId)
    const indexOfKingsColumnId = columnIdIndexArray.indexOf(king.currentColumnPosition);
    let rookToMove: PieceTemplate | undefined;
    let rooksNewColumnId: ColumnIds | null = null;
    if((indexOfKingsColumnId + 2) === indexOfColumnId) {
        rookToMove = player.activePieces.rooks.find(rook => {
            const columnIdIndexOfRook = columnIdIndexArray.indexOf(rook.currentColumnPosition);
            return !rook.hasMoved && columnIdIndexOfRook > indexOfColumnId; 
        })
        rooksNewColumnId = rookToMove? createNewColumnId(columnId, -1) : null;
    } 
    if ((indexOfKingsColumnId - 2) === indexOfColumnId) {
        rookToMove = player.activePieces.rooks.find(rook => {
            const columnIdIndexOfRook = columnIdIndexArray.indexOf(rook.currentColumnPosition);
            return !rook.hasMoved && columnIdIndexOfRook < indexOfColumnId; 
        })
        rooksNewColumnId = rookToMove? createNewColumnId(columnId, 1) : null;
 
    };
    if (rooksNewColumnId && rookToMove) {
        const rooksNewTileId = createNewTileId(rooksNewColumnId, rowId);
        const hasSetKingsPosition = rooksNewTileId && setKingAndRooksPosition(king, rookToMove, KingsTileData, rooksNewTileId, updateTilePiece);
        if(hasSetKingsPosition) return true;
    }
    return false;
}

export function gameOver(playerId: PlayerIdType) {
    const player = getPlayerById(playerId);
    let endGame = true;
    for (const pieces in player.activePieces) {
        // eslint-disable-next-line no-loop-func
        player.activePieces[pieces as ActivePowerPieceKeys].every(piece => {
            const i = piece.getAvailableMoves()
            return i
        .every(potentialPosition => {
            const piecesCurrentPosition = piece.getCurrentPosition();
            piece.setCurrentPosition(separateId(potentialPosition))
            const oppositionPieceOnTile = removePieceOnCheckmate(piece.playerId, potentialPosition)
            const checkmate = isInCheckmate(player.id)
            piece.setCurrentPosition(separateId(piecesCurrentPosition))
            oppositionPieceOnTile && addTemporaryRemovedPiece(oppositionPieceOnTile.piece, oppositionPieceOnTile.pieceLocation);
            if(!checkmate) {
                endGame = false;
                return false;
            }
            return true;
        })})
        if(!endGame) {
            return false;
        }
    }
   //
    return endGame;
}

export function nextGameState (previouslySelectedPiece: PieceTemplate, playerId: PlayerIdType, gameStateManager: HandleGameStateType) {
    const player = getPlayerById(playerId)
    const otherPlayer = getOppositionPlayer(playerId)
    let gameState = GameStates.CHANGE_TURN;
    gameState = isInCheckmate(otherPlayer.id)? GameStates.CHECKMATE : gameState;
    gameState = gameOver(otherPlayer.id)? GameStates.GAME_OVER : gameState;
    gameState = validPawnPromotion(previouslySelectedPiece)? GameStates.PAWN_PROMOTION : gameState;
    switch (gameState) {
        case GameStates.CHANGE_TURN:
        case GameStates.CHECKMATE:
            gameStateManager(gameState, otherPlayer.id)
            changeTurn(player.id);
            break;
        default:
            disablePlayerTurn(player.id)
            gameStateManager(gameState, playerId, previouslySelectedPiece);

    } 
}

