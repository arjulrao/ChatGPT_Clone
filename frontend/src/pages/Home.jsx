import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{padding: 40}}>
      <h2>Welcome</h2>
      <p>This is a placeholder home page. Use the links to navigate.</p>
      <p><Link to="/login">Login</Link> · <Link to="/register">Register</Link></p>
    </div>
  );
}

export default Home;
