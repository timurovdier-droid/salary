import React, { useState, useEffect, useCallback } from 'react';
import PieChart from '../../components/PieChart/PieChart';
import BarChart from '../../components/BarChart/BarChart';
import { getByCategory, getMonthlySummary } from '../../services/summaryService';
import styles from './Analytics.module.css';

function Analytics() {
  // Состояние данных для графиков
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  
  // Состояние периода для круговой диаграммы
  const [period, setPeriod] = useState('month'); // 'month', 'year', 'all'

  // Загрузка данных
  const loadData = useCallback(() => {
    // Получаем даты для фильтрации
    const now = new Date();
    let dateFrom, dateTo;
    
    if (period === 'month') {
      // Текущий месяц
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      dateFrom = `${year}-${month}-01`;
      const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();
      dateTo = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;
    } else if (period === 'year') {
      // Текущий год
      const year = now.getFullYear();
      dateFrom = `${year}-01-01`;
      dateTo = `${year}-12-31`;
    } else {
      // Все время
      dateFrom = undefined;
      dateTo = undefined;
    }
    
    // Данные для круговой диаграммы (расходы по категориям)
    const categoryStats = getByCategory('expense', dateFrom, dateTo);
    setCategoryData(Array.isArray(categoryStats) ? categoryStats : []);
    
    // Данные для столбчатого графика (помесячная сводка)
    const monthlyStats = getMonthlySummary(6);
    setMonthlyData(Array.isArray(monthlyStats) ? monthlyStats : []);
  }, [period]);

  // Первоначальная загрузка и при изменении периода
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Обработка изменения периода
  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  return (
    <div className={styles.analytics}>
      <h1 className={styles.title}>Аналитика</h1>
      
      {/* Сетка графиков */}
      <div className={styles.chartsGrid}>
        {/* Круговая диаграмма расходов */}
        <div className={styles.chartContainer}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <h2 className={styles.chartTitle}>Расходы по категориям</h2>
            
            {/* Переключатель периода */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handlePeriodChange('month')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  backgroundColor: period === 'month' ? '#2563eb' : 'white',
                  color: period === 'month' ? 'white' : '#6b7280',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Месяц
              </button>
              <button
                onClick={() => handlePeriodChange('year')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  backgroundColor: period === 'year' ? '#2563eb' : 'white',
                  color: period === 'year' ? 'white' : '#6b7280',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Год
              </button>
              <button
                onClick={() => handlePeriodChange('all')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  backgroundColor: period === 'all' ? '#2563eb' : 'white',
                  color: period === 'all' ? 'white' : '#6b7280',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Всё время
              </button>
            </div>
          </div>
          
          <PieChart data={categoryData} />
        </div>

        {/* Столбчатый график доходов/расходов */}
        <div className={styles.chartContainer}>
          <h2 className={styles.chartTitle}>Доходы и расходы по месяцам</h2>
          <BarChart data={monthlyData} />
        </div>
      </div>
    </div>
  );
}

export default Analytics;