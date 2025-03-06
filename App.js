import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function Home() {
  return <h1>Kjo është faqja kryesore</h1>;
}

function About() {
  return <h1>Rreth nesh</h1>;
}

function Contact() {
  return <h1>Kontakt</h1>;
}

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;
