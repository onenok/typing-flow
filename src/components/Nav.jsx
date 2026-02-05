import React, { useState, useEffect } from 'react'
import '../styles/App.css'

export default function Nav() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const pad = (n) => n.toString().padStart(2, '0')
  const timeString = `${time.getFullYear()}-${pad(time.getMonth() + 1)}-${pad(time.getDate())}  ${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`

  return (
    <nav className="site-nav">
      <ul className="nav-list">
        <li className="nav-item"><a href="/">Home</a></li>
        <li className="nav-item"><a href="/features">Features</a></li>
        <li className="nav-item"><a href="/donate">Donate</a></li>
        <li className="nav-item"><a href="/about">About Us</a></li>
        <li className="nav-item"><a href="/contact">Contact</a></li>
      </ul>
      <div className="nav-rightest">
        <span>{timeString}</span>
      </div>
    </nav>
  )
}