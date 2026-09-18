import React from 'react';

const Dashboard = () => {
  return (
    <div className="page-container">
      <h1 className="page-title">User Dashboard</h1>
      <p className="page-description" style={{ marginBottom: '30px' }}>
        Here is an overview of your recent activity and statistics. Data is fetched 
        without reloading the whole page!
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px'
      }}>
        <div style={cardStyle}>
          <h3 style={{ color: 'var(--text-secondary)' }}>Total Users</h3>
          <p style={{ fontSize: '2rem', fontWeight: '700', marginTop: '10px' }}>1,248</p>
        </div>
        
        <div style={cardStyle}>
          <h3 style={{ color: 'var(--text-secondary)' }}>Revenue</h3>
          <p style={{ fontSize: '2rem', fontWeight: '700', marginTop: '10px' }}>$34.2k</p>
        </div>
        
        <div style={cardStyle}>
          <h3 style={{ color: 'var(--text-secondary)' }}>Active Sessions</h3>
          <p style={{ fontSize: '2rem', fontWeight: '700', marginTop: '10px' }}>42</p>
        </div>
      </div>
    </div>
  );
};

const cardStyle = {
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid var(--glass-border)',
  borderRadius: '12px',
  padding: '24px',
  textAlign: 'center'
};

export default Dashboard;
