import React, { useState } from "react";
import { movePieceLocation } from "../../event handlers/eventhandlers";
import { createNewTileId, getColumnIndexArray, getRowIndexArray } from "../../helperFunctions/helperFunction";
import { returnPlayersPieceDetails } from "../../pieces/piecesHelper";
import { displayPieces, displayPawns } from "../../players/playerHelperFunction";
import { ColumnIds, RowIds } from "../../types/boardTypes";
import { GameStates, PlayerTurnType } from "../../types/eventHandlersTypes";
import { PieceTemplate, PlayerIdType } from "../../types/pieceTypes";
import { CheckmateBanner, GameOverBanner, NextPlayersTurnBanner } from "../banners/banner";
import { PawnPromotionMenu } from "../newPiece/newPieceSelector";
import { BoardComponent, ChessBoardContainer, ColumnContainter, RowContainter, TileContainer, TileElement } from "../styles/styledComponents";
  
const playerIds: {
    player1: PlayerIdType, 
    player2: PlayerIdType
} = {
    player1: 1,
    player2: 2,
} as const;


const initialBoard = [
    displayPieces(playerIds.player1),
    displayPawns(playerIds.player1),
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    displayPawns(playerIds.player2),
    displayPieces(playerIds.player2),
]

const primaryColour = "#C5E99B";
const secondaryColour = "#379634";

export const Board: React.FC = () => {
    const [checkmate, setCheckmate] = useState<boolean> (false);
    const [displayBanner, setDisplayBanner] = useState<boolean> (false);
    const [gameOver, setGameOver] = useState<boolean> (false);
    const [displayPieceMenu, setDisplayPieceMenu] = useState<PieceTemplate  | null >(null);
    const [playersTurn, setplayersTurn] = useState<PlayerTurnType>("White");


    const handleNewGameState = (gameState: GameStates, playerId?: PlayerIdType, piece?: PieceTemplate) => {
        if(playerId && gameState !== GameStates.GAME_OVER && gameState !== GameStates.PAWN_PROMOTION) {
            const playerDetails  = returnPlayersPieceDetails(playerId)
            setplayersTurn(playerDetails.pieceColour)
        }
        switch (gameState) {
            case GameStates.CHANGE_TURN:
                setDisplayBanner(prev => !prev)
                setTimeout(() => setDisplayBanner(prev => !prev), 1250)
                break;
            case GameStates.CHECKMATE: 
                setCheckmate(prev => !prev)
                setTimeout(() => setCheckmate(prev => !prev), 1250)
                break;
            case GameStates.PAWN_PROMOTION:
                displayPieceMenu && setDisplayPieceMenu(null) 
                piece && !displayPieceMenu && setDisplayPieceMenu(piece)
                break
            case GameStates.GAME_OVER:
                setGameOver(true)
                break
        }

    }

    const renderTileComponents = () => {
        //change name
        const initialChessBoard =  initialBoard.map((arr, rowIndex)=> {
            return arr.map((element, tileIndex) => {
                const columnId: ColumnIds = getColumnIndexArray()[tileIndex];
                const rowId: RowIds =  getRowIndexArray()[rowIndex];
                const tileId = createNewTileId(columnId, rowId);
                return <TileElement 
                    id = {tileId as string} 
                    onClick={(event: React.MouseEvent) =>  movePieceLocation(event, tileId, handleNewGameState)}
                    key={tileId}
                    colour={
                        rowIndex % 2 === 0?
                            tileIndex % 2 === 0? 
                                primaryColour : secondaryColour
                            :
                            tileIndex % 2 === 0? 
                                secondaryColour : primaryColour
                        } 
                    >
                        {element}
                </TileElement>
            })
        });
        return initialChessBoard;
    }
    const displayColumnIndexComponent = () => {
        return getColumnIndexArray().map(columnIndex => 
        <BoardComponent key={`column_${columnIndex}`} id={`column_${columnIndex}`}>{columnIndex}</BoardComponent>)
    }
    const displayRowIndexComponent = () => {
        return getRowIndexArray().map(rowIndex => 
        <BoardComponent key={`row_${rowIndex}`} id={`row_${rowIndex}`}>{rowIndex}</BoardComponent>)
    }
    return (
        <>
            <ChessBoardContainer>
                <div>
                    <ColumnContainter id="row_container">
                        {displayColumnIndexComponent()}
                    </ColumnContainter>
                </div>
                {displayPieceMenu && <PawnPromotionMenu 
                piece={displayPieceMenu} 
                gameStateManager={handleNewGameState}
                />}
                <div>
                   {checkmate && <CheckmateBanner player={playersTurn}/>}
                   {displayBanner && <NextPlayersTurnBanner player={playersTurn} />}
                   {gameOver && <GameOverBanner player={playersTurn} />}
                </div>
                <div>
                    <RowContainter>
                        {displayRowIndexComponent()}
                    </RowContainter>
                    <TileContainer id="mainBoard">
                        {renderTileComponents()}
                    </TileContainer>
                    <RowContainter>
                        {displayRowIndexComponent()}
                    </RowContainter>
                </div>
                <div>
                    <ColumnContainter>
                        {displayColumnIndexComponent()}
                    </ColumnContainter>
                </div>
            </ChessBoardContainer>
        </>
    )
}    