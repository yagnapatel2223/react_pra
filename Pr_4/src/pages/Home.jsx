import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <h1 className="page-title">Welcome to AeroSpace</h1>
      <p className="page-description">
        This is a Single Page Application (SPA) demonstrating the power of React Router.
        Navigate between pages seamlessly without any full-page reloads. Enjoy the 
        fast, app-like experience on the web!
      </p>
      
      <div style={{ marginTop: '40px' }}>
        <button 
          onClick={() => navigate('/dashboard')}
          style={{
            background: 'linear-gradient(135deg, var(--primary-color), var(--primary-hover))',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            boxShadow: '0 4px 14px rgba(244, 63, 94, 0.4)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          Go to Dashboard 🚀
        </button>
      </div>
    </div>
  );
};

export default Home;
