import { useEffect, useState } from "react"
import api from "../api/axios"

interface Customer {
  id: number
  name: string
}

interface Props {
  value: number | null
  onChange: (id: number) => void
}

export default function CustomerSelect({ value, onChange }: Props) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/api/customers")
      .then(res => setCustomers(res.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <select
      value={value ?? ""}
      onChange={e => onChange(Number(e.target.value))}
      className="select"
      disabled={loading}
    >
      <option value="">
        {loading ? "Loading customers..." : "Choose a customer..."}
      </option>
      {customers.map(c => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
    </select>
  )
}
