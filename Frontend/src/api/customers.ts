import { CustomerWithBalance } from "../types/customer";
import api from "./axios";

export const getCustomersWithBalance = () =>
  api.get<CustomerWithBalance[]>("/api/customers/with-balance")
