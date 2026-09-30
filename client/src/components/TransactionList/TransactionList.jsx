import React from 'react';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../utils/constants';
import styles from './TransactionList.module.css';

// Функция для форматирования числа с пробелами
const formatAmount = (amount) => {
  if (!amount) return '0';
  return Math.abs(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

function TransactionList({ transactions, onEdit, onDelete }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Нет операций</p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {transactions.map((transaction) => {
        // Определяем тип операции по полю type из базы данных
        const type = transaction.type;
        const isIncome = type === 'income';
        
        // Получаем название категории
        const allCategories = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];
        const category = allCategories.find(c => c.id === transaction.category);
        const categoryName = category?.label || transaction.category || 'Прочее';
        
        // Форматируем сумму
        const displayAmount = `${formatAmount(transaction.amount)} сум`;

        return (
          <div key={transaction.id} className={`${styles.item} ${isIncome ? styles.incomeItem : styles.expenseItem}`}>
            <div className={styles.icon}>
              {isIncome ? '' : '💸'}
            </div>
            <div className={styles.info}>
              <div className={styles.category}>{categoryName}</div>
              <div className={styles.date}>{transaction.date}</div>
            </div>
            <div className={`${styles.amount} ${isIncome ? styles.incomeAmount : styles.expenseAmount}`}>
              {isIncome ? '+' : '-'}{displayAmount}
            </div>
            <div className={styles.actions}>
              <button 
                className={styles.actionBtn}
                onClick={() => onEdit(transaction)}
                title="Редактировать"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button 
                className={`${styles.actionBtn} ${styles.deleteBtn}`}
                onClick={() => onDelete(transaction.id)}
                title="Удалить"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  <line x1="10" y1="11" x2="10" y2="17"/>
                  <line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TransactionList;