import { useEffect, useState } from "react"
import api from "../api/axios"
import { Link } from "react-router-dom"
import { getCustomersWithBalance } from "../api/customers"
import { CustomerWithBalance } from "../types/customer"
import { formatDate } from "../utils/dateUtils"

interface Invoice {
  id: number
  invoiceNumber: string
  customerId: number
  customerName: string
  total: number
  createdDate: string
}

export default function Home() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [customers, setCustomers] = useState<CustomerWithBalance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [invoicesRes, customersRes] = await Promise.all([
        api.get("/api/invoices"),
        getCustomersWithBalance()
      ])
      setInvoices(invoicesRes.data)
      setCustomers(customersRes.data)
      setError("")
    } catch (err) {
      setError("Failed to load data")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const totalCustomers = customers.length
  const totalInvoices = invoices.length
  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0)
  const totalReceivable = customers.filter(c => c.balance > 0).reduce((sum, c) => sum + (c.balance || 0), 0)

  const recentInvoices = invoices.slice(-5).reverse()

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="card">
        <div className="card-header">
          <div>
            <h1 className="card-title">Welcome to Imperial Book Binding</h1>
            <p className="card-subtitle">Manage invoices, customers, and payments</p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid-3" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <Link to="/create-invoice" style={{ textDecoration: 'none' }}>
          <div className="stat-card" style={{ cursor: 'pointer', transition: 'all 0.3s ease' }} 
               onMouseEnter={(e) => {
                 e.currentTarget.style.transform = 'translateY(-4px)'
                 e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)'
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.transform = 'translateY(0)'
                 e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
               }}>
            <span style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'block' }}>📄</span>
            <span className="stat-label">New Invoice</span>
            <span style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.5rem', display: 'block' }}>Create a new invoice</span>
          </div>
        </Link>

        <Link to="/invoices" style={{ textDecoration: 'none' }}>
          <div className="stat-card" style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.transform = 'translateY(-4px)'
                 e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)'
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.transform = 'translateY(0)'
                 e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
               }}>
            <span style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'block' }}>📋</span>
            <span className="stat-label">All Invoices</span>
            <span style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.5rem', display: 'block' }}>View all invoices</span>
          </div>
        </Link>

        <Link to="/customers" style={{ textDecoration: 'none' }}>
          <div className="stat-card" style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.transform = 'translateY(-4px)'
                 e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)'
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.transform = 'translateY(0)'
                 e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
               }}>
            <span style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'block' }}>👥</span>
            <span className="stat-label">Customers</span>
            <span style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.5rem', display: 'block' }}>Manage customers</span>
          </div>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid-4" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <div className="stat-card">
          <span className="stat-label">Total Customers</span>
          <span className="stat-value" style={{ color: '#2563eb' }}>{totalCustomers}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Invoices</span>
          <span className="stat-value" style={{ color: '#7c3aed' }}>{totalInvoices}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Revenue</span>
          <span className="stat-value" style={{ color: '#059669' }}>₹{(totalRevenue || 0).toFixed(2)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Receivable</span>
          <span className="stat-value" style={{ color: '#dc2626' }}>₹{(totalReceivable || 0).toFixed(2)}</span>
        </div>
      </div>

      {/* Recent Invoices */}
      {!loading && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <div className="card-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <h2 className="card-title">Recent Invoices</h2>
              <Link to="/invoices" style={{ color: '#2563eb', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>
                View All →
              </Link>
            </div>
          </div>

          {recentInvoices.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Customer</th>
                    <th className="table-numeric">Amount</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInvoices.map((inv, idx) => (
                    <tr key={idx} className="table-row">
                      <td style={{ fontWeight: '600', color: '#2563eb' }}>{inv.invoiceNumber || '—'}</td>
                      <td>{inv.customerName || '—'}</td>
                      <td className="table-numeric">
                        <span style={{ fontWeight: '700', color: '#059669' }}>₹{(inv.total || 0).toFixed(2)}</span>
                      </td>
                      <td className="text-muted">
                        {formatDate(inv.createdDate)}
                      </td>
                      <td>
                        <a 
                          href={`http://localhost:8080/api/invoices/${inv.id}/pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ 
                            color: '#2563eb', 
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '0.9rem'
                          }}
                        >
                          📥 PDF
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="card-section" style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', margin: 0 }}>📄</p>
              <p style={{ color: '#64748b', margin: '1rem 0', fontSize: '1rem' }}>No invoices created yet</p>
              <Link to="/create-invoice" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '600' }}>
                Create your first invoice →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', marginTop: '2rem' }}>
          <p style={{ fontSize: '2rem' }}>⏳</p>
          <p style={{ color: '#64748b', marginTop: '1rem', fontSize: '1rem' }}>Loading dashboard...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" style={{ marginTop: '2rem' }}>
          <span style={{ fontWeight: '600' }}>⚠️ Error:</span> {error}
        </div>
      )}
    </div>
  )
}
