import styled from "styled-components";
import { BoardComponent } from "../styles/styledComponents";

export const SelectANewPieceContainer = styled.div`
    display: grid;
    height: 19%;
    width: 70%;
    position: absolute;
    top: 35%;
    left: 15%;
    overflow: hidden;
    background-color: #ffffff;
    border-radius: 10px;
    text-align: center;
`

export const PieceElement = styled(BoardComponent)`
    min-width: 0.75em;
    min-height: 1em;
    font-size: 3em;
    font-family: pieces;   
    margin: auto;
`

export const TestTileContainer = styled.div`
    display: inline-grid;
    width: 90%;
    height: auto;
    grid-template-columns: auto auto auto auto;
    grid-template-rows: auto;
    margin: auto;

`
