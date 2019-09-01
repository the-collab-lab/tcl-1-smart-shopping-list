import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <Link to="/add-item">
        <button type="submit">Add Item</button>
      </Link>
      <Link to="/">
        <button type="submit">My List</button>
      </Link>
    </footer>
  );
};

export default Footer;
