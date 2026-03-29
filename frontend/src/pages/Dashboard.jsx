import React, { useState, useEffect } from 'react';
import { dashboardAPI, expenseAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, isEmployee, isManager, isAdmin } = useAuth();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await dashboardAPI.getDashboard();
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container"><p>Loading...</p></div>;
  }

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}!</h1>
        <p className="badge badge-{user?.role}">{user?.role?.toUpperCase()}</p>
      </div>

      {isEmployee && <EmployeeDashboard data={dashboardData} />}
      {isManager && <ManagerDashboard data={dashboardData} />}
      {isAdmin && <AdminDashboard data={dashboardData} />}
    </div>
  );
};

// Employee Dashboard
const EmployeeDashboard = ({ data }) => {
  const { statistics, recentExpenses } = data;

  return (
    <>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Expenses</h3>
          <p className="stat-value">{statistics.totalExpenses}</p>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <p className="stat-value pending">{statistics.pendingCount}</p>
        </div>
        <div className="stat-card">
          <h3>Approved</h3>
          <p className="stat-value approved">{statistics.approvedCount}</p>
        </div>
        <div className="stat-card">
          <h3>Total Amount</h3>
          <p className="stat-value">${statistics.totalAmount.toFixed(2)}</p>
        </div>
      </div>

      <div className="card">
        <h3>Recent Expenses</h3>
        <table className="expense-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentExpenses.map(expense => (
              <tr key={expense.id}>
                <td>{expense.title}</td>
                <td>${parseFloat(expense.amount).toFixed(2)}</td>
                <td>{expense.category}</td>
                <td>
                  <span className={`badge badge-${expense.status}`}>
                    {expense.status}
                  </span>
                </td>
                <td>{new Date(expense.expense_date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

// Manager Dashboard
const ManagerDashboard = ({ data }) => {
  const { statistics, pendingApprovals, recentTeamExpenses } = data;

  return (
    <>
      <div className="stats-grid">
        <div className="stat-card highlight">
          <h3>Pending Approvals</h3>
          <p className="stat-value">{statistics.pendingApprovalCount}</p>
        </div>
        <div className="stat-card">
          <h3>Team Expenses</h3>
          <p className="stat-value">{statistics.teamTotalExpenses}</p>
        </div>
        <div className="stat-card">
          <h3>Team Approved</h3>
          <p className="stat-value">{statistics.teamApprovedCount}</p>
        </div>
        <div className="stat-card">
          <h3>Team Total</h3>
          <p className="stat-value">${statistics.teamTotalAmount.toFixed(2)}</p>
        </div>
      </div>

      {pendingApprovals.length > 0 && (
        <div className="card">
          <h3>Pending Approvals</h3>
          <table className="expense-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Title</th>
                <th>Amount</th>
                <th>Level</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingApprovals.map(approval => (
                <tr key={approval.id}>
                  <td>{approval.expense.employee.name}</td>
                  <td>{approval.expense.title}</td>
                  <td>${parseFloat(approval.expense.amount).toFixed(2)}</td>
                  <td>Level {approval.level_number}</td>
                  <td>
                    <button className="btn btn-secondary btn-sm">Review</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="card">
        <h3>Recent Team Expenses</h3>
        <table className="expense-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Title</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentTeamExpenses.map(expense => (
              <tr key={expense.id}>
                <td>{expense.employee.name}</td>
                <td>{expense.title}</td>
                <td>${parseFloat(expense.amount).toFixed(2)}</td>
                <td>
                  <span className={`badge badge-${expense.status}`}>
                    {expense.status}
                  </span>
                </td>
                <td>{new Date(expense.expense_date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

// Admin Dashboard
const AdminDashboard = ({ data }) => {
  const { overview, statusBreakdown, financials, recentExpenses, topSpenders } = data;

  return (
    <>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-value">{overview.totalUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Total Companies</h3>
          <p className="stat-value">{overview.totalCompanies}</p>
        </div>
        <div className="stat-card">
          <h3>Total Expenses</h3>
          <p className="stat-value">{overview.totalExpenses}</p>
        </div>
        <div className="stat-card">
          <h3>Total Approved</h3>
          <p className="stat-value">${financials.totalAmount.toFixed(2)}</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Pending</h3>
          <p className="stat-value pending">{statusBreakdown.pendingCount}</p>
        </div>
        <div className="stat-card">
          <h3>Approved</h3>
          <p className="stat-value approved">{statusBreakdown.approvedCount}</p>
        </div>
        <div className="stat-card">
          <h3>Rejected</h3>
          <p className="stat-value rejected">{statusBreakdown.rejectedCount}</p>
        </div>
        <div className="stat-card">
          <h3>Reimbursed</h3>
          <p className="stat-value">${financials.reimbursedAmount.toFixed(2)}</p>
        </div>
      </div>

      <div className="card">
        <h3>Top Spenders</h3>
        <table className="expense-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Total Amount</th>
              <th>Expenses Count</th>
            </tr>
          </thead>
          <tbody>
            {topSpenders.map((spender, index) => (
              <tr key={index}>
                <td>{spender.employee.name}</td>
                <td>${parseFloat(spender.total_amount).toFixed(2)}</td>
                <td>{spender.expense_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>Recent Expenses</h3>
        <table className="expense-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Title</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentExpenses.slice(0, 10).map(expense => (
              <tr key={expense.id}>
                <td>{expense.employee.name}</td>
                <td>{expense.title}</td>
                <td>${parseFloat(expense.amount).toFixed(2)}</td>
                <td>
                  <span className={`badge badge-${expense.status}`}>
                    {expense.status}
                  </span>
                </td>
                <td>{new Date(expense.expense_date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Dashboard;
