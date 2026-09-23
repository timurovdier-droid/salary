import React from 'react';
import styles from './Dashboard.module.css';

// Временная заглушка для BalanceCard (будет заменена на реальный компонент)
const BalanceCardPlaceholder = ({ title, amount, color }) => (
  <div style={{
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    borderLeft: `4px solid ${color || '#2563eb'}`
  }}>
    <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>
      {title || 'Заголовок'}
    </div>
    <div style={{ fontSize: '32px', fontWeight: '700', color: '#111827' }}>
      {amount ?? 0} ₽
    </div>
  </div>
);

// Временная заглушка для EmptyState (будет заменена на реальный компонент)
const EmptyStatePlaceholder = () => (
  <div style={{
    textAlign: 'center',
    padding: '48px 24px',
    color: '#6b7280'
  }}>
    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#111827' }}>
      Нет операций
    </h3>
    <p style={{ marginBottom: '24px' }}>
      Добавьте первую операцию, чтобы начать отслеживать финансы
    </p>
  </div>
);

function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Главная</h1>
      
      {/* Карточки баланса */}
      <div className={styles.cardsGrid}>
        <BalanceCardPlaceholder 
          title="Доходы за месяц" 
          amount={0} 
          color="#10b981" 
        />
        <BalanceCardPlaceholder 
          title="Расходы за месяц" 
          amount={0} 
          color="#ef4444" 
        />
        <BalanceCardPlaceholder 
          title="Баланс" 
          amount={0} 
          color="#2563eb" 
        />
      </div>
      
      {/* Секция последних операций */}
      <div className={styles.recentSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Последние операции</h2>
          <button className={styles.addButton}>
            <span>+</span>
            <span>Добавить</span>
          </button>
        </div>
        
        <EmptyStatePlaceholder />
      </div>
    </div>
  );
}

export default Dashboard;