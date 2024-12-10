import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const API_KEY = import.meta.env.VITE_KEY;
export default function MovieCard({ movie }) {
  const [detailedInfo, setDetailedInfo] = useState(null);
  const [isInList, setIsInList] = useState(false); 
  const userScorePercentage = movie.vote_average ? (movie.vote_average / 10) * 100 : 0;

  // Check if the movie is already in "My List" on mount
  useEffect(() => {
    const myList = JSON.parse(localStorage.getItem("myList")) || [];
    setIsInList(myList.some((item) => item.id === movie.id));
  }, [movie.id]);

  // Fetch detailed info about the movie
  useEffect(() => {
    const fetchDetails = async () => {
      const endpoint =
        movie.media_type === "tv"
          ? `https://api.themoviedb.org/3/tv/${movie.id}?api_key=${API_KEY}`
          : `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}`;

      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        setDetailedInfo(data);
      } catch (error) {
        console.error("Error fetching detailed information:", error);
      }
    };

    fetchDetails();
  }, [movie.id, movie.media_type]);

  const genres = detailedInfo?.genres?.map((genre) => genre.name).join(", ") || "N/A";

  // Add or remove a movie from "My List"
  const toggleMyList = () => {
    const myList = JSON.parse(localStorage.getItem("myList")) || [];
    if (isInList) {
      const updatedList = myList.filter((item) => item.id !== movie.id);
      localStorage.setItem("myList", JSON.stringify(updatedList));
      setIsInList(false);
    } else {
      myList.push({ ...movie, genres }); 
      localStorage.setItem("myList", JSON.stringify(myList));
      setIsInList(true);
    }
  };

  return (
    <div className="movie-card-container">
      {/* "+" button */}
      <button
        onClick={(e) => {
         
          toggleMyList();
        }}
        className={`add-to-list-button ${isInList ? "in-list" : ""}`}
      >
        {isInList ? "✓" : "+"}
      </button>

      <Link
        to={movie.media_type === "tv" ? `/tv/${movie.id}` : `/movie/${movie.id}`}
      >
        <div className="movie">
          <div>
            <p style={{ color: "#a1a1a1", fontSize: "0.9rem" }}>
              {movie.release_date ? movie.release_date.split("-")[0] : "N/A"}
            </p>
          </div>
          <div>
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "https://via.placeholder.com/400"
              }
              alt={movie.title || movie.name || "No Title"}
              style={{ borderRadius: "8px", maxHeight: "400px", objectFit: "cover" }}
            />
          </div>
          <div>
            <h3 style={{ color: "#f9d3b4", fontSize: "1.2rem", marginBottom: "0.5rem" }}>
              {movie.title || movie.name || "Untitled"}
            </h3>
            <p style={{ color: "#a1a1a1", margin: "0.25rem 0" }}>
              <strong>Type:</strong> {movie.media_type === "tv" ? "TV Series" : "Movie"}
            </p>
            <p style={{ color: "#a1a1a1", margin: "0.25rem 0" }}>
              <strong>Rating: </strong> {movie.vote_average || "N/A"} / 10
            </p>
            <p style={{ color: "#a1a1a1", margin: "0.25rem 0" }}>
              <strong>Votes: </strong> {movie.vote_count || "N/A"}
            </p>
            <p style={{ color: "#a1a1a1", margin: "0.25rem 0" }}>
              <strong>Genres: </strong> {genres}
            </p>
          </div>
          <div className="user-score">
            <CircularProgressbar
              value={userScorePercentage}
              text={`${Math.round(userScorePercentage)}%`}
              strokeWidth={16}
              styles={{
                path: {
                  stroke: "#4caf50",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 11,
                },
                text: {
                  fill: "#fff",
                  fontSize: "20px",
                  fontWeight: "bold",
                },
              }}
            />
          </div>
        </div>
      </Link>
    </div>
  );
}
