import React from 'react';

const About = () => {
  return (
    <div className="page-container">
      <h1 className="page-title">About Us</h1>
      <p className="page-description">
        We are passionate about creating stunning, performant web applications. 
        Using tools like Vite and React Router, we build seamless Single Page Applications 
        that deliver native-like user experiences directly in the browser.
      </p>
      
      <div style={{
        marginTop: '30px',
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.03)',
        borderLeft: '4px solid var(--primary-color)',
        borderRadius: '0 8px 8px 0'
      }}>
        <h3 style={{ marginBottom: '10px', color: 'var(--text-primary)' }}>Why React Router?</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          React Router allows us to render different components based on the URL, 
          managing the browser history natively while keeping the app state intact.
        </p>
      </div>
    </div>
  );
};

export default About;
