import { useQuery } from "@tanstack/react-query"
import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useState } from "react";
import styled from "styled-components";
import { getMovie, IGetMoviesResult } from "../api"
import { makeImagePath } from "../utils";
import { useMatch, useNavigate } from "react-router-dom";

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
  font-size: 68px;
  margin-bottom: 20px; ;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
`
const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`

const Box = styled(motion.div)<{bgPhoto: string}>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  color: red;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`
const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);

`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: orange;
`;

const rowVariants = {
  hidden: {
    x: window.outerWidth + 5,
  },//initial
  visible: {
    x: 0,
  },//animate
  exit: {
    x: -window.outerWidth - 5,
  },//exit
};


const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      delay: 0.5,
      duaration: 0.1,
    }

  }
}

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duaration: 0.1,
    }
  }
}

const offset = 6;

function Home() {
    const navigate = useNavigate();
    const movieMatch = useMatch("/movies/:movieId");
    const {scrollY} = useViewportScroll();
    const {data, isLoading} = useQuery<IGetMoviesResult>(["movie", "nowPlaying"], getMovie)
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const increaseIndex = () => {
      if (data) {
        if (leaving) return;
        toggleLeaving()
        const totalMovies = data.results.length - 1;
        const maxIndex = Math.floor(totalMovies / offset) - 1;
        setIndex((prev) => prev === maxIndex ? 0 : prev+1);
      } 
    };
    const toggleLeaving = () => {setLeaving((prev) => !prev)};
    const onBoxClicked = (movieId:number) =>{
      navigate(`/movies/${movieId}`);
    };
    const onOverlayClick = () => {
      navigate("/")
    }
    return (
        <Wrapper>
            {isLoading ? (
                <Loader>Loading...</Loader>
            ):(
                <>
                  <Banner
                    onClick={increaseIndex}
                    bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
                  >
                    <Title>{data?.results[0].title}</Title>
                    <Overview>{data?.results[0].overview}</Overview>
                  </Banner>
                  <Slider>
                    <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                      <Row
                        key={index}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ type: "tween", duration: 1 }}
                      >
                        {data?.results
                          .slice(1)
                          .slice(offset * index, offset * index + offset)
                          .map((movie => 
                            <Box 
                              key={movie.id}
                              layoutId={movie.id+""}
                              variants={boxVariants}
                              initial="normal"
                              whileHover="hover"
                              transition={{type:"tween"}}
                              bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                              onClick={()=>onBoxClicked(movie.id)}
                              >
                                <Info variants={infoVariants}>
                                  <h4>{movie.title}</h4>
                                </Info>
                              </Box>))}
                      </Row>
                    </AnimatePresence>
                  </Slider>
                  <AnimatePresence>
                   
                    {movieMatch ? (
                       <>
                        <Overlay onClick={onOverlayClick} exit={{ opacity: 0 }} animate={{ opacity: 1 }}/>
                        <BigMovie
                          layoutId={movieMatch.params.movieId}
                          style={{top: scrollY.get()+100}}
                        />
                       </>
                      
                    ):null}
                  </AnimatePresence>
                </>
                  )
            }
        </Wrapper>
    )
}

export default Home

