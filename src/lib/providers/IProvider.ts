import { 
  UnifiedCustomer, 
  UnifiedProduct, 
  UnifiedSale, 
  UnifiedSeller,
  UnifiedListResponse
} from "@/types/unified";

export interface IUnifiedProvider {
  // Customers
  listCustomers(credentials: any, params: any): Promise<UnifiedListResponse<UnifiedCustomer>>;
  
  // Products
  listProducts(credentials: any, params: any): Promise<UnifiedListResponse<UnifiedProduct>>;
  
  // Sales
  listSales(credentials: any, params: any): Promise<UnifiedListResponse<UnifiedSale>>;
  listSellers(credentials: any): Promise<UnifiedSeller[]>;
  getSaleDetail(credentials: any, id: string): Promise<UnifiedSale>;
  getSalePdf(credentials: any, id: string): Promise<Buffer | ArrayBuffer>;
  bulkDeleteSales(credentials: any, ids: string[]): Promise<{ deletedCount: number, ignoredCount: number }>;
}
