import React from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-text">
          Ultrawebthinking © {currentYear} – Të gjitha të drejtat të rezervuara.
        </p>
        <p className="footer-subtext">
          Ndërtuar me pasion për inovacion, mendim të përbashkët dhe të ardhmen e Web8.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
