import { CheckmateBanner, CheckmateBannerContainer } from "./bannerStyles"


export const CheckmateBannerComponent: React.FC = () => {
    return (
        <>
            <CheckmateBannerContainer >
                <CheckmateBanner>Checkmate!</CheckmateBanner> 
                <p>on player1</p>
            </CheckmateBannerContainer>
        </>
    )
}