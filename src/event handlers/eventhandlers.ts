import { moveRookandKing, setNewPosition, validPawnPromotion } from "../helperFunctions/helperFunction";
import { isACastlingMove } from "../pieces/pieces";
import { changeTurn, disablePlayerTurn, getOppositionPlayer, getPlayerById, getPlayersTurn, hasNotSelectedAPiece, indexOfOppositionPieceOnTile, removeOppositionPiece } from "../players/players";
import { TileIdsType } from "../types/boardTypes";
import { AddNewPieceHandlerType, EventHandlers } from "../types/eventHandlersTypes";
import { PieceNames, PieceTemplate } from "../types/pieceTypes";

export function movePieceLocation ({target}: React.MouseEvent, eventHandlers: EventHandlers) {
    const {updateDisplayPieceMenuStatus, updateCheckmateStatus, changePlayer} = eventHandlers;
    const {id} = target as HTMLDivElement;
    let hasNowSelectedAPiece: boolean = false;
    const player = getPlayersTurn();
    if(player.getIsThereTurn()){
        for (const pieces in player.activePieces) {
            const choosenPiece = player.activePieces[pieces as keyof typeof player.activePieces].find(piece =>piece.getCurrentPosition() === id);
            if(choosenPiece && hasNotSelectedAPiece(player, id as TileIdsType)) {
                choosenPiece.setSelected(!choosenPiece.getSelectedStatus());
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
                const isMovePossible = previouslySelectedPiece.getAvailableMoves().includes(id as TileIdsType)
                if(isMovePossible) {
                    const isOppositionPieceOnTile = indexOfOppositionPieceOnTile(previouslySelectedPiece.playerId, id as TileIdsType);
                    isOppositionPieceOnTile && removeOppositionPiece(previouslySelectedPiece.playerId, isOppositionPieceOnTile);
                    isACastlingMove(previouslySelectedPiece, id as TileIdsType)? 
                        moveRookandKing(id as TileIdsType, previouslySelectedPiece, target as HTMLDivElement) :
                        setNewPosition(previouslySelectedPiece,
                    target as HTMLDivElement);
                    const shouldPromotePawn =  validPawnPromotion(previouslySelectedPiece);
                    if(!shouldPromotePawn){
                        changeTurn(player);
                        const nextPlayersTurn = getPlayersTurn(); 
                        changePlayer(nextPlayersTurn.id);
                    } 
                    if(shouldPromotePawn) {
                        disablePlayerTurn(player)
                        updateDisplayPieceMenuStatus(previouslySelectedPiece);
                    }
                }
            }
            false && updateCheckmateStatus();
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