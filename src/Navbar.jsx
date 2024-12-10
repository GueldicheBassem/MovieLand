import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom"; // Import NavLink
import "./Navbar.css";

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0 || document.querySelector(".navbar:hover")) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isVisible ? "visible" : ""}`}>
      <div className="logo">MovieLand</div>
      <div className="nav-links">
       
        <NavLink 
          to="/trending" 
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Trending
        </NavLink>
        <NavLink 
          to="/genres" 
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Genres
        </NavLink>
        <NavLink 
          to="/my-list" 
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          My List
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
