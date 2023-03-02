import { gameOver, isInCheckmate, moveRookandKing, nextGameState, setNewPosition, } from "../helperFunctions/helperFunction";
import {hasNotSelectedMulitplePieces, indexOfOppositionPieceOnTile, isACastlingMove, promotePawn, removeOppositionPiece } from "../players/playerHelperFunction";
import { getOppositionPlayer, getPlayersTurn } from "../players/players";
import { TileData, TileIdsType } from "../types/boardTypes";
import { GameStates, HandleGameStateType, TileEventHelperFunctions } from "../types/eventHandlersTypes";
import { PawnTemplate, PieceNames, PieceTemplate } from "../types/pieceTypes";

let selectedPiecePreviousTileColour: string;
const selectedPieceTileColour = "red";
let previousTileElementId: TileIdsType;

export function movePieceLocation (tileEventHelpers: TileEventHelperFunctions, tile: TileData, gameStateManager: HandleGameStateType ) {
    const {updateTileColour, updateTilePiece} = tileEventHelpers;
    const {tileId }  = tile as {tileId: TileIdsType};
    let hasNowSelectedAPiece: boolean = false;
    const currentPlayer = getPlayersTurn();
    if(currentPlayer.getIsThereTurn()){
        for (const pieces in currentPlayer.activePieces) {
            const choosenPiece = currentPlayer.activePieces[pieces as keyof typeof currentPlayer.activePieces].find(piece =>piece.getCurrentPosition() === tileId);
            if(choosenPiece && hasNotSelectedMulitplePieces(currentPlayer.id, tileId)) {
                choosenPiece.setSelected(!choosenPiece.getSelectedStatus());
                if(choosenPiece.getSelectedStatus()) {
                    previousTileElementId = tileId;
                    selectedPiecePreviousTileColour = tile.colour
                    updateTileColour(tileId, selectedPieceTileColour) 
                    hasNowSelectedAPiece = true;
                    
                } else {
                    updateTileColour(tileId, selectedPiecePreviousTileColour)
                }
                break;
            }
        }  
        if(!hasNowSelectedAPiece) {
            let previouslySelectedPiece: PieceTemplate | PawnTemplate | undefined;
            for (const pieces in currentPlayer.activePieces) {
                    previouslySelectedPiece = currentPlayer.activePieces[pieces as keyof typeof currentPlayer.activePieces].find((piece: PieceTemplate ) => piece.getSelectedStatus() === true);
                    if(previouslySelectedPiece) break;
            }
            if (previouslySelectedPiece) {
                const isMovePossible = previouslySelectedPiece.getAvailableMoves().includes(tileId);
                if(isMovePossible) {
                    let pieceHasMoved: boolean = false;
                    if(isACastlingMove(previouslySelectedPiece, tileId)) {
                        
                        pieceHasMoved = moveRookandKing(previouslySelectedPiece, tile, updateTilePiece);
                    } 
                    else {
                        pieceHasMoved = setNewPosition(previouslySelectedPiece,
                        tileId, previousTileElementId, updateTilePiece);
                    }
                    const isOppositionPieceOnTile = pieceHasMoved && indexOfOppositionPieceOnTile(previouslySelectedPiece.playerId, tileId );
                    isOppositionPieceOnTile && removeOppositionPiece(previouslySelectedPiece.playerId, isOppositionPieceOnTile);
                    if(pieceHasMoved) {
                        updateTileColour(previousTileElementId, selectedPiecePreviousTileColour) 
                        nextGameState(previouslySelectedPiece, currentPlayer.id, gameStateManager);
                    }
                }
            }
        }
    }
    console.log("close")
}

export function addNewPieceHandler(piece: PieceTemplate | null, pieceName: PieceNames, gameStateManager: HandleGameStateType) {
    if(piece) {
        const {playerId} = piece;
        const newPiece = promotePawn(piece, pieceName)
        if(newPiece) {
            gameStateManager(GameStates.PAWN_PROMOTION)
            const tileToUpdate = document.getElementById(piece.getCurrentPosition());
            if(tileToUpdate) tileToUpdate.innerHTML = newPiece.getSymbol();
            const oppositionPlayer = getOppositionPlayer(playerId);
            let gameState: GameStates = GameStates.CHANGE_TURN;
            gameState = isInCheckmate(oppositionPlayer.id)? GameStates.CHECKMATE: gameState
            gameState = gameOver(oppositionPlayer.id)? GameStates.GAME_OVER: gameState
            gameStateManager(gameState, oppositionPlayer.id)
            gameState !== GameStates.GAME_OVER && oppositionPlayer.setIsThereTurn(!oppositionPlayer.getIsThereTurn())
        }
    }
}