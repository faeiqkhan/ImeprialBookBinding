import { useEffect, useState } from "react"
import api from "../api/axios"
import { getCustomersWithBalance } from "../api/customers"
import { CustomerWithBalance } from "../types/customer"
import { formatDate } from "../utils/dateUtils"

interface Payment {
  id: number
  customerId: number
  amount: number
  paymentDate: string
  customerName: string
}

export default function Payments() {
  const [customers, setCustomers] = useState<CustomerWithBalance[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [formError, setFormError] = useState("")
  const [customerId, setCustomerId] = useState<number | null>(null)
  const [amount, setAmount] = useState<number>(0)
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [customersRes, paymentsRes] = await Promise.all([
        getCustomersWithBalance(),
        api.get("/api/payments")
      ])
      setCustomers(customersRes.data)
      setPayments(paymentsRes.data)
      setError("")
    } catch (err) {
      setError("Failed to load data")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const recordPayment = async () => {
    setFormError("")

    if (customerId === null) {
      setFormError("Please select a customer")
      return
    }

    if (!amount || amount <= 0) {
      setFormError("Please enter a valid amount")
      return
    }

    try {
      await api.post("/api/payments", {
        customerId: customerId,
        amount: amount,
        paymentDate: paymentDate
      })

      setAmount(0)
      setCustomerId(null)
      setPaymentDate(new Date().toISOString().split('T')[0])
      await loadData()
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Failed to record payment")
      console.error(err)
    }
  }

  const selectedCustomer = customerId ? customers.find(c => c.id === customerId) : null
  const totalReceivable = customers.filter(c => c.balance > 0).reduce((sum, c) => sum + c.balance, 0)
  const totalPayable = Math.abs(customers.filter(c => c.balance < 0).reduce((sum, c) => sum + c.balance, 0))

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="card">
        <div className="card-header">
          <div>
            <h1 className="card-title">💳 Record Payments</h1>
            <p className="card-subtitle">Track and record customer payments</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid-2" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <div className="stat-card">
          <span className="stat-label">Total Receivable</span>
          <span className="stat-value negative">₹{totalReceivable.toFixed(2)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Payable</span>
          <span className="stat-value positive">₹{totalPayable.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Form */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Record New Payment</h2>
        </div>

        <div className="card-section">
          {error && (
            <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
              <span>✕</span>
              {error}
            </div>
          )}

          {formError && (
            <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
              <span>✕</span>
              {formError}
            </div>
          )}

          <div className="space-y-4">
            {/* Customer Selection */}
            <div>
              <label className="label label-required">Select Customer</label>
              <select
                value={customerId || ""}
                onChange={e => setCustomerId(e.target.value ? parseInt(e.target.value) : null)}
                className="input"
              >
                <option value="">Choose a customer...</option>
                {customers.filter(c => c.balance !== 0).map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.balance > 0 ? `(Owes ₹${c.balance.toFixed(2)})` : `(You owe ₹${Math.abs(c.balance).toFixed(2)})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Customer Info */}
            {selectedCustomer && (
              <div style={{ backgroundColor: '#dbeafe', border: '1px solid #93c5fd', borderRadius: '0.75rem', padding: '1rem' }}>
                <div className="flex-gap">
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Current Balance</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: '700', color: selectedCustomer.balance > 0 ? '#ef4444' : '#22c55e' }}>
                      {selectedCustomer.balance > 0 ? '(Owes) ' : '(Pays) '}₹{Math.abs(selectedCustomer.balance).toFixed(2)}
                    </p>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Contact</p>
                    <p style={{ fontSize: '1rem', fontWeight: '500', color: '#1e293b' }}>
                      {selectedCustomer.phone || selectedCustomer.email || "No contact info"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Amount */}
            <div className="form-group-horizontal">
              <div style={{ flex: 2 }}>
                <label className="label label-required">Payment Amount (₹)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount || ""}
                  onChange={e => setAmount(parseFloat(e.target.value) || 0)}
                  className="input"
                  step="0.01"
                  min="0"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="label label-required">Payment Date</label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={e => setPaymentDate(e.target.value)}
                  className="input"
                />
              </div>
            </div>

            {/* Action Button */}
            <div style={{ marginTop: '2rem' }}>
              <button onClick={recordPayment} className="btn btn-primary" style={{ width: '100%' }}>
                💾 Record Payment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      {!loading && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <div className="card-header">
            <h2 className="card-title">Payment History</h2>
          </div>

          {payments.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th className="table-numeric">Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p, idx) => (
                    <tr key={idx} className="table-row">
                      <td style={{ fontWeight: '600' }}>{p.customerName || `Customer ${p.customerId}`}</td>
                      <td className="table-numeric">
                        <span style={{ fontWeight: '700', fontSize: '1.125rem', color: '#2563eb' }}>
                          ₹{p.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="text-muted">
                        {formatDate(p.paymentDate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="card-section" style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', margin: 0 }}>📋</p>
              <p style={{ color: '#64748b', margin: '1rem 0', fontSize: '1rem' }}>No payments recorded yet</p>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', marginTop: '2rem' }}>
          <p style={{ fontSize: '2rem' }}>⏳</p>
          <p style={{ color: '#64748b', marginTop: '1rem', fontSize: '1rem' }}>Loading payment data...</p>
        </div>
      )}
    </div>
  )
}
