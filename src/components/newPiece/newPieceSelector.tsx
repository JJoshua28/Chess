import { addNewPieceHandler } from "../../event handlers/eventhandlers";
import { playersPieceColour } from "../../pieces/pieces";
import { EventHandlers } from "../../types/eventHandlersTypes";
import { PieceDetail, PieceNames, PieceTemplate, PlayerIdType } from "../../types/pieceTypes";
import { PieceElement, SelectANewPieceContainer, TestTileContainer } from "./newPieceSelectorStyles"
const queenDetails = (playerId: PlayerIdType): PieceDetail => {
    const pieceColour = playersPieceColour(playerId); 
    return {
        name: PieceNames.QUEEN,
        symbol: pieceColour.queen,
    }
}

const rookDetails = (playerId: PlayerIdType): PieceDetail => {
    const pieceColour = playersPieceColour(playerId); 
    return {
        name: PieceNames.ROOK,
        symbol: pieceColour.rook,
    }
}

const bishopDetails = (playerId: PlayerIdType): PieceDetail => {
    const pieceColour = playersPieceColour(playerId); 
    return {
        name: PieceNames.BISHOP,
        symbol: pieceColour.bishop,
    }
}

const knightDetails = (playerId: PlayerIdType): PieceDetail => {
    const pieceColour = playersPieceColour(playerId); 
    return {
        name: PieceNames.KNIGHT,
        symbol: pieceColour.knight
    }
}

export const SelectANewPiece: React.FC<{displayPieceMenu: PieceTemplate, eventHelpers: EventHandlers}> = ({displayPieceMenu, eventHelpers }) => {
    const options = [queenDetails(displayPieceMenu.playerId), rookDetails(displayPieceMenu.playerId),
         bishopDetails(displayPieceMenu.playerId), knightDetails(displayPieceMenu.playerId)];
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