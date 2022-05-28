import React, { useState, useEffect } from "react";
import SearchIcon from "@material-ui/icons/Search";
import movie_names from "../movie_names.json";
import LogoutIcon from '@mui/icons-material/Logout';
import Login from './Login';
import ReactDOM from 'react-dom';
import {
  getMovieCastData,
  getMovieData,
  getRecommendedMoviesData,
  getPopular,
  getTopRated,
  getUpcoming,
} from "../utils";
import recommender_api from "../api/recommenderapi";
import "../styles/App.css";
import { Button } from "@material-ui/core";
import RowMovieCard from "./RowMovieCard";
import InputMovieCard from "./InputMovieCard";
import MovieCastCard from "./MovieCastCard";
import ReviewsCard from "./ReviewsCard";
import AboutMe from "./AboutMe";
import TitleCard from "./TitleCard";
import ReviewLoading from "./ReviewLoading";
import Loading from "./Loading";
import Error from "./Error";
import firebase from 'firebase/app';


function App() {

  const [movies, setMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState(null);
  const [topRatedMovies, setTopRatedMovies] = useState(null);
  const [upcomingMovies, setUpcomingMovies] = useState(null);
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState(null);
  const [recommendedMovies, setRecommendedMovies] = useState(null);
  const [inputMovieData, setInputMovieData] = useState(null);
  const [castData, setCastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sentimentLoading, setSentimentLoading] = useState(false);
  const [reviews, setReviews] = useState(null);
  const [error, setError] = useState(null);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [suggested, setSuggested] = useState(null);


  useEffect(() => {
    async function fetchData() {
        const loadMovieNames = () => {
          setMovies(movie_names.movie_names);
      };

      const dummieAPIRequest = async () => {
        await recommender_api.get("/");
      };
      loadMovieNames();
      await dummieAPIRequest();
    }
    fetchData();



    /*********************** getting the data from the local storage of browser ***************/

    const previousWatchMoviesList = localStorage.getItem("watchedMovies");
    try{
      setWatchedMovies(JSON.parse(previousWatchMoviesList))
    } catch(e){
      setWatchedMovies([])
    }

  }, []);


  
  useEffect(() => {    
    
    /************************ getting the Trending, Top-Rated, up-coming data from util.js ****************/  

    const loadPopular = async () => {
      return await getPopular();
    };
    const loadTopRated = async () => {
      return await getTopRated();
    };
    const loadUpcoming = async () => {
      return await getUpcoming();
    }
    loadPopular().then((data) => {
      setTrendingMovies(data);
    });
    loadTopRated().then((data) => {
      setTopRatedMovies(data);
    });
    loadUpcoming().then((data) => {
      setUpcomingMovies(data);
    });
    
  }, []);

  
  /************************** SearchBox change handler *************************/
  const onChangeHandler = (text_value) => {

    let matches = [];
    if (text_value.length > 0) {
      matches = movies.filter((movie) => {
        const regex = new RegExp(`${text}`, "gi");
        return movie.title.match(regex);
      });

    }

    if (matches.length > 10) matches = matches.slice(0, 8);

    setSuggestions(matches);
    setText(text_value);
    
  };


  /*************************** Search suggestions handler ********************/
  const onSuggestHandler = (text_value) => {
    setText(text_value);
    setSuggestions(null);
  };


  /***** getting the recommendation data(suggested movie data) based on previos watched ************/

  const previousWatchedHandler = async (movie_name) => {
    const request = new FormData();
    request.append("movie_name", movie_name);
    request.append("number_of_recommendations", 15);

    const response = await recommender_api.post("/recommend_movie", request);

    const responseData = response.data;
    if (responseData.error) {
      setError(responseData.error);
    } else {
      const suggested_movie_data = await getRecommendedMoviesData(
        responseData.recommendations
      );
      setSuggested(suggested_movie_data);
    }
    
  }


  /*************** getting the data of searchedmovie- info, cast-info, reviews, recommendation *****/

  const movieHandler = async (movie_name) => {
    setLoading(true);
    setError(null);
    

    const request = new FormData();
    request.append("movie_name", movie_name);
    request.append("number_of_recommendations", 15);

    const response = await recommender_api.post("/recommend_movie", request);

    const responseData = response.data;
    if (responseData.error) {
      setError(responseData.error);
    } else {
      const movie_data = await getMovieData(responseData.input_movie.movie_id);
      const recommendations_movie_data = await getRecommendedMoviesData(
        responseData.recommendations
      );

      const movieCastData = await getMovieCastData(
        responseData.input_movie.movie_id
      );



      /**************** retrieving the data of previously watched movie to add into suggested items when user search fro a movie******************************************/

      const previousWatchMoviesList = JSON.parse(localStorage.getItem("watchedMovies")) || [];
      const movieMap = new Map();
      const updatedPreviousWatchMoviesList = [];

      if (previousWatchMoviesList.length > 0) { 
        const previousMovieName = previousWatchMoviesList[previousWatchMoviesList.length - 1].title;
        await previousWatchedHandler(previousMovieName);
        previousWatchMoviesList.forEach(movie => {
          if (movieMap.get(movie.id) === undefined) {
            movieMap.set(movie.id, true);
            updatedPreviousWatchMoviesList.push(movie);
            
          }
        });
      } 

      setWatchedMovies(updatedPreviousWatchMoviesList);
      const updatedWatchMoviesList = updatedPreviousWatchMoviesList || [];
      if (movieMap.get(movie_data.id) === undefined) {
       updatedWatchMoviesList.push(movie_data); 
      } 
      localStorage.setItem("watchedMovies", JSON.stringify(updatedWatchMoviesList)); // end of data fetching & pushing from local storage.




      setCastData(movieCastData);
      setInputMovieData(movie_data);
      setRecommendedMovies(recommendations_movie_data);
      setLoading(false);
      setSentimentLoading(true);

      const input_movie_imdb_id = movie_data.imdb_id;
      const review_request = new FormData();
      review_request.append("movie_imdb_id", input_movie_imdb_id);
      const review_response = await recommender_api.post(
        "/movie_reviews_sentiment",
        review_request
      );

      let inputReviews = review_response.data;
      if (inputReviews) {
        if (inputReviews.length > 10) inputReviews = inputReviews.slice(0, 10);
        setReviews(inputReviews);
      }
    }
    setSentimentLoading(false);
    setLoading(false);
  };

  
  /*********************** handling the case when the search button is clicked *************/
  const handleClick = async () => {
    await movieHandler(text);
  };


  /************************** handling the case when the movie card is clicked *************/
  const handleCardClick = async (movie_name) => {
    setText(movie_name);
    window.scrollTo(0, 0);
    await movieHandler(movie_name);
  };


  /********************** setting input movie data, reviews-sentiment, recommendation componant ******/
  let finalComponent = null;
  let reviewsComponent = null;

  if (sentimentLoading) reviewsComponent = <ReviewLoading />;
  if (reviews != null && reviews.length !== 0)
    reviewsComponent = (
      <>
        <br />
        <ReviewsCard reviews={reviews} />
      </>
    );

  
  if (loading) finalComponent = <Loading />;
  else if (error) {
    finalComponent = <Error error={error} />;
  } else {
    finalComponent = recommendedMovies && (
      <>
        <br />
        <br />
        <div className="recommendation_section">
          <InputMovieCard {...inputMovieData} />
          <br />

          <center>
            <h1 className="title">About "{inputMovieData.title}" Cast</h1>
          </center>
          <br />

          <div className="cast_data_cards">
            {castData.map((cast) => {
              return (
                cast.profile_path && <MovieCastCard key={cast.id} {...cast} />
              );
            })}
          </div>

          {reviewsComponent && reviewsComponent}

          <br />
          <center>
            <h1 className="title">Recommended Movies Based On Your Search</h1>
          </center>
          <div className="recommendation_row">
            {recommendedMovies.map((movie) => {
              return (
                <div
                  key={movie.id}
                  onClick={(e) => handleCardClick(movie.title)}
                >
                  <RowMovieCard key={movie.rank} {...movie} />
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }
  
  
  /*************************** Returning the Home Page **********************/
  return  (
    <div className="app">
      {/* ********************* Title ***************************/}
      <TitleCard />

      {/* *********************** Search *************************/}
      <div className="app__search_container">
        <div className="search_wrapper">
          <input
            className="search_input"
            value={text}
            onChange={(e) =>onChangeHandler(e.target.value)}
            onBlur={() => {
              setTimeout(() => {
                setSuggestions(null);
              }, 200);
            }}
            type="text"
            placeholder="Search For A Movie"
          />

          <Button
            className="search_button"
            variant="contained"
            color="primary"
            disabled={text === ""}
            startIcon={<SearchIcon />}
            onClick={() => handleClick()}
          >
            Search
          </Button>

          {suggestions && (
            <div className="suggestion_container">
              {suggestions.map((suggestion, i) => {
                return (
                  <div
                    className="suggestion"
                    onClick={() => onSuggestHandler(suggestion.title)}
                    key={i}
                  >
                    {suggestion.title}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* *********************** Movie Recommendations ************************/}
      {finalComponent}

      {/* ************************ Previously watched ****************************/}
      <br />
      <div>
          { 
              (Array.isArray(watchedMovies) && watchedMovies.length > 0 && watchedMovies[0].title !== text) &&
              <center>
                   <h1 className="title"> Recently Watched Movies</h1>
              </center> 
          }
          <div className="recommendation_row">
            {Array.isArray(watchedMovies) && watchedMovies.filter((movie) =>
              {
              return movie.title !== text
              }).map((movie) => {
                return (
                  <div
                      key={movie.id}
                      onClick={(e) => {
                        handleCardClick(movie.title)
                      }}
                  >
                      <RowMovieCard key={movie.rank} {...movie} />
                  </div>
                );
              })
            }
          </div>
              
      </div>


      {/* ************ suggested Movies(Recommended Based of previous watched) ***********/}
      <br />
      <div>
          { 
              (Array.isArray(suggested) && suggested.length > 0) &&
              <center>
                   <h1 className="title">Suggested For You</h1>
              </center>
          }
          
          <div className="recommendation_row">
          {Array.isArray(suggested) && suggested.filter((movie)=>{
            return movie.title !== text
          }).map((movie) => {
              return (
                <div
                  key={movie.id}
                  onClick={(e) => {
                    
                    handleCardClick(movie.title)
                  }}
                >
                  <RowMovieCard key={movie.rank} {...movie} />
                </div>
              );
            })}
          </div>
              
      </div>
      
      {/* ******************** Popular Movies *******************************/}
      <br />
          <center>
            <h1 className="title">Popular Movies</h1>
          </center>
          <div className="recommendation_row">
            {trendingMovies && trendingMovies.map((movie) => {
              return (
                <div
                  key={movie.id}
                  onClick={(e) => {
                    
                    handleCardClick(movie.title)
                  }}
                >
                  <RowMovieCard key={movie.rank} {...movie} />
                </div>
              );
            })}
          </div>
      
      {/* *************************** top-rated Movies **********************/}
      <br />
          <center>
            <h1 className="title">Top Rated Movies</h1>
          </center>
          <div className="recommendation_row">
            {topRatedMovies && topRatedMovies.map((movie) => {
              return (
                <div
                  key={movie.id}
                  onClick={(e) => handleCardClick(movie.title)}
                >
                  <RowMovieCard key={movie.rank} {...movie} />
                </div>
              );
            })}
      </div>
      
      {/* ************************** up-coming Movies ****************************/}
      <br />
          <center>
            <h1 className="title">Upcoming Movies</h1>
          </center>
          <div className="recommendation_row">
            {upcomingMovies && upcomingMovies.map((movie) => {
              return (
                <div
                  key={movie.id}
                  onClick={(e) => handleCardClick(movie.title)}
                >
                  <RowMovieCard key={movie.rank} {...movie} />
                </div>
              );
            })}
          </div>



      {/* ******************************* About Application ********************/}
      <br />
      <center>
        <h1 className="about_title">About Application</h1>
      </center>
      <br />
      <div classsName="about_application" style={{ display: "flex", width: "100%", justifyContent: "center" }}>
        <div className="about_application_content">
          Welcome to Epic Movie Zone. This is an AI based web application in
          which you can search for any Hollywood Movie. This application will
          provide all the information related to that movie, does sentiment
          analysis on the movie reviews & fetches reviews with analysis. the most interesting part, this application will provide you the top 15 movie recommendations based on your search & It tracks the user activity so it gives 15 movie-suggestions based on your previous search. Search for a movie for better experience.
        </div>
      </div>

      
      {/* ******************************* About Me *******************************/}
      <br />
      <AboutMe />
      {/* Log-Out */}

      <div className="Center">
        <div className="logout-button logout"
          onClick={() => {const user = firebase.auth().currentUser;
            firebase.auth().signOut().then(() =>
            {
              user.delete();
              ReactDOM.render(<Login />,
                document.getElementById('root'));
              
            }).catch((error) =>
            {
              alert("Error in signing out!");
            });
          }}>
          <LogoutIcon/> Log-Out
        </div>
      </div>
      
    </div>
  );
}

export default App;


