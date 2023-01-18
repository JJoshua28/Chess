import { PieceTemplate } from "./pieceTypes";

export type PlayerTurnType = "White" | "Black"; 
type AddNewPieceHandlerType = (value: PieceTemplate | null) => void;
type ChangePlayerHandlerType = (value: number, isTheGameOver?: boolean) => void;
type UpdateCheckmateStatusHandlerType = () => void;
type UpdateGameOverHandlerType = () => void;

export interface EventHandlers {
    updateDisplayPieceMenuStatus: AddNewPieceHandlerType,
    changePlayer: ChangePlayerHandlerType,
    updateCheckmateStatus: UpdateCheckmateStatusHandlerType,
    updateGameOverStatus: UpdateGameOverHandlerType,
}