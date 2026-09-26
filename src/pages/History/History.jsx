import React, { useState, useEffect, useCallback, useMemo } from 'react';
import TransactionList from '../../components/TransactionList/TransactionList';
import Modal from '../../components/Modal/Modal';
import TransactionForm from '../../components/TransactionForm/TransactionForm';
import { getIncomes, deleteIncome } from '../../services/incomeService';
import { getExpenses, deleteExpense } from '../../services/expenseService';
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
  const loadData = useCallback(() => {
    const incomes = getIncomes();
    const expenses = getExpenses();
    
    // Объединяем и сортируем по дате (новые сначала)
    const combined = [...incomes, ...expenses].sort((a, b) => {
      const dateCompare = (b.date || '').localeCompare(a.date || '');
      if (dateCompare !== 0) return dateCompare;
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    });
    
    setAllTransactions(combined);
  }, []);

  // Первоначальная загрузка
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Применение фильтров
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter(transaction => {
      // Фильтр по типу
      if (filters.type && transaction.type !== filters.type) {
        return false;
      }
      
      // Фильтр по категории
      if (filters.category && transaction.category !== filters.category) {
        return false;
      }
      
      // Фильтр по дате от
      if (filters.dateFrom && transaction.date < filters.dateFrom) {
        return false;
      }
      
      // Фильтр по дате до
      if (filters.dateTo && transaction.date > filters.dateTo) {
        return false;
      }
      
      return true;
    });
  }, [allTransactions, filters]);

  // Категории для фильтра (зависят от выбранного типа)
  const availableCategories = useMemo(() => {
    if (filters.type === 'income') {
      return INCOME_CATEGORIES;
    } else if (filters.type === 'expense') {
      return EXPENSE_CATEGORIES;
    }
    // Если тип не выбран, показываем все категории
    return [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];
  }, [filters.type]);

  // Обработка изменения фильтров
  const handleFilterChange = (field, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [field]: value };
      
      // Если изменился тип, сбрасываем категорию
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
  const handleSubmit = (formData) => {
    // Для простоты всегда добавляем новую операцию
    // В реальном приложении здесь была бы логика обновления
    if (formData.type === 'income') {
      const { addIncome } = require('../../services/incomeService');
      addIncome(formData);
    } else {
      const { addExpense } = require('../../services/expenseService');
      addExpense(formData);
    }
    
    handleCloseModal();
    loadData();
  };

  // Удаление транзакции
  const handleDelete = (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту операцию?')) {
      return;
    }
    
    const transaction = allTransactions.find(t => t.id === id);
    if (!transaction) return;
    
    if (transaction.type === 'income') {
      deleteIncome(id);
    } else {
      deleteExpense(id);
    }
    
    loadData();
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