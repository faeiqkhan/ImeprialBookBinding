import { useEffect, useState } from "react"
import { CustomerWithBalance } from "../types/customer"
import { getCustomersWithBalance } from "../api/customers"
import api from "../api/axios"

export default function Customers() {
  const [customers, setCustomers] = useState<CustomerWithBalance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [newCustomer, setNewCustomer] = useState({ name: "", email: "", phone: "" })
  const [formError, setFormError] = useState("")

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    try {
      setLoading(true)
      const response = await getCustomersWithBalance()
      setCustomers(response.data)
      setError("")
    } catch (err) {
      setError("Failed to load customers")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const addCustomer = async () => {
    setFormError("")
    
    if (!newCustomer.name.trim()) {
      setFormError("Customer name is required")
      return
    }

    try {
      await api.post("/api/customers", {
        name: newCustomer.name,
        email: newCustomer.email,
        phone: newCustomer.phone
      })
      
      setNewCustomer({ name: "", email: "", phone: "" })
      setShowForm(false)
      await loadCustomers()
    } catch (err) {
      setFormError("Failed to add customer")
      console.error(err)
    }
  }

  const receivableAmount = customers.filter(c => c.balance > 0).reduce((sum, c) => sum + c.balance, 0)
  const payableAmount = Math.abs(customers.filter(c => c.balance < 0).reduce((sum, c) => sum + c.balance, 0))

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="card">
        <div className="card-header">
          <div className="section-header">
            <div>
              <h1 className="card-title">👥 Manage Customers</h1>
              <p className="card-subtitle">View and manage your customer information and balances</p>
            </div>
            <button 
              onClick={() => setShowForm(!showForm)}
              className="btn btn-primary"
            >
              + New Customer
            </button>
          </div>
        </div>

        {/* Add Customer Form */}
        {showForm && (
          <div style={{ backgroundColor: '#dbeafe', border: '2px solid #3b82f6', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>Add New Customer</h3>
            {formError && (
              <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
                <span>✕</span>
                {formError}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="label label-required">Customer Name</label>
                <input
                  type="text"
                  placeholder="Enter customer name"
                  value={newCustomer.name}
                  onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  className="input"
                />
              </div>
              <div className="form-group-horizontal">
                <div>
                  <label className="label">Email Address</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={newCustomer.email}
                    onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="(123) 456-7890"
                    value={newCustomer.phone}
                    onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    className="input"
                  />
                </div>
              </div>
              <div className="flex-gap" style={{ marginTop: '1.5rem' }}>
                <button onClick={addCustomer} className="btn btn-primary" style={{ flex: 1 }}>
                  Save Customer
                </button>
                <button 
                  onClick={() => {
                    setShowForm(false)
                    setFormError("")
                    setNewCustomer({ name: "", email: "", phone: "" })
                  }} 
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid-2" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <div className="stat-card">
          <span className="stat-label">Total Customers</span>
          <span className="stat-value neutral">{customers.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Amount Receivable</span>
          <span className="stat-value negative">₹{receivableAmount.toFixed(2)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Amount Payable</span>
          <span className="stat-value positive">₹{payableAmount.toFixed(2)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Outstanding Balance</span>
          <span className="stat-value"  style={{ color: '#64748b' }}>₹{Math.abs(receivableAmount - payableAmount).toFixed(2)}</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
          <span>✕</span>
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '2rem' }}>⏳</p>
          <p style={{ color: '#64748b', marginTop: '1rem', fontSize: '1rem' }}>Loading customers...</p>
        </div>
      )}

      {/* Customers Table */}
      {!loading && customers.length > 0 && (
        <div className="card">
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th className="table-numeric">Balance</th>
                  <th className="table-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c.id} className="table-row">
                    <td style={{ fontWeight: '600' }}>{c.name || '—'}</td>
                    <td style={{ 
                      color: c.email ? '#1e293b' : '#94a3b8',
                      fontWeight: c.email ? '500' : '400',
                      fontSize: '0.95rem'
                    }}>
                      {c.email ? (
                        <a href={`mailto:${c.email}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                          {c.email}
                        </a>
                      ) : '—'}
                    </td>
                    <td className="text-muted">{c.phone || "—"}</td>
                    <td className="table-numeric">
                      <span style={{ fontWeight: '700', fontSize: '1.125rem', color: (c.balance || 0) > 0 ? '#ef4444' : (c.balance || 0) < 0 ? '#22c55e' : '#64748b' }}>
                        ₹{Math.abs(c.balance || 0).toFixed(2)}
                      </span>
                    </td>
                    <td className="table-center">
                      {(c.balance || 0) > 0 ? (
                        <span className="badge badge-error">Receivable</span>
                      ) : (c.balance || 0) < 0 ? (
                        <span className="badge badge-success">Payable</span>
                      ) : (
                        <span className="badge badge-info">Settled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && customers.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '2.5rem', margin: 0 }}>📭</p>
          <p style={{ color: '#64748b', margin: '1rem 0 1.5rem 0', fontSize: '1.05rem' }}>No customers yet</p>
          <button 
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            + Add Your First Customer
          </button>
        </div>
      )}
    </div>
  )
}
