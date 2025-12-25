
export interface Medicine {
  id: string;
  name: string;
  category: string;
  price: number;
  costPrice: number;
  stock: number;
  expiry: string;
  supplierId: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  address: string;
}

export interface Customer {
  id: string;
  name: string;
  contact: string;
}

export interface BillItem {
  medicineId: string;
  medicineName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Bill {
  bill_no: string;
  date: string;
  customerId: string;
  customerName: string;
  items: BillItem[];
  total: number;
  cashPaid: number;
  balance: number;
}

export interface Purchase {
  id: string;
  date: string;
  supplierId: string;
  items: {
    medicineId: string;
    quantity: number;
    costPrice: number;
  }[];
  totalAmount: number;
}
