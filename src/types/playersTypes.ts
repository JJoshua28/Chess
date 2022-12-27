import { ActivePieceKeys, ActivePieces, PieceTemplate, PlayerIdType } from "./pieceTypes";


export interface PlayerTemplate {
    readonly id: PlayerIdType
    activePieces:ActivePieces;
    isThereTurn: boolean;
    hasMoved: boolean;
    unavailablePieces: PieceTemplate[];
    setIsThereTurn: (value: boolean) => void 
    getIsThereTurn:() => boolean
    setUnavailablePieces: (value: PieceTemplate)  => void
    getUnavailablePieces: () => PieceTemplate[]
};

export interface PieceLocation {
    index: number;
    key: ActivePieceKeys;
}