import React from 'react';
import Link from "next/link";
import '../styles/App.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <nav className="footer-nav">
        <Link href="/privacy-policy">Privacy Policy</Link>
        <span className="sep"> | </span>
        <Link href="/terms-of-service">Terms of Service</Link>
      </nav>
        <p className="made-with">
          Made with <img className="textImg" src="/next.svg" alt="Next.js" /> + React <img className="spin textImg" style={{ width: "1.35em", height: "1.35em" }} src="/react.svg" alt="React Logo" />
        </p>
        <p className="copyright">
          © {new Date().getFullYear()} Typing Flow
        </p>
    </footer>
  );
}