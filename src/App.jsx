import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Trending from "./Trending";
import Genres from "./Genres";
import MovieDetailsPage from "./MovieDetailsPage"; 
import MyListPage from "./MyListPage";
import Footer from "./Footer"; 

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Trending />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/genres" element={<Genres />} />
          <Route path="/movie/:id" element={<MovieDetailsPage />} /> 
          <Route path="/tv/:id" element={<MovieDetailsPage />} />
          <Route path="/my-list" element={<MyListPage />} />
        </Routes>
        <Footer /> 
      </div>
    </Router>
  );
}

export default App;
