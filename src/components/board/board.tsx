import React, { useState } from "react";
import { movePieceLocation } from "../../event handlers/eventhandlers";
import { createNewTileId, getColumnIndexArray, getRowIndexArray } from "../../helperFunctions/helperFunction";
import { displayPieces, displayPawns } from "../../players/playerHelperFunction";
import { ColumnIds, RowIds } from "../../types/boardTypes";
import { EventHandlers, PlayerTurnType } from "../../types/eventHandlersTypes";
import { PieceTemplate } from "../../types/pieceTypes";
import { CheckmateBannerComponent, GameOverComponent, PlayerChangeComponent } from "../banners/banner";
import { SelectANewPiece } from "../newPiece/newPieceSelector";
import { BoardComponent, ChessBoardContainer, ColumnContainter, RowContainter, TileContainer, TileElement } from "../styles/styledComponents";
  
const playerIds = {
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
    const updateCheckmateStatus = () => {
        setCheckmate(prev => !prev);
        setTimeout(() => setCheckmate(prev => !prev), 1250)
    }

    const [gameOver, setGameOver] = useState<boolean> (false);
    const handleGameOver = (): void => {
        setGameOver(prev => !prev)
    }
    const [displayPieceMenu, setDisplayPieceMenu] = useState<PieceTemplate  | null >(null);
    const updateDisplayPieceMenuStatus = (value: PieceTemplate | null): void => {
        setDisplayPieceMenu(value);
    }
    const [playersTurn, setplayersTurn] = useState<PlayerTurnType | null>(null);
    const updatePlayersTurn = (value: number, isTheGameOver: boolean = false): void => {
        let playerTurn: PlayerTurnType = value === 1?
        "Black" : "White";
        setplayersTurn(playerTurn);
        !isTheGameOver && setTimeout(() =>setplayersTurn(null), 1250)
    }
    const eventHandlers: EventHandlers = {
        updateCheckmateStatus: updateCheckmateStatus,
        updateDisplayPieceMenuStatus: updateDisplayPieceMenuStatus,
        changePlayer: updatePlayersTurn,
        updateGameOverStatus: handleGameOver
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
                    onClick={(event: React.MouseEvent) =>  movePieceLocation(event, tileId, eventHandlers)}
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
                {displayPieceMenu && <SelectANewPiece 
                displayPieceMenu={displayPieceMenu} 
                eventHelpers={eventHandlers}
                />}
                <div>
                   { !gameOver && checkmate && <CheckmateBannerComponent player={playersTurn}/>}
                   {playersTurn && !checkmate && <PlayerChangeComponent player={playersTurn} />}
                   {gameOver && playersTurn &&  <GameOverComponent player={playersTurn} />}
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