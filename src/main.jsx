import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Salary Tracker</h1>
      <p>Глобальные стили применены</p>
    </div>
  </React.StrictMode>
);