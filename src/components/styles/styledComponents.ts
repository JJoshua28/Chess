import styled from "styled-components";

interface TileProps {
    colour: string,
}


export const BoardComponent = styled.div`
    display: flex;
    font-size: 2em;
    min-height: 1.5em;
    min-width: 2em;
    justify-content: center;
    align-items: center;
    font-family: sans-serif;
    position:absoute;
`

export const TileElement = styled(BoardComponent)`
    min-width: 1.5em;
    font-size: 3em;
    font-family: pieces;
    background-color: ${(props: TileProps) => props.colour};
`

export const TileContainer = styled.div`
    display: inline-grid;
    width: auto;
    height: auto;
    grid-template-columns: auto auto auto auto auto auto auto auto;
    grid-template-rows: auto auto auto auto auto auto auto auto;
    border: 4px solid black;
    grid-area: main;
`
export const ColumnContainter = styled.div`
    display: inline-grid;
    width: 80%;
    height: auto;
    position: relative;
    left: 9%;
    grid-area: columnIndex;
    grid-template-columns: auto auto auto auto auto auto auto auto;
`
export const RowContainter = styled.div`
    grid-area: rowIndex;
    display: inline-grid;
    width: auto;
    height: 95%;
    grid-template-rows: auto auto auto auto auto auto auto auto;
`


export const ChessBoardContainer = styled.div`
    display: grid;
    height: 75vh;
    position: absolute;
    top: 5vh;
    left: 25vw;
    border: 4px solid black;
    padding: 0px;
    overflow: hidden;
`
/*

//I need to type board
interface Piece {


    getAvailable(board, position);
}

*/