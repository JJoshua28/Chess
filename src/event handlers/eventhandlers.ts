import { gameOver, isInCheckmate, moveRookandKing, setNewPosition, updateSelectedTilesColour, updateTileColour, validPawnPromotion } from "../helperFunctions/helperFunction";
import { changeTurn, disablePlayerTurn, hasNotSelectedMulitplePieces, indexOfOppositionPieceOnTile, isACastlingMove, removeOppositionPiece } from "../players/playerHelperFunction";
import { getOppositionPlayer, getPlayerById, getPlayersTurn } from "../players/players";
import { TileIdsType } from "../types/boardTypes";
import { EventHandlers } from "../types/eventHandlersTypes";
import { PawnTemplate, PieceNames, PieceTemplate } from "../types/pieceTypes";

let selectedPiecePreviousTileColour: string;
let previousTileElement: HTMLDivElement; 

export function movePieceLocation (event: React.MouseEvent, tileId: TileIdsType | null, eventHelpers: EventHandlers) {
    const {updateDisplayPieceMenuStatus, updateCheckmateStatus, changePlayer, updateGameOverStatus} = eventHelpers;
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
                        pieceHasMoved = moveRookandKing(tileId , previouslySelectedPiece, target, previousTileElement)
                    } 
                    else {
                        pieceHasMoved = setNewPosition(previouslySelectedPiece,
                        target, previousTileElement);
                    }
                    const isOppositionPieceOnTile = pieceHasMoved && indexOfOppositionPieceOnTile(previouslySelectedPiece.playerId, tileId );
                    isOppositionPieceOnTile && removeOppositionPiece(previouslySelectedPiece.playerId, isOppositionPieceOnTile);
                    if(pieceHasMoved) {
                        updateTileColour(previousTileElement, selectedPiecePreviousTileColour)
                        const shouldPromotePawn = validPawnPromotion(previouslySelectedPiece);
                        if(!shouldPromotePawn){
                            changeTurn(currentPlayer.id);
                            const nextPlayer = getPlayersTurn();
                            const isTheGameOver = gameOver(nextPlayer.id);
                            if(isInCheckmate(nextPlayer.id)) {
                                if(isTheGameOver) {
                                    disablePlayerTurn(nextPlayer.id)
                                    updateGameOverStatus()
                                }else {
                                    updateCheckmateStatus();
                                }
                            };
                            !isTheGameOver && changePlayer(nextPlayer.id);
                            isTheGameOver && changePlayer(currentPlayer.id, isTheGameOver);
                        } 
                        if(shouldPromotePawn) {
                            disablePlayerTurn(currentPlayer.id)
                            updateDisplayPieceMenuStatus(previouslySelectedPiece);
                        }
                    }
                }
            }
        }
    }
}

export function addNewPieceHandler(piece: PieceTemplate | null, pieceName: PieceNames, eventHelpers: EventHandlers) {
    const {updateDisplayPieceMenuStatus, updateCheckmateStatus, changePlayer, updateGameOverStatus} = eventHelpers
    if(piece) {
        const { playerId, currentColumnPosition, currentRowPosition} = piece;
        const pieceTileId = piece.getCurrentPosition();
        const currentPlayer = getPlayerById(playerId);
        currentPlayer.removePawn(pieceTileId);
        let newPiece: PieceTemplate | undefined; 
        switch(pieceName) {
            case PieceNames.QUEEN:
                newPiece = currentPlayer.addNewQueen(currentColumnPosition, currentRowPosition)
                break;
            case PieceNames.ROOK:
                newPiece = currentPlayer.addNewRook(currentColumnPosition, currentRowPosition)
                break;
            case PieceNames.BISHOP:
                newPiece = currentPlayer.addNewBishop(currentColumnPosition, currentRowPosition)
                break;
            case PieceNames.KNIGHT:
                newPiece = currentPlayer.addNewKnight(currentColumnPosition, currentRowPosition)
                break;
        }
        if(newPiece) {
            updateDisplayPieceMenuStatus(null);
            const tileToUpdate = document.getElementById(piece.getCurrentPosition());
            if(tileToUpdate) tileToUpdate.innerHTML = newPiece.getSymbol();
            const oppositionPlayer = getOppositionPlayer(playerId);
            const isTheGameOver = gameOver(oppositionPlayer.id);
            const inCheckmate = isInCheckmate(oppositionPlayer.id) 
            if(inCheckmate && isTheGameOver) {
                updateGameOverStatus()
                changePlayer(currentPlayer.id, isTheGameOver)
            };
            oppositionPlayer.setIsThereTurn(!oppositionPlayer.getIsThereTurn())
            changePlayer(oppositionPlayer.id)
            inCheckmate && updateCheckmateStatus();
        }
    }
}