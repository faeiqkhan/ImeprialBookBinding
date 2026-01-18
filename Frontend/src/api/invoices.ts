import { CreateInvoiceRequest } from "../types/invoice"
import api from "./axios"

export const createInvoice = (data: CreateInvoiceRequest) =>
  api.post("/api/invoices", data)

export const printInvoice = async (id: number) => {
  try {
    const response = await api.get(`/api/invoices/${id}/pdf`, { 
      responseType: "blob" 
    })
    
    // Create a blob URL and open it in a new window for printing
    const blob = new Blob([response.data], { type: "application/pdf" })
    const blobUrl = window.URL.createObjectURL(blob)
    const printWindow = window.open(blobUrl)
    
    if (printWindow) {
      printWindow.print()
    }
  } catch (error) {
    console.error("Failed to generate PDF", error)
    throw error
  }
}
