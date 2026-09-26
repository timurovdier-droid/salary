import React, { useState, useEffect, useCallback } from 'react';
import BalanceCard from '../../components/BalanceCard/BalanceCard';
import EmptyState from '../../components/EmptyState/EmptyState';
import TransactionList from '../../components/TransactionList/TransactionList';
import Modal from '../../components/Modal/Modal';
import TransactionForm from '../../components/TransactionForm/TransactionForm';
import { getCurrentMonthBalance, getRecentTransactions } from '../../services/summaryService';
import { addIncome, updateIncome, deleteIncome } from '../../services/incomeService';
import { addExpense, updateExpense, deleteExpense } from '../../services/expenseService';
import styles from './Dashboard.module.css';

function Dashboard() {
  // Состояние данных
  const [balance, setBalance] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [recentTransactions, setRecentTransactions] = useState([]);
  
  // Состояние модалки
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Загрузка данных
  const loadData = useCallback(() => {
    const monthBalance = getCurrentMonthBalance();
    setBalance(monthBalance ?? { totalIncome: 0, totalExpense: 0, balance: 0 });
    
    const recent = getRecentTransactions(5);
    setRecentTransactions(Array.isArray(recent) ? recent : []);
  }, []);

  // Первоначальная загрузка
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Открытие модалки для добавления
  const handleOpenAdd = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  // Открытие модалки для редактирования
  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  // Закрытие модалки
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  // Обработка отправки формы (добавление или редактирование)
  const handleSubmit = (formData) => {
    if (editingTransaction) {
      // Режим редактирования
      if (editingTransaction.type === 'income') {
        updateIncome(editingTransaction.id, formData);
      } else {
        updateExpense(editingTransaction.id, formData);
      }
    } else {
      // Режим добавления
      if (formData.type === 'income') {
        addIncome(formData);
      } else {
        addExpense(formData);
      }
    }
    
    handleCloseModal();
    loadData();
  };

  // Удаление транзакции
  const handleDelete = (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту операцию?')) {
      return;
    }
    
    // Находим транзакцию, чтобы определить её тип
    const transaction = recentTransactions.find(t => t.id === id);
    if (!transaction) return;
    
    if (transaction.type === 'income') {
      deleteIncome(id);
    } else {
      deleteExpense(id);
    }
    
    loadData();
  };

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Главная</h1>
      
      {/* Карточки баланса */}
      <div className={styles.cardsGrid}>
        <BalanceCard 
          title="Доходы за месяц" 
          amount={balance.totalIncome ?? 0} 
          type="income"
        />
        <BalanceCard 
          title="Расходы за месяц" 
          amount={balance.totalExpense ?? 0} 
          type="expense"
        />
        <BalanceCard 
          title="Баланс" 
          amount={balance.balance ?? 0} 
          type="balance"
        />
      </div>
      
      {/* Секция последних операций */}
      <div className={styles.recentSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Последние операции</h2>
          <button 
            className={styles.addButton}
            onClick={handleOpenAdd}
          >
            <span>+</span>
            <span>Добавить</span>
          </button>
        </div>
        
        <TransactionList 
          transactions={recentTransactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Модалка с формой */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTransaction ? 'Редактировать операцию' : 'Новая операция'}
      >
        <TransactionForm
          editData={editingTransaction}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
}

export default Dashboard;