import { gameOver, hasSelectedAPiece, isInCheckmate, moveRookandKing, nextGameState, setNewPosition,  updatedPiecesSelectedStatus,  updateTileColour } from "../helperFunctions/helperFunction";
import { indexOfOppositionPieceOnTile, isACastlingMove, promotePawnToNewPiece, removeOppositionPiece } from "../players/playerHelperFunction";
import { getOppositionPlayer, getPlayersTurn } from "../players/players";
import { TileIdsType } from "../types/boardTypes";
import { GameStates, handleGameStateType } from "../types/eventHandlersTypes";
import { PawnTemplate, PieceNames, PieceTemplate } from "../types/pieceTypes";

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
        const hasUpdatedPiecesSelectedStatus = updatedPiecesSelectedStatus(currentPlayer.id, tileId, target)
        const isAPieceSelected = hasSelectedAPiece(currentPlayer.id)
        if(hasUpdatedPiecesSelectedStatus) {
            hasNowSelectedAPiece = true;
            if(isAPieceSelected) previousTileElement = target; 
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
                    let pieceHasMoved: boolean = isACastlingMove(previouslySelectedPiece, tileId)? 
                        moveRookandKing(tileId , previouslySelectedPiece, newTileElement, previousTileElement) :
                        setNewPosition(previouslySelectedPiece,
                        newTileElement, previousTileElement);
                    const isOppositionPieceOnTile = pieceHasMoved && indexOfOppositionPieceOnTile(previouslySelectedPiece.playerId, tileId );
                    isOppositionPieceOnTile && removeOppositionPiece(previouslySelectedPiece.playerId, isOppositionPieceOnTile);
                    if(pieceHasMoved) {
                        updateTileColour(previousTileElement)
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