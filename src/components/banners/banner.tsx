import { PlayerTurnType } from "../../types/eventHandlersTypes"
import { Banner, BannerContainer } from "./bannerStyles"


export const CheckmateBannerComponent: React.FC = () => {
    return (
        <>
            <BannerContainer >
                <Banner colour="red">Checkmate!</Banner> 
                <p>on player1</p>
            </BannerContainer>
        </>
    )
}

export const PlayerChangeComponent: React.FC<{player: PlayerTurnType}> = ({player}) => {
    return (
        <>
            <BannerContainer >
                <Banner colour="black"> Player {player}'s turn</Banner> 
            </BannerContainer>
        </>
    )
}