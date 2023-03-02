import React, { useEffect, useState } from "react";
import { movePieceLocation } from "../../event handlers/eventhandlers";
import { createNewTileId, getColumnIndexArray, getRowIndexArray } from "../../helperFunctions/helperFunction";
import { returnPlayersPieceDetails } from "../../pieces/piecesHelper";
import { displayPieces, displayPawns } from "../../players/playerHelperFunction";
import { TileData, TileIdsType } from "../../types/boardTypes";
import { GameStates, PlayerTurnType, TileEventHelperFunctions } from "../../types/eventHandlersTypes";
import { PieceTemplate, PlayerIdType } from "../../types/pieceTypes";
import { CheckmateBannerComponent, GameOverComponent, PlayerChangeComponent } from "../banners/banner";
import { SelectANewPiece } from "../newPiece/newPieceSelector";
import { BoardComponent, ChessBoardContainer, ColumnContainter, RowContainter, TileContainer, TileElement } from "../styles/styledComponents";
  
const playerIds: {
    player1: PlayerIdType, 
    player2: PlayerIdType
} = {
    player1: 1,
    player2: 2,
} as const;

const initialChessBoardValues = [
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

const createChessBoardArray = (): TileData[][] => {
    console.log("please")
    return getRowIndexArray().map((rowId, rowIdIndex) => {
        return getColumnIndexArray().map((columnId, columnIdIndex) => {
            return {
                rowIdIndex: rowIdIndex,
                columnIdIndex,
                tileId: createNewTileId(columnId, rowId) as TileIdsType,
                piece: initialChessBoardValues[rowIdIndex][columnIdIndex],
                colour: 
                    rowIdIndex % 2 === 0?
                        columnIdIndex % 2 === 0? 
                            primaryColour : secondaryColour
                        :
                        columnIdIndex % 2 === 0? 
                            secondaryColour : primaryColour
            } 
        })
    });
}

export const Board: React.FC = () => {
    const [chessBoardArray, setChessBoardArray] = useState<TileData[][]>([[]])
    const [checkmate, setCheckmate] = useState<boolean> (false);
    const [displayBanner, setDisplayBanner] = useState<boolean> (false);
    const [gameOver, setGameOver] = useState<boolean> (false);
    const [displayPieceMenu, setDisplayPieceMenu] = useState<PieceTemplate  | null >(null);
    const [playersTurn, setplayersTurn] = useState<PlayerTurnType>("White");
    const handleTileValueUpdate = (tileId: TileIdsType, newValue: string|null) => {
        setChessBoardArray(prev => {
            let newTileArray:TileData[][] = []; 
            for (let rows = 0; rows < prev.length; rows++) {
                const newTileContainter = []
                for (let tileIndex = 0; tileIndex < prev[rows].length; tileIndex++) {
                    const newTile = prev[rows][tileIndex]; 
                    if(newTile.tileId === tileId) {
                        newTile.piece = newValue
                    }
                    newTileContainter.push(newTile)
                }
                newTileArray.push(newTileContainter);
            }
            return newTileArray;
        })
    }
    useEffect(() => {
        setChessBoardArray(createChessBoardArray())
    }, [])
    const handleTileColourUpdate = (tileId: TileIdsType, newColour: string): void => {
        setChessBoardArray(prev => {
            let newTileArray:TileData[][] = []; 
            for (let rows = 0; rows < prev.length; rows++) {
                const newTileContainter = []
                for (let tileIndex = 0; tileIndex < prev[rows].length; tileIndex++) {
                    const newTile = prev[rows][tileIndex]; 
                    if(newTile.tileId === tileId && newColour) {
                        newTile.colour = newColour
                    }
                    newTileContainter.push(newTile)
                }
                newTileArray.push(newTileContainter);
            }
            return newTileArray;
        })
}
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

    const renderTileComponents = (): JSX.Element[][] => {
        const initialChessBoard =  chessBoardArray.map((arr, rowIndex)=> {
            return arr.map((element, columnIndex) => {
                const eventHelpers: TileEventHelperFunctions = {updateTileColour: handleTileColourUpdate, updateTilePiece: handleTileValueUpdate }
                return <TileElement 
                    id = {element.tileId as string} 
                    onClick={() =>  movePieceLocation(eventHelpers, element, handleNewGameState)}
                    key={`${element.tileId}-index-${rowIndex}${columnIndex}`}
                    colour={element.colour} 
                    >
                        {element.piece}
                </TileElement>
            })
        });
        return initialChessBoard;
    }
    const [chessBoard, setChessBoard] = useState<JSX.Element[][]> (renderTileComponents()); 
    useEffect(() => {
        setChessBoard(renderTileComponents());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(chessBoardArray)])
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
                piece={displayPieceMenu} 
                gameStateManager={handleNewGameState}
                />}
                <div>
                   {checkmate && <CheckmateBannerComponent player={playersTurn}/>}
                   {displayBanner && <PlayerChangeComponent player={playersTurn} />}
                   {gameOver && <GameOverComponent player={playersTurn} />}
                </div>
                <div>
                    <RowContainter>
                        {displayRowIndexComponent()}
                    </RowContainter>
                    <TileContainer id="mainBoard">
                        {chessBoard}
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