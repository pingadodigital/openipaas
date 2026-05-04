export type UnifiedPersonType = 'NATURAL' | 'LEGAL' | 'FOREIGN' | 'UNKNOWN';

export interface UnifiedBaseRecord {
  remoteData?: {
    provider: string;
    raw: any;
  };
}

export interface UnifiedCustomer extends UnifiedBaseRecord {
  id: string;
  name: string;
  email: string | null;
  document: string | null;
  personType: UnifiedPersonType;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  phones: string[];
}

export interface UnifiedProduct extends UnifiedBaseRecord {
  id: string;
  name: string;
  sku: string | null;
  ean: string | null;
  price: number;
  costPrice: number | null;
  stockQuantity: number;
  status: 'ACTIVE' | 'INACTIVE';
  updatedAt: string | null;
  description?: string;
  unit?: string;
  category?: string;
}

export interface UnifiedCategory extends UnifiedBaseRecord {
  id: string;
  name: string;
}

export interface UnifiedBrand extends UnifiedBaseRecord {
  id: string;
  name: string;
}

export interface UnifiedUnit extends UnifiedBaseRecord {
  id: string;
  name: string;
  shortName: string;
}

export interface UnifiedListResponse<T> {
  items: T[];
  totalItems: number;
}

export type UnifiedSaleStatus = 'DRAFT' | 'CONFIRMED' | 'CANCELLED' | 'INVOICED' | 'QUOTATION' | 'OTHER';

export interface UnifiedSaleItem {
  id: string;
  productId: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface UnifiedInstallment {
  id?: string;
  number: number;
  dueDate: string;
  amount: number;
  description: string;
}

export interface UnifiedSale extends UnifiedBaseRecord {
  id: string;
  number: number;
  saleDate: string;
  totalAmount: number;
  status: UnifiedSaleStatus;
  customerId: string;
  customerName?: string;
  sellerId?: string;
  notes?: string;
  items: UnifiedSaleItem[];
  installments: UnifiedInstallment[];
  createdAt: string;
  updatedAt?: string;
}

export interface UnifiedSeller extends UnifiedBaseRecord {
  id: string;
  name: string;
  externalId?: string;
}
