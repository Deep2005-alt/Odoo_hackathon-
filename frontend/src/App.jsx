import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ExpenseForm from './pages/ExpenseForm';
import './index.css';

// Placeholder pages
const Approvals = () => <div className="container"><h1>Approvals Page - Coming Soon</h1></div>;
const Home = () => <Navigate to="/dashboard" replace />;

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/expenses/new" 
                element={
                  <PrivateRoute>
                    <ExpenseForm />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/approvals" 
                element={
                  <PrivateRoute roles={['manager', 'admin']}>
                    <Approvals />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
