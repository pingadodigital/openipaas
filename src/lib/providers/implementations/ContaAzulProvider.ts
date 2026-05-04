import { IUnifiedProvider } from "../IProvider";
import { 
  UnifiedCustomer, 
  UnifiedProduct, 
  UnifiedSale, 
  UnifiedSeller,
  UnifiedListResponse
} from "@/types/unified";
import { unifiedErpRequestWithRetry } from "@/lib/unified-api-utils";
import { mapContaAzulListToUnified } from "@/lib/mappers/contaazul";
import { mapContaAzulProductListToUnified } from "@/lib/mappers/products";
import { 
  mapCAListSaleToUnified, 
  mapCADetailSaleToUnified, 
  mapCASellerToUnified 
} from "@/lib/mappers/sales";

export class ContaAzulProvider implements IUnifiedProvider {
  private async request(credentials: any, method: string, path: string, body: any = null) {
    return unifiedErpRequestWithRetry(
      'CONTA_AZUL',
      credentials.id,
      credentials.accessToken,
      method,
      path,
      body
    );
  }

  async listCustomers(credentials: any, params: any): Promise<UnifiedListResponse<UnifiedCustomer>> {
    const searchParams = new URLSearchParams(params);
    const data = await this.request(credentials, 'GET', `/pessoas?${searchParams.toString()}`);
    return mapContaAzulListToUnified(data);
  }

  async listProducts(credentials: any, params: any): Promise<UnifiedListResponse<UnifiedProduct>> {
    const searchParams = new URLSearchParams(params);
    const data = await this.request(credentials, 'GET', `/produtos?${searchParams.toString()}`);
    return mapContaAzulProductListToUnified(data);
  }

  async listSales(credentials: any, params: any): Promise<UnifiedListResponse<UnifiedSale>> {
    const searchParams = new URLSearchParams(params);
    const data = await this.request(credentials, 'GET', `/v1/venda/busca?${searchParams.toString()}`);
    return {
      items: data.itens.map(mapCAListSaleToUnified),
      totalItems: data.total_itens
    };
  }

  async listSellers(credentials: any): Promise<UnifiedSeller[]> {
    const data = await this.request(credentials, 'GET', '/v1/venda/vendedores');
    return data.map(mapCASellerToUnified);
  }

  async getSaleDetail(credentials: any, id: string): Promise<UnifiedSale> {
    const [saleData, itemsData] = await Promise.all([
      this.request(credentials, 'GET', `/v1/venda/${id}`),
      this.request(credentials, 'GET', `/v1/venda/${id}/itens`).catch(() => ({ itens: [] }))
    ]);
    return mapCADetailSaleToUnified(saleData, itemsData.itens);
  }

  async getSalePdf(credentials: any, id: string): Promise<ArrayBuffer> {
    // Note: We need a direct fetch for PDF because unifiedErpRequestWithRetry expects JSON
    // However, for consistency in the provider, we might want to handle it here
    const fetchPdf = async (token: string) => {
      const res = await fetch(`https://api-v2.contaazul.com/v1/venda/${id}/imprimir`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      return res;
    };

    let res = await fetchPdf(credentials.accessToken);
    if (res.status === 401) {
      // Logic for token refresh would be needed here if we don't use unifiedErpRequestWithRetry
      // But unifiedErpRequestWithRetry is already designed for JSON.
      // For now, I'll keep the logic similar to the route.
      // In a real plugin architecture, the request helper should handle binary too.
      throw new Error("PDF_REFRESH_NEEDED"); 
    }
    
    if (!res.ok) throw new Error(`Conta Azul PDF Error: ${res.status}`);
    return await res.arrayBuffer();
  }

  async bulkDeleteSales(credentials: any, ids: string[]): Promise<{ deletedCount: number, ignoredCount: number }> {
    const data = await this.request(credentials, 'POST', '/v1/venda/exclusao-lote', { ids });
    return {
      deletedCount: data.atualizados,
      ignoredCount: data.ignorados
    };
  }
}
