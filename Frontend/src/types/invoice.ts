export interface InvoiceItemInput {
  description: string
  quantity: number
  rate: number
}

export interface CreateInvoiceRequest {
  customerId: number
  notes?: string
  items: InvoiceItemInput[]
}

export interface Invoice {
  id: number
  invoiceNumber: string
  subtotal: number
}

export interface InvoiceItem {
  id: number
  description: string
  quantity: number
  rate: number
  amount: number
}