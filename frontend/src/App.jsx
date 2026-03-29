import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ExpenseList from './pages/ExpenseList';
import ExpenseForm from './pages/ExpenseForm';
import { Toaster } from 'react-hot-toast';
import { Receipt, List } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col items-center bg-gray-50">
        <Toaster position="top-right" />
        {/* Modern Navigation Header */}
        <header className="w-full bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Receipt className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">Odoo Expense</h1>
              </div>
              <nav className="flex space-x-4">
                <Link to="/expenses" className="text-gray-600 hover:text-primary transition-colors font-medium flex items-center space-x-1">
                  <List className="w-4 h-4" />
                  <span>My Expenses</span>
                </Link>
                <Link to="/expenses/new" className="bg-primary hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-md shadow-primary/30 transition-all flex items-center space-x-1">
                  <span>+ New Expense</span>
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
          <Routes>
            <Route path="/" element={<ExpenseList />} />
            <Route path="/expenses" element={<ExpenseList />} />
            <Route path="/expenses/new" element={<ExpenseForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
