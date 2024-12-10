import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './MovieDetailsPage.css';  // Import the CSS file
const API_KEY = import.meta.env.VITE_KEY;
const MediaDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mediaDetails, setMediaDetails] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const trailerRef = useRef(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    const fetchMediaDetails = async () => {
      try {
        const mediaType = window.location.pathname.includes("tv") ? "tv" : "movie"; 
        const mediaResponse = await fetch(
          `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${API_KEY}&append_to_response=credits,similar,images`
        );
        const mediaData = await mediaResponse.json();
        setMediaDetails(mediaData);

        const videoResponse = await fetch(
          `https://api.themoviedb.org/3/${mediaType}/${id}/videos?api_key=${API_KEY}`
        );
        const videoData = await videoResponse.json();

        // Filter to get the main trailer
        const mainTrailer = videoData.results.find(video => video.type === "Trailer");
        setTrailer(mainTrailer);
      } catch (error) {
        console.error("Error fetching media details:", error);
      }
    };

    fetchMediaDetails();
  }, [id]);

  const userScorePercentage = mediaDetails?.vote_average
    ? (mediaDetails.vote_average / 10) * 100
    : 0;

  const carouselSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } },
    ],
  };

  const scrollToTrailer = () => {
    if (trailerRef.current) {
      trailerRef.current.scrollIntoView({ behavior: "smooth" });
      if (iframeRef.current) {
        const videoSrc = iframeRef.current.src;
        iframeRef.current.src = `${videoSrc}?autoplay=1`; 
      }
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          if (iframeRef.current && !iframeRef.current.src.includes('autoplay=1')) {
            const videoSrc = iframeRef.current.src;
            iframeRef.current.src = `${videoSrc}?autoplay=1`;
          }
        }
      },
      { threshold: 0.5 }
    );

    if (trailerRef.current) observer.observe(trailerRef.current);
    return () => {
      if (trailerRef.current) observer.unobserve(trailerRef.current);
    };
  }, []);

  if (!mediaDetails) return <div>Loading...</div>;

  return (
    <div id="movie-details-page">
      <div className="back-arrow" onClick={() => navigate(-1)}>
        <i className="fas fa-arrow-left"></i> Back
      </div>

      <div id="movie-details-header">
        <div className="poster-container">
          <img
            src={mediaDetails.poster_path
              ? `https://image.tmdb.org/t/p/w500${mediaDetails.poster_path}`
              : "https://via.placeholder.com/500"}
            alt={mediaDetails.title || mediaDetails.name}
            id="movie-poster"
          />
        </div>
        
        <div className="movie-info">
  <div className="stats-container">
    <div className="movie-info-text">
      <p>Title: {mediaDetails.title || mediaDetails.name}</p>
      <p><strong>Release Date:</strong> {mediaDetails.release_date || mediaDetails.first_air_date}</p>
      <p><strong>Rating:</strong> {mediaDetails.vote_average} / 10</p>
      
      {/* Display Genres */}
      {mediaDetails.genres && mediaDetails.genres.length > 0 && (
        <p>
          <strong>Genres:</strong> {mediaDetails.genres.map(genre => genre.name).join(", ")}
        </p>
      )}
      
      {/* Conditional Runtime/Episode Length */}
      {mediaDetails?.seasons?.length > 0 ? (
        mediaDetails?.last_episode_to_air?.runtime > 0 ? (
          <p><strong>Episode Length:</strong> {mediaDetails.last_episode_to_air?.runtime} min</p>
        ) : (
          <p><strong>Runtime:</strong> {mediaDetails?.last_episode_to_air?.runtime || "N/A"} min</p>
        )
      ) : (
        <p><strong>Runtime:</strong> {mediaDetails?.runtime || "N/A"} min</p>
      )}

      {/* TV Series Specific Info */}
      {mediaDetails.number_of_seasons && (
        <p><strong>Seasons:</strong> {mediaDetails.number_of_seasons}</p>
      )}
      {mediaDetails.number_of_episodes && (
        <p><strong>Episodes:</strong> {mediaDetails.number_of_episodes}</p>
      )}

      <div className="play-trailer" onClick={scrollToTrailer}>
        <i className="fas fa-play"></i> Play Trailer
      </div>
    </div>
    <div id="user-score">
      <CircularProgressbar
        value={userScorePercentage}
        text={`${Math.round(userScorePercentage)}%`}
        styles={buildStyles({
          textColor: "#fff",
          pathColor: "#4caf50",
          trailColor: "#555",
        })}
      />
    </div>
  </div>
  <div className="movie-overview">
    <h3>Overview</h3>
    <p>{mediaDetails.overview}</p>
  </div>
</div>
        
      </div>

      {/* Posters Carousel */}
      {mediaDetails.images?.posters?.length > 0 && (
        <div className="movie-posters-carousel">
          <h3>Posters</h3>
          <Slider {...carouselSettings}>
            {mediaDetails.images.posters.map((poster, index) => (
              <div key={index}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${poster.file_path}`}
                  alt={`Poster ${index + 1}`}
                  className="carousel-poster"
                />
              </div>
            ))}
          </Slider>
        </div>
      )}

      {/* Trailer Section */}
      {trailer && trailer.key ? (
        <div className="movie-trailer" ref={trailerRef}>
          <h3>Trailer</h3>
          <div className="trailer-video">
            <iframe
              ref={iframeRef}
              width="100%"
              height="500"
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title="Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      ) : (
        <p>No main trailer available.</p>
      )}

      {/* Cast Section */}
      <div className="movie-cast">
        <h3>Cast</h3>
        <div className="cast-list">
          {mediaDetails.credits.cast.slice(0, 6).map((cast, index) => (
            <div className="cast-member" key={index}>
              <img
                src={cast.profile_path
                  ? `https://image.tmdb.org/t/p/w500${cast.profile_path}`
                  : "https://via.placeholder.com/150"}
                alt={cast.name}
                className="cast-image"
              />
              <p>{cast.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Similar Media Section */}
      <div className="similar-movies">
        <h3>Similar Movies/TV Shows</h3>
        <div className="similar-movies-list">
          {mediaDetails.similar.results.slice(0, 5).map((media, index) => (
            <div className="similar-movie-card" key={index}>
              <img
                src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
                alt={media.title || media.name}
                className="similar-movie-image"
              />
              <p>{media.title || media.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MediaDetailsPage;
