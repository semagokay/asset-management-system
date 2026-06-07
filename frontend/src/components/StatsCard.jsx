import React from 'react';

export default function StatsCard({ label, value, icon: Icon, themeClass }) {
  return (
    <div className="card stat-card">
      <div className="stat-info">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
      </div>
      {Icon && (
        <div className={`stat-icon-wrapper ${themeClass || 'stat-blue'}`}>
          <Icon size={24} />
        </div>
      )}
    </div>
  );
}
