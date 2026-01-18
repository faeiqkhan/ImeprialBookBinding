import { PaymentRequest } from "../types/payment"
import api from "./axios"

export const recordPayment = (data: PaymentRequest) =>
  api.post("/api/payments", data)

export const getPayments = () =>
  api.get("/api/payments")
