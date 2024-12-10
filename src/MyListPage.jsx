import React, { useEffect, useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css'; 
import 'slick-carousel/slick/slick.css'; 
import "./MyListPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5,  
    slidesToSlide: 1,  
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,  
    slidesToSlide: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,  
    slidesToSlide: 1,
  },
};

const MyListPage = (props) => {
  const [myList, setMyList] = useState([]);

  useEffect(() => {
    const storedList = JSON.parse(localStorage.getItem('myList')) || [];
    setMyList(storedList);
  }, []);

  const removeFromList = (id) => {
    const updatedList = myList.filter((item) => item.id !== id);
    setMyList(updatedList);
    localStorage.setItem('myList', JSON.stringify(updatedList));
  };

  const movies = myList.filter((item) => item.media_type === 'movie');
  const tvSeries = myList.filter((item) => item.media_type === 'tv');

  return (
    <div id="my-list-page">
      <h1>WatchList</h1>

      {/* Movies Carousel */}
      <div id="CarouselofmypageMovies" className="carousel-section">
        <h2>Movies</h2>
        <Carousel
          swipeable={true}  
          draggable={true}  
          showDots={true}
          responsive={responsive}
          ssr={true}
          infinite={true}
          autoPlay={true}  
          keyBoardControl={true}
          customTransition="all 1s ease"  
          transitionDuration={500} 
          containerClass="carousel-container"
          removeArrowOnDeviceType={['tablet', 'mobile']}
          deviceType={props.deviceType}
          dotListClass="custom-dot-list-style"
          itemClass="carousel-item-padding-40-px"
        >
          {movies.length > 0 ? (
            movies.map((movie) => (
              <div
                key={movie.id}
                id={`movie-${movie.id}`}
                className="carousel-item"
              >
                <img
                  src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/200'}
                  alt={movie.title || movie.name}
                />
                <h3>{movie.title || movie.name}</h3> 
               
                <button className="remove-button" onClick={() => removeFromList(movie.id)}><FontAwesomeIcon icon={faTrash} /></button>
              </div>
            ))
          ) : (
            <p>No movies in your list.</p>
          )}
        </Carousel>
      </div>

      {/* TV Series Carousel */}
      <div id="CarouselofmypageTvSeries" className="carousel-section">
        <h2>TV Series</h2>
        <Carousel
          swipeable={true}  
          draggable={true}  
          showDots={true}
          responsive={responsive}
          ssr={true}
          infinite={true} 
          autoPlay={true}  
          keyBoardControl={true}
          customTransition="all 1s ease"
          transitionDuration={500}  
          containerClass="carousel-container"
          removeArrowOnDeviceType={['tablet', 'mobile']}
          deviceType={props.deviceType}
          dotListClass="custom-dot-list-style"
          itemClass="carousel-item-padding-40-px"
        >
          {tvSeries.length > 0 ? (
            tvSeries.map((tv) => (
              <div
                key={tv.id}
                id={`tv-${tv.id}`}
                className="carousel-item"
              >
                <img
                  src={tv.poster_path ? `https://image.tmdb.org/t/p/w500${tv.poster_path}` : 'https://via.placeholder.com/200'}
                  alt={tv.title || tv.name}
                />
                <h3>{tv.title || tv.name}</h3>
                {/* Add the remove button */}
                <button className="remove-button" onClick={() => removeFromList(tv.id)}><FontAwesomeIcon icon={faTrash} /></button>
              </div>
            ))
          ) : (
            <p>No TV series in your list.</p>
          )}
        </Carousel>
      </div>
    </div>
  );
};

export default MyListPage;
