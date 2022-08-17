const API_KEY = "10923b261ba94d897ac6b81148314a3f";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IGenre {
  id: number;
  name: string;
}

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  genres: IGenre[];
  vote_average: number;
  release_date: string;
  runtime: number;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface ICredits {
  name: string;
  profile_path: string;
}
export interface IGetMovieCredits {
  cast: ICredits[];
}

export function getMovie() {
  return fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`
  ).then((response) => response.json());
}

export function getupcomingMovie() {
  return fetch(
    `${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`
  ).then((response) => response.json());
}

export function getTopMovie() {
  return fetch(
    `${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`
  ).then((response) => response.json());
}

export function getDetail(movieId: string) {
  return fetch(
    `${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}`
  ).then((response) => response.json());
}

export function getCredits(movieId: string) {
  return fetch(
    `${BASE_PATH}/movie/${movieId}/credits?api_key=${API_KEY}`
  ).then((response) => response.json());
}
