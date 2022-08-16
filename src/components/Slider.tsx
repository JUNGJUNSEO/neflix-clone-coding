import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IMovie, getMovie, IGetMoviesResult } from "../api";
import { useMatch, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { makeImagePath } from "../utils";
import Movie from "./Movie";
import { Loader } from "../components/Loader";

const Wrapper = styled.div`
  position: relative;
  background-color: rgba(0, 0, 0, 0.9);
  height: 120vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Row = styled(motion.div)`
  position: absolute;
  width: 100%;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(6, 1fr);
  height: 400px;
`;
const Button = styled.div`
  position: absolute;
  height: 400px;
  width: 50px;
  font-size: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.5));
  color: white;
  z-index: 1;
`;
const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const rowVariants = {
  hidden: (direction: number) => ({
    x: direction > 0 ? window.outerWidth + 10 : -window.outerWidth - 10
  }), //initial
  visible: {
    x: 0
  }, //animate
  exit: (direction: number) => ({
    x: direction > 0 ? -window.outerWidth - 10 : window.outerWidth + 10
  }) //exit
};

const boxVariants = {
  normal: {
    scale: 1
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      delay: 0.3,
      duration: 0.4
    }
  }
};

const offset = 6;

interface aa {
  page:string;
}

function Slider() {
    console.log(data)

    const navigate = useNavigate();
    const movieMatch = useMatch("/movies/:movieId");
    const { data: movieData, isLoading: movieLoading } = useQuery<
        IGetMoviesResult
    >(["movie", "nowPlaying"], getMovie);
    const [[index, direction], setIndex] = useState([0, 0]);
    const [leaving, setLeaving] = useState(false);

    const maxIndex = Math.floor((movieData?.results.length || 0) / offset) - 1;
    const toggleLeaving = () => {
        setLeaving((prev) => !prev);
    };

    const onClick = (newDirection: number) => {
        if (!leaving) {
        setIndex([index + newDirection, newDirection]);
        toggleLeaving();
        }
    };

    const onBoxClicked = (MovieId: number) => {
        navigate(`/movies/${MovieId}`);
    };

    return (
        <>
        {movieLoading ? (
            <Loader>loading...</Loader>
        ) : (
            <>
                <AnimatePresence
                  initial={false}
                  onExitComplete={toggleLeaving}
                  custom={direction}
                >
                <Row
                  key={index}
                  custom={direction}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{
                  type: "tween",
                  duration: 3
                  }}
                >
                    {movieData?.results
                    .slice(offset * index, offset * index + offset)
                    .map((movie) => (
                        <Box
                          key={movie.id}
                          layoutId={movie.id + ""}
                          variants={boxVariants}
                          initial="normal"
                          whileHover="hover"
                          transition={{ type: "tween" }}
                          bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                          onClick={() => onBoxClicked(movie.id)}
                        ></Box>
                    ))}
                </Row>
                </AnimatePresence>
                {index === 0 ? null : (
                <Button
                  onClick={() => onClick(-1)}
                  style={{
                  left: 0,
                  background:
                      "linear-gradient(90deg, rgba(0,0,0,0.5), rgba(0,0,0,0.1))"
                  }}
                >
                    <FontAwesomeIcon icon={faAngleLeft} />
                </Button>
                )}
                {index === maxIndex ? null : (
                <Button onClick={() => onClick(1)} style={{ right: 0 }}>
                  <FontAwesomeIcon icon={faAngleRight} />
                </Button>
                )}
            
            {movieMatch ? (
                <Movie movieId={movieMatch.params.movieId || ""} />
            ) : null}
            </>
        )}
        </>
    );
}

export default Slider;