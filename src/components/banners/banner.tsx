import { PlayerTurnType } from "../../types/eventHandlersTypes"
import { Banner, ChangePlayerTurnContainer, CheckmateContainer, GameOverContainer,  } from "./bannerStyles"


export const CheckmateBannerComponent: React.FC<{player: PlayerTurnType | null}> = ({player}) => {
    return (
        <>
            <CheckmateContainer >
                <Banner colour="red">Checkmate!</Banner> 
                <p>{player}'s Turn</p>
            </CheckmateContainer>
        </>
    )
}

export const PlayerChangeComponent: React.FC<{player: PlayerTurnType}> = ({player}) => {
    return (
        <>
            <ChangePlayerTurnContainer >
                <Banner colour="black">{player}'s turn</Banner> 
            </ChangePlayerTurnContainer>
        </>
    )
}

export const GameOverComponent: React.FC<{player: PlayerTurnType}> = ({player}) => {
    return (
        <>
            <GameOverContainer >
                <Banner colour="red">Game Over</Banner> 
                <p>{player} wins!</p>
            </GameOverContainer>
        </>
    )
}