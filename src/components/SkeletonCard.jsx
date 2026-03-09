import React from 'react';

const SkeletonCard = ({ tema, isDarkMode }) => {
  return (
    <div className="animate-pulse" style={{ padding: '20px', borderRadius: '12px', backgroundColor: tema.fundoCard, border: `1px solid ${tema.borda}`, display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
      <div style={{ height: '24px', width: '30%', backgroundColor: isDarkMode ? '#334155' : '#e2e8f0', borderRadius: '6px' }}></div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <div style={{ height: '26px', width: '100px', backgroundColor: isDarkMode ? '#334155' : '#e2e8f0', borderRadius: '6px' }}></div>
        <div style={{ height: '26px', width: '90px', backgroundColor: isDarkMode ? '#334155' : '#e2e8f0', borderRadius: '6px' }}></div>
      </div>
      <div style={{ height: '14px', width: '90%', backgroundColor: isDarkMode ? '#334155' : '#e2e8f0', borderRadius: '4px', marginTop: '10px' }}></div>
      <div style={{ height: '14px', width: '70%', backgroundColor: isDarkMode ? '#334155' : '#e2e8f0', borderRadius: '4px' }}></div>
    </div>
  );
};

export default SkeletonCard;