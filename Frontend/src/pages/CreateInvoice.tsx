import { useEffect, useState } from "react"
import { createInvoice, printInvoice } from "../api/invoices"
import { InvoiceItemInput } from "../types/invoice"
import api from "../api/axios"

interface Customer {
  id: number
  name: string
}

interface FormErrors {
  customer?: string
  items?: string
  general?: string
}

export default function CreateInvoice() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [customerId, setCustomerId] = useState<number | null>(null)
  const [items, setItems] = useState<InvoiceItemInput[]>([
    { description: "", quantity: 1, rate: 0 }
  ])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    api.get("/api/customers").then(res => setCustomers(res.data))
  }, [])

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, rate: 0 }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const updateItem = (index: number, field: keyof InvoiceItemInput, value: any) => {
    const updated = [...items]
    updated[index] = { ...updated[index], [field]: value }
    setItems(updated)
  }

  const total = items.reduce(
    (sum, i) => sum + (i.quantity || 0) * (i.rate || 0),
    0
  )

  const validateForm = () => {
    const newErrors: FormErrors = {}

    if (!customerId) {
      newErrors.customer = "Please select a customer"
    }

    const validItems = items.filter(i => i.description && i.quantity > 0 && i.rate > 0)
    if (validItems.length === 0) {
      newErrors.items = "Please add at least one item with description, quantity, and rate"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const submit = async () => {
    setSuccessMessage("")
    
    if (!validateForm()) return

    setLoading(true)
    try {
      const res = await createInvoice({
        customerId: customerId!,
        items: items.filter(i => i.description && i.quantity > 0 && i.rate > 0)
      })

      setSuccessMessage("✓ Invoice created successfully!")
      printInvoice(res.data.id)
      
      // Reset form
      setItems([{ description: "", quantity: 1, rate: 0 }])
      setCustomerId(null)
      setErrors({})

      setTimeout(() => setSuccessMessage(""), 4000)
    } catch (e) {
      setErrors({ general: "Failed to create invoice. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        {/* Header */}
        <div className="card-header">
          <h1 className="card-title">📄 Create New Invoice</h1>
          <p className="card-subtitle">Generate a professional invoice for your customer</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="alert alert-success">
            <span>✓</span>
            {successMessage}
          </div>
        )}

        {/* Error Messages */}
        {errors.general && (
          <div className="alert alert-error">
            <span>✕</span>
            {errors.general}
          </div>
        )}

        {/* Customer Selection */}
        <div className="card-section">
          <label className="label label-required">Select Customer</label>
          <select 
            value={customerId || ""} 
            onChange={e => {
              setCustomerId(e.target.value ? Number(e.target.value) : null)
              setErrors({ ...errors, customer: undefined })
            }}
            className={`select ${errors.customer ? 'input-error' : ''}`}
          >
            <option value="">— Choose a customer —</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.customer && <p className="error-text">⚠ {errors.customer}</p>}
        </div>

        {/* Invoice Items Section */}
        <div className="card-section">
          <div className="section-header">
            <h2>Invoice Items</h2>
            <button 
              onClick={addItem}
              className="btn btn-secondary btn-sm"
            >
              + Add Item
            </button>
          </div>

          {errors.items && (
            <div className="alert alert-warning">
              <span>!</span>
              {errors.items}
            </div>
          )}

          {/* Item Headers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 120px 120px 50px', gap: '1rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '2px solid #e2e8f0' }}>
            <div className="label" style={{ margin: 0 }}>Description</div>
            <div className="label" style={{ margin: 0 }}>Qty</div>
            <div className="label" style={{ margin: 0 }}>Rate (₹)</div>
            <div className="label" style={{ margin: 0 }}>Amount</div>
            <div></div>
          </div>

          {/* Items */}
          <div className="space-y-4">
            {items.map((item, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 120px 120px 50px', gap: '1rem', alignItems: 'flex-end', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                <div>
                  <input
                    type="text"
                    placeholder="e.g., Book Binding, Leather Cover"
                    value={item.description}
                    onChange={e => updateItem(i, "description", e.target.value)}
                    className="input"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={e => updateItem(i, "quantity", Number(e.target.value))}
                    className="input"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={item.rate}
                    onChange={e => updateItem(i, "rate", Number(e.target.value))}
                    className="input"
                  />
                </div>
                <div style={{ fontSize: '1.125rem', fontWeight: '700', color: '#2563eb', textAlign: 'right', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  ₹{(item.quantity * item.rate).toFixed(2)}
                </div>
                <button 
                  onClick={() => removeItem(i)}
                  className="btn btn-danger btn-sm"
                  disabled={items.length === 1}
                  title="Remove item"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Total Summary */}
        <div style={{ backgroundColor: '#dbeafe', border: '2px solid #3b82f6', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#1e40af', fontWeight: '600', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Total Amount</p>
              <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1e40af', margin: 0 }}>
                ₹{total.toFixed(2)}
              </p>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#1e40af', fontWeight: '500' }}>
              <p style={{ margin: 0 }}>{items.length} item{items.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={submit}
          disabled={loading || !customerId}
          className="btn btn-primary"
          style={{ width: '100%', fontSize: '1.125rem', padding: '1rem', justifyContent: 'center' }}
        >
          {loading ? "⏳ Generating Invoice..." : "✓ Generate Invoice & Print"}
        </button>
      </div>
    </div>
  )
}
