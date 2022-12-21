import React from "react";
import { displayPawns, displayPieces, movePieceLocation } from "../../pieces/pieces";
import { BoardComponent, ChessBoardContainer, ColumnContainter, RowContainter, TileContainer, TileElement } from "../styles/styledComponents";


const ColumnIndexs =  {
    ColumnA: "a",
    ColumnB: "b",
    ColumnC: "c",
    ColumnD: "d",
    ColumnE: "e",
    ColumnF: "f",
    ColumnG: "g",
    ColumnH: "h"
} as const;

export type ColumnIds = typeof ColumnIndexs [keyof typeof ColumnIndexs];
export const RowIndexs = {
    Row1: "1",
    Row2: "2",
    Row3: "3",
    Row4: "4",
    Row5: "5",
    Row6: "6",
    Row7: "7",
    Row8: "8",
} as const;

export type ColumnIndexsArrayType = ColumnIds[];
export type RowIndexsArrayType = RowIds[];
export const columnIndexsArray: ColumnIndexsArrayType = ["a","b","c", "d","e","f","g", "h"];
export const rowIndexsArray:RowIndexsArrayType = ["8","7","6", "5","4","3","2", "1"];

export type RowIds = typeof RowIndexs [keyof typeof RowIndexs];
  
//I need to address this
export type TileIdsType = `${ColumnIds}${RowIds}`; 

export interface BoardBluePrint {
    //readonly tiles: TileBlueprint[][];
    readonly tileIds: TileIdsType[][]; 
    getTileIds: () => TileIdsType[][];
}

const initialBoard = [
    displayPieces(),
    displayPawns(),
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    ["p","p","p","p","p","p","p","p"],
    ["r","h","b","q","k","b","h","r"],
]


const primaryColour = "white";
const secondaryColour = "brown";

export const Board: React.FC = () => {

    const renderTileComponents = () => {
        //change name
        const test =  initialBoard.map((arr, columnIndex)=> {
            return arr.map((element, rowIndex) => <TileElement 
                id = {columnIndexsArray[rowIndex] + (8 -columnIndex)} 
                onClick={(event: React.MouseEvent) =>  movePieceLocation(event)}
                key={columnIndexsArray[rowIndex] + (8 -columnIndex)}
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
        return columnIndexsArray.map(columnIndex => 
        <BoardComponent key={`column_${columnIndex}`} id={`column_${columnIndex}`}>{columnIndex}</BoardComponent>)
    }
    const displayRowIndexComponent = () => {
        return rowIndexsArray.map(rowIndex => 
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
