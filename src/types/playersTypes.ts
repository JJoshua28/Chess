import { ActivePieces, PieceTemplate } from "./pieceTypes";

export interface PlayerTemplate {
    readonly id: number;
    activePieces:ActivePieces;
    isThereTurn: boolean;
    hasMoved: boolean;
    unavailablePieces: PieceTemplate[];
    setIsThereTurn: (value: boolean) => void 
    getIsThereTurn:() => boolean
    setUnavailablePieces: (value: PieceTemplate)  => void
    getUnavailablePieces: () => PieceTemplate[]
};