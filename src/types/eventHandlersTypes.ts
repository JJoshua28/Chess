import { PieceTemplate, PlayerIdType } from "./pieceTypes";

export type PlayerTurnType = "White" | "Black"; 

export enum GameStates {
    CHANGE_TURN = 0,
    CHECKMATE = 1,
    PAWN_PROMOTION = 2,
    GAME_OVER = 3,
}

export type handleGameStateType = (gameState: GameStates, playerId?: PlayerIdType, piece?: PieceTemplate) => void;