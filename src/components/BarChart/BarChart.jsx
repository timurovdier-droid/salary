import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Кастомный tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: 'white',
        padding: '12px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ fontWeight: 600, marginBottom: '8px' }}>
          {label}
        </div>
        {payload.map((item, index) => (
          <div key={index} style={{ color: item.color, marginBottom: '4px' }}>
            {item.name}: {item.value.toLocaleString('ru-RU')} сум
          </div>
        ))}
      </div>
    );
  }
  return null;
};

function BarChart({ data = [], title }) {
  // Если данных нет, показываем заглушку
  if (!data || data.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '300px',
        color: '#6b7280',
        textAlign: 'center',
        padding: '24px'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
        <div style={{ fontSize: '16px', color: '#9ca3af' }}>
          Нет данных для отображения
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '400px' }}>
      {title && (
        <h3 style={{
          fontSize: '18px',
          fontWeight: 600,
          color: '#111827',
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          {title}
        </h3>
      )}
      
      <ResponsiveContainer width="100%" height="90%">
        <RechartsBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="month" 
            stroke="#6b7280"
            style={{ fontSize: '14px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '14px' }}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="top" 
            height={36}
            wrapperStyle={{ fontSize: '14px' }}
          />
          <Bar 
            dataKey="income" 
            fill="#10b981" 
            name="Доходы"
            radius={[8, 8, 0, 0]}
          />
          <Bar 
            dataKey="expense" 
            fill="#ef4444" 
            name="Расходы"
            radius={[8, 8, 0, 0]}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChart;