import { PieceElement, SelectANewPieceContainer, TestTileContainer } from "./newPieceSelectorStyles"

export const SelectANewPiece: React.FC = () => {
    const options = ["w", "t", "n", "j"];
    const renderPieceOptions = () => {
        const arrayToReturn = []; 
        for (let index = 0; index < options.length; index++) {
            arrayToReturn.push(<PieceElement>{options[index]}</PieceElement>)
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