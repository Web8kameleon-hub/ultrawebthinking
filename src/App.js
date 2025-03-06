import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

function Home() {
  return <h2>Kjo është faqja kryesore</h2>;
}

function About() {
  return <h2>Rreth nesh</h2>;
}

function Contact() {
  return <h2>Kontakto me ne</h2>;
}

function App() {
  return (
    <Router>
      <div className="container">
        <nav>
          <ul>
            <li><Link to="/">Kreu</Link></li>
            <li><Link to="/about">Rreth nesh</Link></li>
            <li><Link to="/contact">Kontakt</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
