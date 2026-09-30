import React, { useState, useEffect, useCallback, useMemo } from 'react';
import TransactionList from '../../components/TransactionList/TransactionList';
import Modal from '../../components/Modal/Modal';
import TransactionForm from '../../components/TransactionForm/TransactionForm';
import { getIncomes, addIncome, deleteIncome } from '../../services/incomeService';
import { getExpenses, addExpense, deleteExpense } from '../../services/expenseService';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../utils/constants';
import styles from './History.module.css';

function History() {
  // Состояние данных
  const [allTransactions, setAllTransactions] = useState([]);
  
  // Состояние фильтров
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    dateFrom: '',
    dateTo: ''
  });

  // Состояние модалки
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Загрузка всех транзакций
  const loadData = useCallback(async () => {
    try {
      // Передаём большой лимит, чтобы получить все записи для фильтрации на клиенте
      const [incomes, expenses] = await Promise.all([
        getIncomes({ limit: 1000 }),
        getExpenses({ limit: 1000 })
      ]);
      
      // Объединяем и сортируем по дате (новые сначала)
      const combined = [...(incomes || []), ...(expenses || [])].sort((a, b) => {
        const dateCompare = (b.date || '').localeCompare(a.date || '');
        if (dateCompare !== 0) return dateCompare;
        return (b.createdAt || '').localeCompare(a.createdAt || '');
      });
      
      setAllTransactions(combined);
    } catch (error) {
      console.error('Ошибка загрузки транзакций:', error);
    }
  }, []);

  // Первоначальная загрузка
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Применение фильтров
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter(transaction => {
      if (filters.type && transaction.type !== filters.type) {
        return false;
      }
      if (filters.category && transaction.category !== filters.category) {
        return false;
      }
      if (filters.dateFrom && transaction.date < filters.dateFrom) {
        return false;
      }
      if (filters.dateTo && transaction.date > filters.dateTo) {
        return false;
      }
      return true;
    });
  }, [allTransactions, filters]);

  // Категории для фильтра
  const availableCategories = useMemo(() => {
    if (filters.type === 'income') {
      return INCOME_CATEGORIES;
    } else if (filters.type === 'expense') {
      return EXPENSE_CATEGORIES;
    }
    return [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];
  }, [filters.type]);

  // Обработка изменения фильтров
  const handleFilterChange = (field, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [field]: value };
      if (field === 'type') {
        newFilters.category = '';
      }
      return newFilters;
    });
  };

  // Сброс фильтров
  const handleResetFilters = () => {
    setFilters({
      type: '',
      category: '',
      dateFrom: '',
      dateTo: ''
    });
  };

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

  // Обработка отправки формы
  const handleSubmit = async (formData) => {
    try {
      if (formData.type === 'income') {
        await addIncome(formData);
      } else {
        await addExpense(formData);
      }
      
      handleCloseModal();
      await loadData();
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert('Не удалось сохранить операцию');
    }
  };

  // Удаление транзакции
  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту операцию?')) {
      return;
    }
    
    try {
      const transaction = allTransactions.find(t => t.id === id);
      if (!transaction) return;
      
      if (transaction.type === 'income') {
        await deleteIncome(id);
      } else {
        await deleteExpense(id);
      }
      
      await loadData();
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert('Не удалось удалить операцию');
    }
  };

  return (
    <div className={styles.history}>
      <h1 className={styles.title}>История операций</h1>
      
      {/* Панель фильтров */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Тип операции</label>
          <select 
            className={styles.filterSelect}
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <option value="">Все</option>
            <option value="income">Доходы</option>
            <option value="expense">Расходы</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Категория</label>
          <select 
            className={styles.filterSelect}
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">Все категории</option>
            {availableCategories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Дата от</label>
          <input 
            type="date"
            className={styles.filterInput}
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
          />
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Дата до</label>
          <input 
            type="date"
            className={styles.filterInput}
            value={filters.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
          />
        </div>

        <button 
          className={styles.resetButton}
          onClick={handleResetFilters}
        >
          Сбросить
        </button>

        <button 
          className={styles.addButton}
          onClick={handleOpenAdd}
        >
          + Добавить
        </button>
      </div>

      {/* Список транзакций */}
      <div className={styles.listContainer}>
        <TransactionList 
          transactions={filteredTransactions}
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

export default History;