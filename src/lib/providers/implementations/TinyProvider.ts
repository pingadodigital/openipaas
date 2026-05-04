import { IUnifiedProvider } from "../IProvider";
import { 
  UnifiedCustomer, 
  UnifiedProduct, 
  UnifiedSale, 
  UnifiedSeller,
  UnifiedListResponse
} from "@/types/unified";

/**
 * Tiny Provider Implementation
 * Created via CLI
 */
export class TinyProvider implements IUnifiedProvider {
  async listCustomers(credentials: any, params: any): Promise<UnifiedListResponse<UnifiedCustomer>> {
    console.log('[TinyProvider] listCustomers not yet implemented');
    return { items: [], totalItems: 0 };
  }

  async listProducts(credentials: any, params: any): Promise<UnifiedListResponse<UnifiedProduct>> {
    console.log('[TinyProvider] listProducts not yet implemented');
    return { items: [], totalItems: 0 };
  }

  async listSales(credentials: any, params: any): Promise<UnifiedListResponse<UnifiedSale>> {
    console.log('[TinyProvider] listSales not yet implemented');
    return { items: [], totalItems: 0 };
  }

  async listSellers(credentials: any): Promise<UnifiedSeller[]> {
    console.log('[TinyProvider] listSellers not yet implemented');
    return [];
  }

  async getSaleDetail(credentials: any, id: string): Promise<UnifiedSale> {
    throw new Error('[TinyProvider] getSaleDetail not implemented');
  }

  async getSalePdf(credentials: any, id: string): Promise<ArrayBuffer> {
    throw new Error('[TinyProvider] getSalePdf not implemented');
  }

  async bulkDeleteSales(credentials: any, ids: string[]): Promise<{ deletedCount: number, ignoredCount: number }> {
    throw new Error('[TinyProvider] bulkDeleteSales not implemented');
  }
}
