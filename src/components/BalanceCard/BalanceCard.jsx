import React from 'react';
import styles from './BalanceCard.module.css';

function BalanceCard({ title, amount, type = 'balance' }) {
  // Fallback для amount
  const displayAmount = amount ?? 0;
  
  // Определяем класс в зависимости от типа
  const typeClass = styles[type] || styles.balance;
  
  return (
    <div className={`${styles.card} ${typeClass}`}>
      <div className={styles.title}>{title || 'Заголовок'}</div>
      <div className={styles.amount}>
        {displayAmount.toLocaleString('ru-RU')} сум
      </div>
    </div>
  );
}

export default BalanceCard;