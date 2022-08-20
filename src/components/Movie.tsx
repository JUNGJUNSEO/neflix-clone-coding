import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { getCredits, getDetail, IGetMovieCredits, IMovie } from "../api";
import { useNavigate } from "react-router-dom";
import { makeImagePath } from "../utils";
import { Loader } from "./Loader";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`;

const BigMovie = styled(motion.div)`
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 40%;
  min-width: 500px;
  height: 100%;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: rgba(0, 0, 0, 1);
  color: white;
`;

const BackDropImage = styled.div<{ bgImage: string }>`
  height: 30vh;
  background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgImage});
  background-size: cover;
  background-position: center;
`;
const MovieInfo = styled.div`
  position: absolute;
  top: 120px;
  padding: 30px;
`;

const MoiveDetail = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr 2fr;
`;
const MoviePoster = styled.img`
  object-fit: fill;
  width: 100%;
  height: 100%;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
`;

const MovieTitle = styled.span`
  font-size: 32px;
  font-weight: 600;
`;
const MovieOverview = styled.p`
  font-size: 15px;
`;

const Genres = styled.div`
  display: flex;
  margin-top: 5px;
`;

const Genre = styled.div`
  background-color: #535353;
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  border-radius: 5px;
  padding: 5px;
  margin: 0px 3px;
`;

const H3 = styled.h3`
  font-weight: 600;
  font-size: 28px;
  margin: 20px 0px;
`;

const Actors = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
`;

const Actor = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 13px;
`;

const ActorImg = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
`;

const ActorName = styled.span`
  text-align: center;
`;

interface movieProps {
  movieId: string;
}

export default function Movie({ movieId }: movieProps) {
  const { scrollY } = useViewportScroll();
  const { data: movieDetail, isLoading: detailLoading } = useQuery<IMovie>(
    [movieId, "detail"],
    () => getDetail(movieId)
  );
  const { data: movieCredits, isLoading: creditsLoading } = useQuery<
    IGetMovieCredits
  >([movieId, "credits"], () => getCredits(movieId));
  const navigate = useNavigate();
  const onOverlayClick = () => {
    navigate("/");
  };
  console.log(scrollY.get())
  return (
    <>
      <AnimatePresence>
        <Overlay
          onClick={onOverlayClick}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        ></Overlay>
      </AnimatePresence>
      <BigMovie layoutId={movieId} style={{ top: scrollY.get() + 40 }}>
        {detailLoading && creditsLoading ? (
          <Loader>Loading...</Loader>
        ) : (
          movieDetail &&
          movieCredits && (
            <>
              <BackDropImage
                bgImage={makeImagePath(movieDetail.backdrop_path, "w500")}
              ></BackDropImage>
              <MovieInfo>
                <MoiveDetail>
                  <MoviePoster
                    src={makeImagePath(movieDetail.poster_path, "w500")}
                    alt=""
                  ></MoviePoster>
                  <div>
                    <MovieTitle>{movieDetail.title} </MovieTitle>
                    <Genres>
                      {movieDetail.genres.slice(0, 3).map((genre) => (
                        <Genre>{genre.name}</Genre>
                      ))}
                    </Genres>
                    <div style={{ marginTop: "20px" }}>
                      {"⭐"}
                      {movieDetail.vote_average} / 10{" "}
                    </div>
                    <div style={{ marginTop: "20px" }}>
                      runtime: {Math.floor(movieDetail.runtime / 60)}h{" "}
                      {movieDetail.runtime % 60}m
                    </div>
                  </div>
                </MoiveDetail>
                <div>
                  <H3>Overview</H3>
                  <MovieOverview>{movieDetail.overview}</MovieOverview>
                </div>

                <div>
                  <H3>Actor</H3>
                  <Actors>
                    {movieCredits.cast.slice(0, 6).map((actor) =>
                      actor.profile_path ? (
                        <Actor>
                          <ActorImg
                            src={makeImagePath(actor.profile_path, "w500")}
                            alt={actor.name}
                          ></ActorImg>
                          <ActorName>{actor.name}</ActorName>
                        </Actor>
                      ) : null
                    )}
                  </Actors>
                </div>
              </MovieInfo>
            </>
          )
        )}
      </BigMovie>
    </>
  );
}
