
import React from "react";
import "./Footer.css"; 

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <a href="/about">About Us</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
        </div>
        <div className="footer-social">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Movie Land. All Rights Reserved.</p>
          <p>Made with ♥ By Bassem&Mootaz </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
