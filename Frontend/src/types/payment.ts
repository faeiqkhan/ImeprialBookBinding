export interface PaymentRequest {
  customerId: number
  invoiceId?: number | null
  amount: number
}

