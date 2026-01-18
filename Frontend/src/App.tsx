import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import CreateInvoice from './pages/CreateInvoice';
import AllInvoices from './pages/AllInvoices';
import Customers from './pages/Customers';
import ReceivePayment from './pages/Payments';

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', padding: '1.5rem' }}>
        {/* Logo/Brand - Now goes to Home */}
        <Link to="/" className="flex items-center" style={{ textDecoration: 'none' }}>
          <span className="logo-text" style={{ fontSize: '64px', fontWeight: 'bold', color: '#B5C3E2', lineHeight: '1', transition: 'all 0.3s ease' }}>📚 Imperial Book Binding</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="flex items-center gap-6" style={{ marginTop: '1.5rem', paddingBottom: '0.5rem' }}>
            <Link
              to="/create-invoice"
              className={`nav-item text-lg font-semibold transition-all ${
                isActive('/create-invoice') 
                  ? 'text-blue-600' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              📄 New Invoice
            </Link>
            <Link
              to="/invoices"
              className={`nav-item text-lg font-semibold transition-all ${
                isActive('/invoices') 
                  ? 'text-blue-600' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              📋 All Invoices
            </Link>
            <Link
              to="/customers"
              className={`nav-item text-lg font-semibold transition-all ${
                isActive('/customers') 
                  ? 'text-blue-600' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              👥 Customers
            </Link>
            <Link
              to="/payment"
              className={`nav-item text-lg font-semibold transition-all ${
                isActive('/payment') 
                  ? 'text-blue-600' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              💳 Payments
            </Link>
          </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-invoice" element={<CreateInvoice />} />
            <Route path="/invoices" element={<AllInvoices />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/payment" element={<ReceivePayment />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
