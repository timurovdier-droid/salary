import React, { useState, useEffect, useCallback } from 'react';
import PieChart from '../../components/PieChart/PieChart';
import BarChart from '../../components/BarChart/BarChart';
import { getByCategory, getMonthlySummary } from '../../services/summaryService';
import styles from './Analytics.module.css';

function Analytics() {
  // Состояние данных для графиков
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  
  // Состояние загрузки
  const [isLoading, setIsLoading] = useState(true);
  
  // Состояние периода для круговой диаграммы
  const [period, setPeriod] = useState('month'); // 'month', 'year', 'all'

  // Загрузка данных (теперь async)
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Получаем даты для фильтрации
      const now = new Date();
      let dateFrom, dateTo;
      
      if (period === 'month') {
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        dateFrom = `${year}-${month}-01`;
        const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();
        dateTo = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;
      } else if (period === 'year') {
        const year = now.getFullYear();
        dateFrom = `${year}-01-01`;
        dateTo = `${year}-12-31`;
      } else {
        dateFrom = undefined;
        dateTo = undefined;
      }
      
      // Параллельная загрузка данных для обоих графиков
      const [categoryStats, monthlyStats] = await Promise.all([
        getByCategory('expense', dateFrom, dateTo),
        getMonthlySummary(6)
      ]);

      setCategoryData(Array.isArray(categoryStats) ? categoryStats : []);
      setMonthlyData(Array.isArray(monthlyStats) ? monthlyStats : []);
    } catch (error) {
      console.error('Ошибка загрузки аналитики:', error);
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  // Первоначальная загрузка и при изменении периода
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Обработка изменения периода
  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  // Простой индикатор загрузки
  if (isLoading) {
    return (
      <div className={styles.analytics}>
        <h1 className={styles.title}>Аналитика</h1>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px',
          color: '#6b7280',
          fontSize: '18px'
        }}>
          Загрузка данных...
        </div>
      </div>
    );
  }

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