import React, { useState } from "react";
import { movePieceLocation } from "../../event handlers/eventhandlers";
import { createNewTileId, getColumnIndexArray, getRowIndexArray } from "../../helperFunctions/helperFunction";
import { player1, displayPawns, displayPieces, player2 } from "../../players/players";
import { ColumnIds, RowIds, TileIdsType } from "../../types/boardTypes";
import { EventHandlers, PlayerTurnType } from "../../types/eventHandlersTypes";
import { PieceTemplate } from "../../types/pieceTypes";
import { CheckmateBannerComponent, PlayerChangeComponent } from "../banners/banner";
import { SelectANewPiece } from "../newPiece/newPieceSelector";
import { BoardComponent, ChessBoardContainer, ColumnContainter, RowContainter, TileContainer, TileElement } from "../styles/styledComponents";
  
//I need to address this

export interface BoardBluePrint {
    //readonly tiles: TileBlueprint[][];
    readonly tileIds: TileIdsType[][]; 
    getTileIds: () => TileIdsType[][];
}

const initialBoard = [
    displayPieces(player1),
    displayPawns(player1),
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    displayPawns(player2),
    displayPieces(player2),
]


const primaryColour = "#C5E99B";
const secondaryColour = "#379634";

export const Board: React.FC = () => {
    const [checkmate, setCheckmate] = useState<boolean> (false);
    const updateCheckmateStatus = () => {
        setCheckmate(prev => !prev);
        setTimeout(() => setCheckmate(prev => !prev), 1250)
    }
    const [displayPieceMenu, setDisplayPieceMenu] = useState<PieceTemplate  | null >(null);
    const updateDisplayPieceMenuStatus = (value: PieceTemplate | null): void => {
        setDisplayPieceMenu(value);
    }
    const [playersTurn, setplayersTurn] = useState<PlayerTurnType | null>(null);
    const updatePlayersTurn = (value: number): void => {
        let playerTurn: PlayerTurnType = value === 1?
        "Black" : "White";
        setplayersTurn(playerTurn);
        setTimeout(() => setplayersTurn(null), 1250)
    }
    const eventhandlers: EventHandlers = {
        updateCheckmateStatus: updateCheckmateStatus,
        updateDisplayPieceMenuStatus: updateDisplayPieceMenuStatus,
        changePlayer: updatePlayersTurn
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
                    onClick={(event: React.MouseEvent) =>  movePieceLocation(event, tileId, eventhandlers)}
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
                updateDisplayPieceMenuStatus={updateDisplayPieceMenuStatus}
                />}
                <div>
                   { checkmate && <CheckmateBannerComponent player={playersTurn}/>}
                   {playersTurn && !checkmate && <PlayerChangeComponent player={playersTurn} />}
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