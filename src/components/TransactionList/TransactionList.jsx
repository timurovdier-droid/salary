import React from 'react';
import EmptyState from '../EmptyState/EmptyState';
import styles from './TransactionList.module.css';

// Маппинг иконок для категорий
const CATEGORY_ICONS = {
  // Доходы
  salary: '💼',
  freelance: '💻',
  bonus: '🎁',
  debt_return: '🤝',
  deposit_interest: '🏦',
  gift: '🎀',
  
  // Расходы
  groceries: '🛒',
  utilities: '💡',
  rent: '🏠',
  subscriptions: '📱',
  transport: '🚗',
  health: '💊',
  clothing: '👕',
  entertainment: '🎬',
  communication: '📞',
  
  // Прочее
  other: '📦'
};

// Маппинг названий категорий
const CATEGORY_LABELS = {
  // Доходы
  salary: 'Зарплата',
  freelance: 'Подработка',
  bonus: 'Премия',
  debt_return: 'Возврат долга',
  deposit_interest: 'Проценты по вкладу',
  gift: 'Подарок',
  
  // Расходы
  groceries: 'Продукты',
  utilities: 'Коммуналка',
  rent: 'Аренда',
  subscriptions: 'Подписки',
  transport: 'Транспорт',
  health: 'Здоровье',
  clothing: 'Одежда',
  entertainment: 'Развлечения',
  communication: 'Связь',
  
  // Прочее
  other: 'Прочее'
};

// Форматирование даты
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

function TransactionList({ transactions = [], onEdit, onDelete }) {
  // Если список пуст, показываем EmptyState
  if (!transactions || transactions.length === 0) {
    return (
      <EmptyState 
        icon="📋"
        title="Нет операций"
        description="Добавьте первую операцию, чтобы увидеть её здесь"
      />
    );
  }

  return (
    <div className={styles.list}>
      {transactions.map((transaction) => {
        const icon = CATEGORY_ICONS[transaction.category] || CATEGORY_ICONS.other;
        const label = CATEGORY_LABELS[transaction.category] || transaction.category;
        const amountClass = transaction.type === 'income' ? styles.income : styles.expense;
        const amountPrefix = transaction.type === 'income' ? '+' : '-';

        return (
          <div key={transaction.id} className={styles.row}>
            <div className={styles.categoryIcon}>{icon}</div>
            
            <div className={styles.info}>
              <div className={styles.category}>{label}</div>
              {transaction.comment && (
                <div className={styles.comment}>{transaction.comment}</div>
              )}
              <div className={styles.date}>{formatDate(transaction.date)}</div>
            </div>

            <div className={`${styles.amount} ${amountClass}`}>
              {amountPrefix}{(transaction.amount ?? 0).toLocaleString('ru-RU')} сум
            </div>

            <div className={styles.actions}>
              {onEdit && (
                <button 
                  className={styles.actionButton}
                  onClick={() => onEdit(transaction)}
                  aria-label="Редактировать"
                >
                  ✏️
                </button>
              )}
              {onDelete && (
                <button 
                  className={`${styles.actionButton} ${styles.deleteButton}`}
                  onClick={() => onDelete(transaction.id)}
                  aria-label="Удалить"
                >
                  🗑️
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TransactionList;