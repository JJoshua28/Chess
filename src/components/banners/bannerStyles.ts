import styled from "styled-components";

interface BannerProps {
    colour: string;
}

export const BannerContainer = styled.div`
    height: 23%;
    width: 50%;
    position: absolute;
    font-size: 1.5em;
    top: 23%;
    left: 27%;
    overflow: hidden;
    background-color: #ffffff;
    border-radius: 10px;
    text-align: center;
    animation: fadeOut 5s;
`

export const Banner = styled.h1`
    color: ${(props: BannerProps) => props.colour };
`