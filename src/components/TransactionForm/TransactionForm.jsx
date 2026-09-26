import React, { useState, useEffect } from 'react';
import styles from './TransactionForm.module.css';

// Fallback категории доходов (будут заменены на константы из utils/constants.js)
const INCOME_CATEGORIES_FALLBACK = [
  { id: 'salary', label: 'Зарплата' },
  { id: 'freelance', label: 'Подработка' },
  { id: 'bonus', label: 'Премия' },
  { id: 'debt_return', label: 'Возврат долга' },
  { id: 'deposit_interest', label: 'Проценты по вкладу' },
  { id: 'gift', label: 'Подарок' },
  { id: 'other', label: 'Прочее' },
];

// Fallback категории расходов (будут заменены на константы из utils/constants.js)
const EXPENSE_CATEGORIES_FALLBACK = [
  { id: 'groceries', label: 'Продукты' },
  { id: 'utilities', label: 'Коммуналка' },
  { id: 'rent', label: 'Аренда' },
  { id: 'subscriptions', label: 'Подписки' },
  { id: 'transport', label: 'Транспорт' },
  { id: 'health', label: 'Здоровье' },
  { id: 'clothing', label: 'Одежда' },
  { id: 'entertainment', label: 'Развлечения' },
  { id: 'communication', label: 'Связь' },
  { id: 'other', label: 'Прочее' },
];

function TransactionForm({ onSubmit, onCancel, editData }) {
  // Инициализация состояния формы
  const [formData, setFormData] = useState({
    type: 'expense',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    comment: ''
  });

  // Обновление формы при изменении editData
  useEffect(() => {
    if (editData) {
      setFormData({
        type: editData.type || 'expense',
        category: editData.category || '',
        amount: editData.amount?.toString() || '',
        date: editData.date || new Date().toISOString().split('T')[0],
        comment: editData.comment || ''
      });
    }
  }, [editData]);

  // Получение категорий в зависимости от типа операции
  const categories = formData.type === 'income' 
    ? INCOME_CATEGORIES_FALLBACK 
    : EXPENSE_CATEGORIES_FALLBACK;

  // Обработка изменения типа операции
  const handleTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      type,
      category: '' // Сбрасываем категорию при смене типа
    }));
  };

  // Обработка изменения полей формы
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Обработка отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Валидация
    if (!formData.category || !formData.amount || !formData.date) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    // Преобразование данных
    const submissionData = {
      ...formData,
      amount: parseFloat(formData.amount) || 0,
      id: editData?.id || crypto.randomUUID()
    };

    onSubmit?.(submissionData);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* Переключатель типа операции */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Тип операции</label>
        <div className={styles.typeToggle}>
          <button
            type="button"
            className={`${styles.typeButton} ${formData.type === 'income' ? styles.typeButtonActiveIncome : ''}`}
            onClick={() => handleTypeChange('income')}
          >
            Доход
          </button>
          <button
            type="button"
            className={`${styles.typeButton} ${formData.type === 'expense' ? styles.typeButtonActiveExpense : ''}`}
            onClick={() => handleTypeChange('expense')}
          >
            Расход
          </button>
        </div>
      </div>

      {/* Категория */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Категория *</label>
        <select
          className={styles.select}
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          required
        >
          <option value="">Выберите категорию</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Сумма и дата */}
      <div className={styles.grid}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Сумма (сум) *</label>
          <input
            type="number"
            className={styles.input}
            value={formData.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            placeholder="0"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Дата *</label>
          <input
            type="date"
            className={styles.input}
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            required
          />
        </div>
      </div>

      {/* Комментарий */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Комментарий</label>
        <textarea
          className={styles.textarea}
          value={formData.comment}
          onChange={(e) => handleChange('comment', e.target.value)}
          placeholder="Необязательное примечание"
        />
      </div>

      {/* Кнопки действий */}
      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.button} ${styles.cancelButton}`}
          onClick={() => onCancel?.()}
        >
          Отмена
        </button>
        <button
          type="submit"
          className={`${styles.button} ${styles.submitButton}`}
        >
          {editData ? 'Сохранить' : 'Добавить'}
        </button>
      </div>
    </form>
  );
}

export default TransactionForm;