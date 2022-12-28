import React, { useState } from "react";
import { movePieceLocation } from "../../event handlers/eventhandlers";
import { getColumnIndexArray, getRowIndexArray } from "../../helperFunctions/helperFunction";
import { player1, displayPawns, displayPieces, player2 } from "../../players/players";
import { TileIdsType } from "../../types/boardTypes";
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
    const [displayPieceMenu ] = useState(false);
    const renderTileComponents = () => {
        //change name
        const test =  initialBoard.map((arr, columnIndex)=> {
            return arr.map((element, rowIndex) => <TileElement 
                id = {getColumnIndexArray()[rowIndex] + (8 -columnIndex)} 
                onClick={(event: React.MouseEvent) =>  movePieceLocation(event, player1, player2)}
                key={getColumnIndexArray()[rowIndex] + (8 -columnIndex)}
                colour={
                    columnIndex % 2 === 0?
                        rowIndex % 2 === 0? 
                            primaryColour : secondaryColour
                        :
                        rowIndex % 2 === 0? 
                            secondaryColour : primaryColour
                    } 
                >
                    {element}
                </TileElement>
            )
        });
        return test;
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
                    {displayPieceMenu && <SelectANewPiece />}
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