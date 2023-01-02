import { moveRookandKing, setNewPosition, updateSelectedTilesColour, updateTileColour, validPawnPromotion } from "../helperFunctions/helperFunction";
import { isACastlingMove } from "../pieces/pieces";
import { changeTurn, disablePlayerTurn, getOppositionPlayer, getPlayerById, getPlayersTurn, hasNotSelectedMulitplePieces, indexOfOppositionPieceOnTile, isInCheckmate, removeOppositionPiece } from "../players/players";
import { TileIdsType } from "../types/boardTypes";
import { AddNewPieceHandlerType, EventHandlers } from "../types/eventHandlersTypes";
import { PieceNames, PieceTemplate } from "../types/pieceTypes";

let selectedPiecePreviousTileColour: string;
let previousTileElement: HTMLDivElement; 

export function movePieceLocation (event: React.MouseEvent, tileId: TileIdsType | null, eventHelpers: EventHandlers) {
    const {updateDisplayPieceMenuStatus, updateCheckmateStatus, changePlayer} = eventHelpers;
    const target= event.target as HTMLDivElement;
    if(!tileId) {
        tileId = target.id as TileIdsType;
    }
    let hasNowSelectedAPiece: boolean = false;
    const player = getPlayersTurn();
    if(player.getIsThereTurn()){
        for (const pieces in player.activePieces) {
            const choosenPiece = player.activePieces[pieces as keyof typeof player.activePieces].find(piece =>piece.getCurrentPosition() === tileId);
            if(choosenPiece && hasNotSelectedMulitplePieces(player, tileId)) {
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
            let previouslySelectedPiece: PieceTemplate | undefined;
            for (const pieces in player.activePieces) {
                    previouslySelectedPiece = player.activePieces[pieces as keyof typeof player.activePieces].find((piece: PieceTemplate) => piece.getSelectedStatus() === true);
                    if(previouslySelectedPiece) break;
            }
            if (previouslySelectedPiece) {
                const isMovePossible = previouslySelectedPiece.getAvailableMoves().includes(tileId);
                if(isMovePossible) {
                    let pieceHasMoved: boolean = false;
                    if(isACastlingMove(previouslySelectedPiece, tileId)) pieceHasMoved = moveRookandKing(tileId , previouslySelectedPiece, target, previousTileElement) 
                    else pieceHasMoved = setNewPosition(previouslySelectedPiece,
                        target, previousTileElement);
                    const isOppositionPieceOnTile = pieceHasMoved && indexOfOppositionPieceOnTile(previouslySelectedPiece.playerId, tileId );
                    isOppositionPieceOnTile && removeOppositionPiece(previouslySelectedPiece.playerId, isOppositionPieceOnTile);
                    if(pieceHasMoved) {
                        updateTileColour(previousTileElement, selectedPiecePreviousTileColour)
                        const shouldPromotePawn = validPawnPromotion(previouslySelectedPiece);
                        if(!shouldPromotePawn){
                            changeTurn(player);
                            const nextPlayer = getPlayersTurn();
                            if(isInCheckmate(nextPlayer.id)) {
                                updateCheckmateStatus();
                                changePlayer(nextPlayer.id); 
                            }else changePlayer(nextPlayer.id);
                        } 
                        if(shouldPromotePawn) {
                            disablePlayerTurn(player)
                            updateDisplayPieceMenuStatus(previouslySelectedPiece);
                        }
                    }
                }
            }
        }
    }
}

export function addNewPieceHandler(piece: PieceTemplate | null, pieceName: PieceNames, updateDisplayPieceMenuStatus: AddNewPieceHandlerType) {
    if(piece) {
        const { playerId, currentColumnPosition, currentRowPosition} = piece;
        const pieceTileId = piece.getCurrentPosition();
        const player = getPlayerById(playerId);
        player.removePawn(pieceTileId);
        let newPiece: PieceTemplate | undefined; 
        switch(pieceName) {
            case PieceNames.QUEEN:
                newPiece = player.addNewQueen(currentColumnPosition, currentRowPosition)
                break;
            case PieceNames.ROOK:
                newPiece = player.addNewRook(currentColumnPosition, currentRowPosition)
                break;
            case PieceNames.BISHOP:
                newPiece = player.addNewBishop(currentColumnPosition, currentRowPosition)
                break;
            case PieceNames.KNIGHT:
                newPiece = player.addNewKnight(currentColumnPosition, currentRowPosition)
                break;
        }
        if(newPiece) {
            updateDisplayPieceMenuStatus(null);
            const tileToUpdate = document.getElementById(piece.getCurrentPosition());
            if(tileToUpdate) tileToUpdate.innerHTML = newPiece.getSymbol();
            const oppositionPlayer = getOppositionPlayer(playerId);
            oppositionPlayer.setIsThereTurn(!oppositionPlayer.getIsThereTurn())

        }
    }
}