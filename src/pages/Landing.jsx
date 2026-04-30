import React from 'react';

const Landing = () => {
  return (
    <div style={{ 
      backgroundColor: 'black', 
      color: 'white', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ color: '#f97316' }}>TOKCER AI - LANDING PAGE</h1>
      <p>Siti sedang melakukan diagnosis darurat.</p>
      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #f97316' }}>
        Status: SISTEM BERJALAN
      </div>
    </div>
  );
};

export default Landing;
