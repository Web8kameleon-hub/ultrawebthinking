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

function App() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("Ultrawebthinking 🚀");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  const increaseCount = () => {
    setCount(count + 1);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <motion.div 
      className="container"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 className="title">{message}</motion.h1>
      <p>Ke klikuar <strong>{count}</strong> herë!</p>

      <input 
        type="text" 
        className="input"
        placeholder="Ndrysho mesazhin..."
        onChange={(e) => setMessage(e.target.value)}
      />

      <motion.button 
        className="btn"
        whileHover={{ scale: 1.1, backgroundColor: "#ff4500" }}
        whileTap={{ scale: 0.9 }}
        onClick={increaseCount}
      >
        Kliko këtu
      </motion.button>

      <motion.button 
        className="btn theme-toggle"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleTheme}
      >
        {darkMode ? "Kalo në Light Mode 🌞" : "Kalo në Dark Mode 🌙"}
      </motion.button>
    </motion.div>
  );
}

export default App;
