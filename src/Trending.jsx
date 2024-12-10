import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import "react-circular-progressbar/dist/styles.css"; 

export default function Trending() {
  const API_KEY = import.meta.env.VITE_KEY;
  const BASE_URL = "https://api.themoviedb.org/3";

  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [timeframe, setTimeframe] = useState("week"); 
  const [mediaType, setMediaType] = useState("all");

  // Fetch movies and avoid duplicates
  const fetchMovies = async (endpoint, reset = false) => {
    setLoading(true);
    const response = await fetch(endpoint);
    const data = await response.json();
    

    if (data.results) {
      const uniqueMovies = reset
        ? data.results
        : [
            ...movies,
            ...data.results.filter(
              (newMovie) => !movies.some((movie) => movie.id === newMovie.id)
            ),
          ];
      setMovies(uniqueMovies);
      
    }
    setLoading(false);
  };

  const fetchTrending = (timeframe, mediaType, page = 1) => {
    const endpoint = `${BASE_URL}/trending/${mediaType}/${timeframe}?api_key=${API_KEY}&page=${page}`;
    fetchMovies(endpoint, page === 1);
  };

  const loadMoreMovies = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchTrending(timeframe, mediaType, nextPage);
  };
// Reset pagination when filters change
  useEffect(() => {
    setPage(1); 
    fetchTrending(timeframe, mediaType, 1);
  }, [timeframe, mediaType]);

  useEffect(() => {
    // Add the 'show' class to trigger fade-in animation when movies or filters change
    const container = document.querySelector(".container");
    container.classList.add("show");

  }, [movies, timeframe, mediaType]); 

  return (
    <div className="trending-page">
      {/* Logo */}
      

      {/* Trending Section */}
      <div className="trending-title">Trending</div>

      {/* Toggles */}
      <div className="toggles">
        <div className="toggle-group timeframe">
          {["Day", "Week"].map((option) => (
            <button
              key={option}
              onClick={() => setTimeframe(option.toLowerCase())}
              className={timeframe === option.toLowerCase() ? "active" : ""}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="toggle-group media-type">
          {["All", "Movie", "TV"].map((type) => (
            <button
              key={type}
              onClick={() => setMediaType(type.toLowerCase())}
              className={mediaType === type.toLowerCase() ? "active" : ""}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Movie Cards */}
      <div className="container">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* Load More Button */}
      {!loading && movies.length > 0 && (
        <div className="load-more-container">
          <button className="load-more-button" onClick={loadMoreMovies}>
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
