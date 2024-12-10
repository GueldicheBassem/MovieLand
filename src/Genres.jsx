import React, { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFilter } from "@fortawesome/free-solid-svg-icons";
import "./Genres.scss";

export default function Genres() {
  const API_KEY = import.meta.env.VITE_KEY;
  const BASE_URL = "https://api.themoviedb.org/3";

  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [mediaType, setMediaType] = useState("all");
  const [orderBy, setOrderBy] = useState("popularity");
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchGenres = async () => {
      const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
      const data = await response.json();
      setGenres(data.genres || []);
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    if (searchQuery.trim()) {
      handleSearch(); 
      return;
    }

    setLoading(true);
    const genreIds = selectedGenres.join(",");
    const type = mediaType === "all" ? "" : mediaType;

    let movieResults = [];
    let tvResults = [];

    if (mediaType === "all" || mediaType === "movie") {
      const movieEndpoint = `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=${getSortValue(
        orderBy
      )}&with_genres=${genreIds}&page=1`;
      const movieResponse = await fetch(movieEndpoint);
      const movieData = await movieResponse.json();
      movieResults = movieData.results || [];
      movieResults = movieResults.map((movie) => ({ ...movie, media_type: "movie" }));
    }

    if (mediaType === "all" || mediaType === "tv") {
      const tvEndpoint = `${BASE_URL}/discover/tv?api_key=${API_KEY}&sort_by=${getSortValue(
        orderBy
      )}&with_genres=${genreIds}&page=1`;
      const tvResponse = await fetch(tvEndpoint);
      const tvData = await tvResponse.json();
      tvResults = tvData.results || [];
      tvResults = tvResults.map((tv) => ({ ...tv, media_type: "tv" }));
    }

    const combinedResults = [...movieResults, ...tvResults];
    const sortedResults = sortResults(combinedResults, orderBy);
    setMovies(sortedResults);
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    const typeEndpoint = mediaType === "movie" ? "movie" : mediaType === "tv" ? "tv" : "multi";
    const searchEndpoint = `${BASE_URL}/search/${typeEndpoint}?api_key=${API_KEY}&query=${encodeURIComponent(
      searchQuery
    )}&page=1`;
    const response = await fetch(searchEndpoint);
    const data = await response.json();
    const results = data.results || [];
    setMovies(results);
    setLoading(false);
  };

  const sortResults = (results, orderBy) => {
    switch (orderBy) {
      case "popularity":
        return results.sort((a, b) => b.popularity - a.popularity);
      case "rating":
        return results.sort((a, b) => b.vote_average - a.vote_average);
      case "release_date":
        return results.sort((a, b) => new Date(b.release_date || b.first_air_date) - new Date(a.release_date || a.first_air_date));
      default:
        return results;
    }
  };

  const getSortValue = (orderBy) => {
    switch (orderBy) {
      case "popularity":
        return "popularity.desc";
      case "rating":
        return "vote_average.desc";
      case "release_date":
        return "release_date.desc";
      default:
        return "popularity.desc";
    }
  };

  const handleGenreToggle = (id) => {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDropdownClose = (e) => {
    if (!e.target.closest("#genre-filter")) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleDropdownClose);
    return () => {
      window.removeEventListener("click", handleDropdownClose);
    };
  }, []);

  return (
    <div id="genres-page">
      <div id="search-bar">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch} id="search-button">
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>

      <div id="filters">
        <div id="genre-filter">
          <label>Genres:</label>
          <div className="dropdown-toggle" onClick={handleDropdownToggle}>
            {selectedGenres.length
              ? selectedGenres
                  .map((id) => genres.find((g) => g.id === id)?.name || id)
                  .join(", ")
              : "All"}
          </div>
          <div className={`dropdown ${isDropdownOpen ? "open" : ""}`}>
            {genres.map((genre) => (
              <div key={genre.id}>
                <input
                  type="checkbox"
                  id={`genre-${genre.id}`}
                  value={genre.id}
                  onChange={() => handleGenreToggle(genre.id)}
                />
                <label htmlFor={`genre-${genre.id}`}>{genre.name}</label>
              </div>
            ))}
          </div>
        </div>

        <div id="type-filter">
          <label>Type:</label>
          <select value={mediaType} onChange={(e) => setMediaType(e.target.value)}>
            <option value="all">All</option>
            <option value="movie">Movies</option>
            <option value="tv">TV Series</option>
          </select>
        </div>

        <div id="order-by-filter">
          <label>Order By:</label>
          <select value={orderBy} onChange={(e) => setOrderBy(e.target.value)}>
            <option value="popularity">Popularity</option>
            <option value="rating">Rating</option>
            <option value="release_date">Release Date</option>
          </select>
        </div>

        <div id="filter-button">
          <button onClick={fetchMovies}>
            <FontAwesomeIcon icon={faFilter} />
          </button>
        </div>
      </div>

      <div id="selected-genres">
        {selectedGenres.map((id) => {
          const genre = genres.find((g) => g.id === id);
          return genre ? (
            <div
              key={id}
              className="genre-tag"
              onClick={() => handleGenreToggle(id)}
            >
              {genre.name} ✖
            </div>
          ) : null;
        })}
      </div>

      <div id="movies-container">
        {loading ? (
          <div>Loading...</div>
        ) : movies.length > 0 ? (
          movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
        ) : (
          <div>No movies found for the selected filters.</div>
        )}
      </div>
    </div>
  );
}
