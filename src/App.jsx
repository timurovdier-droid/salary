import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import styles from './App.module.css';

// Временные заглушки для страниц (будут заменены на реальные компоненты)
const DashboardPlaceholder = () => <div>Dashboard (заглушка)</div>;
const HistoryPlaceholder = () => <div>History (заглушка)</div>;
const AnalyticsPlaceholder = () => <div>Analytics (заглушка)</div>;

function App() {
  return (
    <BrowserRouter>
      <div className={styles.app}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPlaceholder />} />
            <Route path="history" element={<HistoryPlaceholder />} />
            <Route path="analytics" element={<AnalyticsPlaceholder />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;