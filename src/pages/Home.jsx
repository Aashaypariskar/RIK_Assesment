import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="page-container">
      <h1>Home Page</h1>
      <p style={{ marginBottom: '20px' }}>Welcome! Click the button below to submit your details.</p>
      
      <div className="btn-group">
        <Link to="/details" className="btn btn-primary">
          Details
        </Link>
      </div>
    </div>
  );
}
