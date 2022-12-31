import { PlayerTurnType } from "../../types/eventHandlersTypes"
import { Banner, ChangePlayerTurnContainter, CheckmateContainter,  } from "./bannerStyles"


export const CheckmateBannerComponent: React.FC = () => {
    return (
        <>
            <CheckmateContainter >
                <Banner colour="red">Checkmate!</Banner> 
                <p>on player1</p>
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