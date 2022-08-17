import { useQuery } from "@tanstack/react-query"
import styled from "styled-components";
import { getMovie, getupcomingMovie, getTopMovie, IGetMoviesResult } from "../api"
import { makeImagePath } from "../utils";
import Slider from "../components/Slider"

const Wrapper = styled.div`
  background: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 50px;
  font-weight: 600;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 21px;
  width: 50%;
`;

const Movies = styled.div`
  display:grid;
  grid-template-rows: repeat(3, 1fr);
`;

function Home() {
    const {data :nowPlaying, isLoading: nowPlayingLoading} = useQuery<IGetMoviesResult>(["movie", "nowPlaying"], getMovie)
    const {data :upcoming, isLoading: upcomingLoading} = useQuery<IGetMoviesResult>(["movie", "Popular"], getupcomingMovie)
    const {data :TopRated, isLoading: TopRatedLoading} = useQuery<IGetMoviesResult>(["movie", "TopRated"], getTopMovie)
    return (
        <Wrapper>
            {nowPlayingLoading ? (
                <Loader>Loading...</Loader>
            ):(
                <>
                  <Banner
                    bgPhoto={makeImagePath(nowPlaying?.results[0].backdrop_path || "")}
                  >
                    <Title>{nowPlaying?.results[0].title}</Title>
                    <Overview>{nowPlaying?.results[0].overview}</Overview>
                  </Banner>
                  <Movies>
                    <Slider data={nowPlaying} id="nowPlaying"/>
                    <Slider data={upcoming} id="upcoming"/>
                    <Slider data={TopRated} id="topRated"/>
                  </Movies>
                  
                  
                  
                </>
                  )
            }
        </Wrapper>
    )
}

export default Home

