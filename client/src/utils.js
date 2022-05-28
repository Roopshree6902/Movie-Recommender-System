import tmdbapi from "./api/tmdbapi";

const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;


/*********************Fetching Cast data from The Movie DataBase API and Exporting to App.js */
export const getMovieCastData = async (movie_id) => {
  const response = await tmdbapi.get(
    `/movie/${movie_id}/credits?api_key=${TMDB_API_KEY}`
  );

  let castData = response.data.cast;
  if (castData.length > 8) castData = castData.slice(0, 8);
  return castData;
};


/***************Fetching Trending Movies data from The Movie DataBase API and Exporting to App.js */
export const getPopular = async () => {
  
  const response= await tmdbapi.get(
    `/movie/popular?api_key=${TMDB_API_KEY}`
  );
    let popularData=response.data.results;
    return popularData.slice(0,15);
  
};


/*******************Fetching Top-Rated-Movies data from The Movie DataBase API and Exporting to App.js */
export const getTopRated = async () => {
  
  const response= await tmdbapi.get(
    `/movie/top_rated?api_key=${TMDB_API_KEY}`
  );
    let topRatedData=response.data.results;
    return topRatedData.slice(0,15);
  
};


/********************Fetching Up-coming Movies data from The Movie DataBase API and Exporting to App.js */
export const getUpcoming = async () => {
  
  const response= await tmdbapi.get(
    `/movie/upcoming?api_key=${TMDB_API_KEY}`
  );
    let upcomingData=response.data.results;
    return upcomingData.slice(0,15);
  
};


/*********************Fetching Video data from The Movie DataBase API and Exporting to App.js */
export const getMovieVideoId = async (movie_id) => {
  const videoResponse = await tmdbapi.get(
    `/movie/${movie_id}/videos?api_key=${TMDB_API_KEY}`
  );
  const videos = videoResponse.data.results;
  if (videos.length > 0)
    return { name: videos[0].type, videoId: videos[0].key };
  else return null;
};


/**********************Fetching Movie data from The Movie DataBase API and Exporting to App.js */
export const getMovieData = async (movie_id) => {
  const response = await tmdbapi.get(
    `/movie/${movie_id}?api_key=${TMDB_API_KEY}`
  );

  return response.data;
};


/************************Exporting Recommended Movies Data Array to App.js ***********************/
export const getRecommendedMoviesData = async (recommendations) => {
  let recommendationsData = [];
  let result = null;
  for (let recommended_movie of recommendations) {
    result = await getMovieData(recommended_movie.movie_id);
    recommendationsData.push(result);
  }
  return recommendationsData;
};
