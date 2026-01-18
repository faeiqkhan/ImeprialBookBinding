import { useEffect, useState } from "react"
import api from "../api/axios"
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

export default function AllInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [customers, setCustomers] = useState<CustomerWithBalance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null)

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
      setError("Failed to load invoices")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Filter invoices
  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      (inv.invoiceNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.customerName || '').toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCustomer = selectedCustomerId === null || inv.customerId === selectedCustomerId
    
    return matchesSearch && matchesCustomer
  })

  const totalAmount = filteredInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0)

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="card">
        <div className="card-header">
          <div>
            <h1 className="card-title">📋 All Invoices</h1>
            <p className="card-subtitle">View and manage all your invoices</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid-2" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <div className="stat-card">
          <span className="stat-label">Total Invoices</span>
          <span className="stat-value" style={{ color: '#2563eb' }}>{filteredInvoices.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Amount</span>
          <span className="stat-value" style={{ color: '#059669' }}>₹{(totalAmount || 0).toFixed(2)}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <div className="card-section">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Search */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#1e293b' }}>
                Search Invoice or Customer
              </label>
              <input
                type="text"
                placeholder="Enter invoice # or customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Customer Filter */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#1e293b' }}>
                Filter by Customer
              </label>
              <select
                value={selectedCustomerId || ''}
                onChange={(e) => setSelectedCustomerId(e.target.value ? Number(e.target.value) : null)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">All Customers</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Invoices List */}
      {!loading && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Invoice Details</h2>
          </div>

          {filteredInvoices.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Customer</th>
                    <th className="table-numeric">Amount</th>
                    <th>Date</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((inv, idx) => (
                    <tr key={idx} className="table-row">
                      <td style={{ fontWeight: '600', color: '#2563eb' }}>{inv.invoiceNumber || '—'}</td>
                      <td>{inv.customerName || '—'}</td>
                      <td className="table-numeric">
                        <span style={{ fontWeight: '700', color: '#059669' }}>₹{(inv.total || 0).toFixed(2)}</span>
                      </td>
                      <td className="text-muted">
                        {formatDate(inv.createdDate)}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <a 
                          href={`http://localhost:8080/api/invoices/${inv.id}/pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ 
                            display: 'inline-block',
                            padding: '0.5rem 1rem',
                            backgroundColor: '#2563eb',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '0.375rem',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            transition: 'background-color 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#1d4ed8'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#2563eb'
                          }}
                        >
                          📥 Download PDF
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="card-section" style={{ textAlign: 'center', padding: '2rem' }}>
              <p style={{ fontSize: '2rem', margin: 0 }}>📄</p>
              <p style={{ color: '#64748b', margin: '1rem 0', fontSize: '1rem' }}>
                {invoices.length === 0 ? 'No invoices created yet' : 'No invoices match your filters'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', marginTop: '2rem' }}>
          <p style={{ fontSize: '2rem' }}>⏳</p>
          <p style={{ color: '#64748b', marginTop: '1rem', fontSize: '1rem' }}>Loading invoices...</p>
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
