import styled from "styled-components";

interface BannerProps {
    colour: string;
}
 
const BannerContainer = styled.div`
    width: 50%;
    position: absolute;
    font-size: 1.5em;
    top: 23%;
    left: 27%;
    overflow: hidden;
    background-color: #ffffff;
    border-radius: 10px;
    text-align: center;
`
const AnimatedBannerContainer =  styled(BannerContainer)`
    animation: fadeOut 3s;
`;

export const CheckmateContainer = styled(AnimatedBannerContainer)`
    height: 23%;
`
export const GameOverContainer = styled(BannerContainer)`
    height: 23%;
`;
export const ChangePlayerTurnContainer = styled(AnimatedBannerContainer)`
    height: 15%;
`


export const Banner = styled.h1`
    color: ${(props: BannerProps) => props.colour };
`