import React, { useState, useEffect } from 'react';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../utils/constants';
import styles from './TransactionForm.module.css';

const formatNumberWithSpaces = (value) => {
  if (!value) return '';
  const digits = value.toString().replace(/\D/g, '');
  if (!digits) return '';
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

const parseFormattedNumber = (value) => {
  if (!value) return 0;
  const cleaned = value.toString().replace(/\s/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
};

function TransactionForm({ editData, onSubmit, onCancel }) {
  const [type, setType] = useState(editData?.type || 'expense');
  const [amount, setAmount] = useState(editData ? formatNumberWithSpaces(editData.amount) : '');
  const [date, setDate] = useState(editData?.date || new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState(editData?.category || '');
  const [comment, setComment] = useState(editData?.comment || '');

  useEffect(() => {
    setCategory('');
  }, [type]);

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleAmountChange = (e) => {
    const rawValue = e.target.value;
    const formatted = formatNumberWithSpaces(rawValue);
    setAmount(formatted);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const cleanAmount = parseFormattedNumber(amount);
    
    if (cleanAmount <= 0) {
      alert('Сумма должна быть больше нуля');
      return;
    }

    // ВАЖНО: явно передаём type в formData
    const formData = {
      type: type,
      amount: cleanAmount,
      date,
      category,
      comment
    };

    console.log('Отправляем formData:', formData); // Для отладки
    onSubmit(formData);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.typeToggle}>
        <button
          type="button"
          className={`${styles.toggleBtn} ${type === 'income' ? styles.activeIncome : ''}`}
          onClick={() => setType('income')}
        >
          Доход
        </button>
        <button
          type="button"
          className={`${styles.toggleBtn} ${type === 'expense' ? styles.activeExpense : ''}`}
          onClick={() => setType('expense')}
        >
          Расход
        </button>
      </div>

      <div className={styles.formGroup}>
        <label>Сумма</label>
        <input
          type="text"
          inputMode="numeric"
          required
          value={amount}
          onChange={handleAmountChange}
          placeholder="0"
        />
      </div>

      <div className={styles.formGroup}>
        <label>Дата</label>
        <input
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Категория</label>
        <select
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Выберите категорию</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label>Комментарий</label>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Необязательно"
        />
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>
          Отмена
        </button>
        <button type="submit" className={styles.submitBtn}>
          {editData ? 'Сохранить' : 'Добавить'}
        </button>
      </div>
    </form>
  );
}

export default TransactionForm;