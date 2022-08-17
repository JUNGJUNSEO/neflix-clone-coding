import styled from "styled-components";
import { useState } from "react";
import { AnimatePresence, motion, LayoutGroup } from "framer-motion";
import {IGetMoviesResult } from "../api";
import { useMatch, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { makeImagePath } from "../utils";
import Movie from "./Movie";


const Wrapper = styled.div`
  position: relative;
  background-color: rgba(0, 0, 0, 0.9);
  height: 60vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Row = styled(motion.div)`
  position: absolute;
  width: 100%;
  display: grid;
  gap:30px;
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
    x: direction > 0 ? window.outerWidth + 30 : -window.outerWidth - 30
  }), //initial
  visible: {
    x: 0
  }, //animate
  exit: (direction: number) => ({
    x: direction > 0 ? -window.outerWidth - 30 : window.outerWidth + 30
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

interface ISliderProps {
  data?: IGetMoviesResult;
  id: string;
}

function Slider({data, id}: ISliderProps) {
  

    const navigate = useNavigate();
    const movieMatch = useMatch("/movies/:movieId");
    const [[index, direction], setIndex] = useState([0, 0]);
    const [leaving, setLeaving] = useState(false);

    const maxIndex = Math.floor((data?.results.length || 0) / offset) - 1;
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
      <LayoutGroup id={id} >
        
        <Wrapper>
          {id}
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
                {data?.results
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
        </Wrapper>  
    {movieMatch ? (
        <Movie movieId={movieMatch.params.movieId || ""} />
    ) : null}
  </LayoutGroup>
    );
}

export default Slider;