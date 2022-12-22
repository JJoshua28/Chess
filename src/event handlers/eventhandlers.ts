import { setNewPosition } from "../helperFunctions/helperFunction";
import { changeTurn, hasNotSelectedAPiece } from "../players/players";
import { TileIdsType } from "../types/boardTypes";
import { PieceTemplate } from "../types/pieceTypes";
import { PlayerTemplate } from "../types/playersTypes";

export function movePieceLocation ({target}: React.MouseEvent, player1: PlayerTemplate, player2: PlayerTemplate) {
    const {id} = target as HTMLDivElement;
    let hasNowSelectedAPiece: boolean = false;
    const player = player1.getIsThereTurn()? player1 : player2;
    if(player.getIsThereTurn()){
        for (const pieces in player.activePieces) {
            const choosenPiece = player.activePieces[pieces as keyof typeof player.activePieces].find(piece =>piece.getCurrentPosition() === id);
            if(choosenPiece && hasNotSelectedAPiece(player, id as TileIdsType)) {
                console.log("selected status: " + choosenPiece.getSelectedStatus() + " for " + choosenPiece.type.name)
                choosenPiece.setSelected(!choosenPiece.getSelectedStatus());
                hasNowSelectedAPiece = true;
            }
        }  
        if(!hasNowSelectedAPiece) {
            let previouslySelectedPiece: PieceTemplate | null = null;
            for (const pieces in player.activePieces) {
                if (!previouslySelectedPiece) {
                    [previouslySelectedPiece] = player.activePieces[pieces as keyof typeof player.activePieces].filter((piece: PieceTemplate) =>piece.getSelectedStatus() === true);
                }
            }
            if (previouslySelectedPiece) {
                const isMovePossible = previouslySelectedPiece.getAvailableMoves().includes(id as TileIdsType)
                if(isMovePossible) {
                    setNewPosition(previouslySelectedPiece,
                    target as HTMLDivElement);
                    changeTurn(player);
                }
            }
        }
    }
}