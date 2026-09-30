import React, { useState, useEffect, useCallback } from 'react';
import BalanceCard from '../../components/BalanceCard/BalanceCard';
import TransactionList from '../../components/TransactionList/TransactionList';
import Modal from '../../components/Modal/Modal';
import TransactionForm from '../../components/TransactionForm/TransactionForm';
import { getCurrentMonthBalance, getRecentTransactions } from '../../services/summaryService';
import { addIncome, updateIncome, deleteIncome } from '../../services/incomeService';
import { addExpense, updateExpense, deleteExpense } from '../../services/expenseService';
import styles from './Dashboard.module.css';

function Dashboard() {
  const [balance, setBalance] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const monthBalance = await getCurrentMonthBalance();
      setBalance(monthBalance || { totalIncome: 0, totalExpense: 0, balance: 0 });
      
      const recent = await getRecentTransactions(5);
      console.log('Загруженные транзакции:', recent); // Для отладки
      setRecentTransactions(Array.isArray(recent) ? recent : []);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenAdd = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleEdit = (transaction) => {
    console.log('Редактирование:', transaction); // Для отладки
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleSubmit = async (formData) => {
    try {
      console.log('Отправка формы:', formData);
      
      if (editingTransaction) {
        if (formData.type === 'income') {
          await updateIncome(editingTransaction.id, formData);
        } else {
          await updateExpense(editingTransaction.id, formData);
        }
      } else {
        if (formData.type === 'income') {
          await addIncome(formData);
        } else if (formData.type === 'expense') {
          await addExpense(formData);
        }
      }
      
      handleCloseModal();
      await loadData();
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert('Не удалось сохранить операцию');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту операцию?')) {
      return;
    }
    
    try {
      console.log('Удаление ID:', id); // Для отладки
      
      // Находим транзакцию по ID
      const transaction = recentTransactions.find(t => t.id === id);
      console.log('Найденная транзакция:', transaction); // Для отладки
      
      if (!transaction) {
        console.error('Транзакция не найдена');
        alert('Транзакция не найдена');
        return;
      }
      
      // Определяем тип и удаляем из соответствующей таблицы
      if (transaction.type === 'income') {
        console.log('Удаляем доход:', id);
        await deleteIncome(id);
      } else {
        console.log('Удаляем расход:', id);
        await deleteExpense(id);
      }
      
      console.log('Удаление завершено, перезагружаем данные');
      await loadData();
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert('Не удалось удалить операцию');
    }
  };

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Главная</h1>
      
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