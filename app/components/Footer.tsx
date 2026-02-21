import React from 'react';
import '../styles/App.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <nav className="footer-nav">
        <a href="/privacy-policy">Privacy Policy</a>
        <span className="sep"> | </span>
        <a href="/terms-of-service">Terms of Service</a>
      </nav>
      <p className="copyright">© {new Date().getFullYear()} Typing Flow</p>
      <p>
        Made with <img className="textImg" src="/next.svg" alt="Next.js" /> + React <img className="spin textImg" src="/react.svg" alt="React Logo" />
      </p>
    </footer>
  );
}