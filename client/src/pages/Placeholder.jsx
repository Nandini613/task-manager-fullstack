import React from 'react';
import { useLocation } from 'react-router-dom';

const Placeholder = () => {
  const location = useLocation();
  const pageName = location.pathname.replace('/', '').replace('-', ' ') || 'Page';

  return (
    <div className="app-wrapper" style={{ minHeight: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container" style={{ textAlign: 'center', padding: '64px' }}>
        <h1 style={{ fontSize: '2.5rem', textTransform: 'capitalize', marginBottom: '16px' }}>{pageName}</h1>
        <p className="subtitle">This feature is coming soon.</p>
      </div>
    </div>
  );
};

export default Placeholder;
