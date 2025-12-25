
import { Medicine, Bill, Supplier, Customer, Purchase } from './types';

const STORAGE_KEYS = {
  MEDICINES: 'kmc_medicines',
  BILLS: 'kmc_bills',
  SUPPLIERS: 'kmc_suppliers',
  CUSTOMERS: 'kmc_customers',
  PURCHASES: 'kmc_purchases',
  CONFIG: 'kmc_config'
};

const INITIAL_DATA = {
  medicines: [
    { id: 'MED001', name: 'Paracetamol 500mg', category: 'General', price: 15, costPrice: 10, stock: 100, expiry: '2025-12-31', supplierId: 'SUP001' },
    { id: 'MED002', name: 'Amoxicillin 250mg', category: 'Antibiotic', price: 45, costPrice: 35, stock: 50, expiry: '2024-11-20', supplierId: 'SUP001' }
  ],
  suppliers: [
    { id: 'SUP001', name: 'Generic Pharma Corp', contact: '0300-1234567', email: 'generic@pharma.com', address: 'Plot 45, Industrial Estate' }
  ],
  customers: [
    { id: 'CUST001', name: 'Walk-in Customer', contact: 'N/A' }
  ]
};

export const DB = {
  get: <T,>(key: string, defaultValue: T): T => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  },

  set: <T,>(key: string, value: T): void => {
    localStorage.setItem(key, JSON.stringify(value));
  },

  init: () => {
    if (!localStorage.getItem(STORAGE_KEYS.MEDICINES)) {
      DB.set(STORAGE_KEYS.MEDICINES, INITIAL_DATA.medicines);
      DB.set(STORAGE_KEYS.SUPPLIERS, INITIAL_DATA.suppliers);
      DB.set(STORAGE_KEYS.CUSTOMERS, INITIAL_DATA.customers);
      DB.set(STORAGE_KEYS.BILLS, []);
      DB.set(STORAGE_KEYS.PURCHASES, []);
    }
  },

  // Medicines
  getMedicines: (): Medicine[] => DB.get(STORAGE_KEYS.MEDICINES, []),
  saveMedicines: (medicines: Medicine[]) => DB.set(STORAGE_KEYS.MEDICINES, medicines),

  // Bills
  getBills: (): Bill[] => DB.get(STORAGE_KEYS.BILLS, []),
  saveBills: (bills: Bill[]) => DB.set(STORAGE_KEYS.BILLS, bills),

  // Suppliers
  getSuppliers: (): Supplier[] => DB.get(STORAGE_KEYS.SUPPLIERS, []),
  saveSuppliers: (suppliers: Supplier[]) => DB.set(STORAGE_KEYS.SUPPLIERS, suppliers),

  // Customers
  getCustomers: (): Customer[] => DB.get(STORAGE_KEYS.CUSTOMERS, []),
  saveCustomers: (customers: Customer[]) => DB.set(STORAGE_KEYS.CUSTOMERS, customers),

  // Purchases
  getPurchases: (): Purchase[] => DB.get(STORAGE_KEYS.PURCHASES, []),
  savePurchases: (purchases: Purchase[]) => DB.set(STORAGE_KEYS.PURCHASES, purchases),
};

DB.init();
