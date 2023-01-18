import { addNewPieceHandler } from "../../event handlers/eventhandlers";
import { EventHandlers } from "../../types/eventHandlersTypes";
import { PieceDetail, PieceNames, PieceSymbol, PieceTemplate } from "../../types/pieceTypes";
import { PieceElement, SelectANewPieceContainer, TestTileContainer } from "./newPieceSelectorStyles"
const queenDetails: PieceDetail = {
    name: PieceNames.QUEEN,
    symbol: PieceSymbol.QUEEN
}

const rookDetails: PieceDetail = {
    name: PieceNames.ROOK,
    symbol: PieceSymbol.ROOK
}

const bishopDetails: PieceDetail = {
    name: PieceNames.BISHOP,
    symbol: PieceSymbol.BISHOP
}

const knightDetails: PieceDetail = {
    name: PieceNames.KNIGHT,
    symbol: PieceSymbol.KNIGHT
}

export const SelectANewPiece: React.FC<{displayPieceMenu: PieceTemplate | null, eventHelpers: EventHandlers}> = ({displayPieceMenu, eventHelpers }) => {
    const options = [queenDetails, rookDetails, bishopDetails, knightDetails];
    const renderPieceOptions = () => {
        const arrayToReturn = []; 
        for (let index = 0; index < options.length; index++) {
            arrayToReturn.push(<PieceElement key={index} onClick={() => addNewPieceHandler(displayPieceMenu, 
                options[index].name, 
                eventHelpers)}>
                    {options[index].symbol}</PieceElement>)
        }
        return arrayToReturn;
    }
    return (
        <>
            <SelectANewPieceContainer>
                <h2>Choose a new Piece</h2>
                <TestTileContainer>
                    {renderPieceOptions()}
                </TestTileContainer>
            </SelectANewPieceContainer>

        </>
    )
}