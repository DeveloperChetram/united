import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar/Navbar';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import InvoiceList from './pages/InvoiceList/InvoiceList';
import CreateInvoice from './pages/CreateInvoice/CreateInvoice';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/invoices"
              element={
                <PrivateRoute>
                  <InvoiceList />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-invoice"
              element={
                <PrivateRoute>
                  <CreateInvoice />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;