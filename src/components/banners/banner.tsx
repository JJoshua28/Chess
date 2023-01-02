import { PlayerTurnType } from "../../types/eventHandlersTypes"
import { Banner, ChangePlayerTurnContainter, CheckmateContainter,  } from "./bannerStyles"


export const CheckmateBannerComponent: React.FC<{player: PlayerTurnType | null}> = ({player}) => {
    return (
        <>
            <CheckmateContainter >
                <Banner colour="red">Checkmate!</Banner> 
                <p>{player}'s Turn</p>
            </CheckmateContainter>
        </>
    )
}

export const PlayerChangeComponent: React.FC<{player: PlayerTurnType}> = ({player}) => {
    return (
        <>
            <ChangePlayerTurnContainter >
                <Banner colour="black">{player}'s turn</Banner> 
            </ChangePlayerTurnContainter>
        </>
    )
}