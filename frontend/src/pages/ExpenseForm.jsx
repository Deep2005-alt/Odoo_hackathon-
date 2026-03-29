import React, { useState } from 'react';
import { expenseAPI } from '../services/api';
import './ExpenseForm.css';

const CATEGORIES = [
  'travel',
  'meals',
  'accommodation',
  'office_supplies',
  'training',
  'equipment',
  'other',
];

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR'];

const ExpenseForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    currency: 'USD',
    category: 'travel',
    expense_date: new Date().toISOString().split('T')[0],
    is_urgent: false,
  });
  const [receiptFile, setReceiptFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleFileChange = (e) => {
    setReceiptFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Create expense
      const response = await expenseAPI.create(formData);
      const expenseId = response.data.data.expense.id;

      // Upload receipt if provided
      if (receiptFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('receipt', receiptFile);
        
        await expenseAPI.uploadReceipt(expenseId, formDataUpload);
      }

      // Submit for approval
      await expenseAPI.submit(expenseId);

      setMessage({
        type: 'success',
        text: 'Expense submitted successfully!',
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        amount: '',
        currency: 'USD',
        category: 'travel',
        expense_date: new Date().toISOString().split('T')[0],
        is_urgent: false,
      });
      setReceiptFile(null);

    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to submit expense',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card expense-form-card">
        <h1>Submit New Expense</h1>

        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="expense-form">
          <div className="form-row">
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g., Business Trip to NYC"
                required
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-control"
                required
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.replace('_', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-control"
              rows="3"
              placeholder="Provide details about this expense..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Amount *</label>
              <input
                type="number"
                step="0.01"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="form-control"
                placeholder="0.00"
                min="0.01"
                max="999999.99"
                required
              />
            </div>

            <div className="form-group">
              <label>Currency *</label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="form-control"
                required
              >
                {CURRENCIES.map(curr => (
                  <option key={curr} value={curr}>{curr}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Expense Date *</label>
              <input
                type="date"
                name="expense_date"
                value={formData.expense_date}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Receipt (Optional)</label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="form-control"
            />
            <small className="form-hint">
              Upload receipt image for OCR scanning (JPEG, PNG, PDF)
            </small>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="is_urgent"
                checked={formData.is_urgent}
                onChange={handleChange}
              />
              <span className="ml-2">Mark as urgent (fast-track approval)</span>
            </label>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
