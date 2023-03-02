import { TileIdsType } from "./boardTypes";
import { PieceTemplate, PlayerIdType } from "./pieceTypes";

export type PlayerTurnType = "White" | "Black"; 

export enum GameStates {
    CHANGE_TURN = 0,
    CHECKMATE = 1,
    PAWN_PROMOTION = 2,
    GAME_OVER = 3,
}

export type HandleGameStateType = (gameState: GameStates, playerId?: PlayerIdType, piece?: PieceTemplate) => void;
export type HandleTileColourUpdate = (tileId: TileIdsType, newColour: string) => void;
export type HandleTilePieceUpdate = (tileId: TileIdsType, newValue: string | null) => void;
export type TileEventHelperFunctions = {updateTileColour: HandleTileColourUpdate, updateTilePiece: HandleTilePieceUpdate}