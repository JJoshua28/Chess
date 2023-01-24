import { gameOver, isInCheckmate, moveRookandKing, nextGameState, setNewPosition, updateSelectedTilesColour, updateTileColour } from "../helperFunctions/helperFunction";
import {hasNotSelectedMulitplePieces, indexOfOppositionPieceOnTile, isACastlingMove, promotePawnToNewPiece, removeOppositionPiece } from "../players/playerHelperFunction";
import { getOppositionPlayer, getPlayersTurn } from "../players/players";
import { TileIdsType } from "../types/boardTypes";
import { GameStates, handleGameStateType } from "../types/eventHandlersTypes";
import { PawnTemplate, PieceNames, PieceTemplate } from "../types/pieceTypes";

let selectedPiecePreviousTileColour: string;
let previousTileElement: HTMLDivElement;
let newTileElement: HTMLDivElement;

export function movePieceLocation (event: React.MouseEvent, tileId: TileIdsType | null, gameStateManager: handleGameStateType ) {
    const target= event.target as HTMLDivElement;
    if(!tileId) {
        tileId = target.id as TileIdsType;
    }
    let hasNowSelectedAPiece: boolean = false;
    const currentPlayer = getPlayersTurn();
    if(currentPlayer.getIsThereTurn()){
        for (const pieces in currentPlayer.activePieces) {
            const choosenPiece = currentPlayer.activePieces[pieces as keyof typeof currentPlayer.activePieces].find(piece =>piece.getCurrentPosition() === tileId);
            if(choosenPiece && hasNotSelectedMulitplePieces(currentPlayer.id, tileId)) {
                choosenPiece.setSelected(!choosenPiece.getSelectedStatus());
                if(choosenPiece.getSelectedStatus()) {
                    previousTileElement = target;
                } 
                const hasUpdatedTileColor = updateSelectedTilesColour(target, choosenPiece.getSelectedStatus(), selectedPiecePreviousTileColour)
                if(hasUpdatedTileColor) selectedPiecePreviousTileColour = hasUpdatedTileColor; 
                hasNowSelectedAPiece = true;
            }
        }  
        if(!hasNowSelectedAPiece) {
            newTileElement = target
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
                        pieceHasMoved = moveRookandKing(tileId , previouslySelectedPiece, newTileElement, previousTileElement)
                    } 
                    else {
                        pieceHasMoved = setNewPosition(previouslySelectedPiece,
                        newTileElement, previousTileElement);
                    }
                    const isOppositionPieceOnTile = pieceHasMoved && indexOfOppositionPieceOnTile(previouslySelectedPiece.playerId, tileId );
                    isOppositionPieceOnTile && removeOppositionPiece(previouslySelectedPiece.playerId, isOppositionPieceOnTile);
                    if(pieceHasMoved) {
                        updateTileColour(previousTileElement, selectedPiecePreviousTileColour)
                        nextGameState(previouslySelectedPiece, currentPlayer.id, gameStateManager);
                    }
                }
            }
        }
    }
}

export function handlePawnPromotion(piece: PieceTemplate | null, pieceName: PieceNames, gameStateManager: handleGameStateType) {
    if(piece) {
        const { playerId } = piece;
        const pieceTileId = piece.getCurrentPosition();
        const newPiece = promotePawnToNewPiece(playerId, pieceTileId, pieceName);
        if(newPiece) {
            gameStateManager(GameStates.PAWN_PROMOTION)
            newTileElement.innerHTML = newPiece.getSymbol();
            const oppositionPlayer = getOppositionPlayer(playerId);
            let gameState: GameStates = GameStates.CHANGE_TURN;
            gameState = isInCheckmate(oppositionPlayer.id)? GameStates.CHECKMATE: gameState
            gameState = gameOver(oppositionPlayer.id)? GameStates.GAME_OVER: gameState
            gameStateManager(gameState, oppositionPlayer.id)
            gameState !== GameStates.GAME_OVER && oppositionPlayer.setIsThereTurn(!oppositionPlayer.getIsThereTurn())
        }
    }
}