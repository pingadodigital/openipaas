import { IUnifiedProvider } from "../IProvider";
import { 
  UnifiedCustomer, 
  UnifiedProduct, 
  UnifiedSale, 
  UnifiedSeller,
  UnifiedListResponse
} from "@/types/unified";
import { omieRequest } from "@/lib/omie-utils";
import { mapOmieListToUnified } from "@/lib/mappers/omie-customers";

export class OmieProvider implements IUnifiedProvider {
  private getAuth(credentials: any) {
    return {
      appKey: credentials.accessToken,
      appSecret: credentials.refreshToken || ""
    };
  }

  async listCustomers(credentials: any, params: any): Promise<UnifiedListResponse<UnifiedCustomer>> {
    const { appKey, appSecret } = this.getAuth(credentials);
    const page = Number(params.pagina) || 1;
    const pageSize = Number(params.tamanho_pagina) || 50;

    const data = await omieRequest(
      "/geral/clientes/",
      "ListarClientes",
      [{ pagina: page, registros_por_pagina: pageSize }],
      appKey,
      appSecret
    );

    return mapOmieListToUnified(data);
  }

  async listProducts(credentials: any, params: any): Promise<UnifiedListResponse<UnifiedProduct>> {
    throw new Error("Omie listProducts not implemented");
  }

  async listSales(credentials: any, params: any): Promise<UnifiedListResponse<UnifiedSale>> {
    throw new Error("Omie listSales not implemented");
  }

  async listSellers(credentials: any): Promise<UnifiedSeller[]> {
    throw new Error("Omie listSellers not implemented");
  }

  async getSaleDetail(credentials: any, id: string): Promise<UnifiedSale> {
    throw new Error("Omie getSaleDetail not implemented");
  }

  async getSalePdf(credentials: any, id: string): Promise<ArrayBuffer> {
    throw new Error("Omie getSalePdf not implemented");
  }

  async bulkDeleteSales(credentials: any, ids: string[]): Promise<{ deletedCount: number, ignoredCount: number }> {
    throw new Error("Omie bulkDeleteSales not implemented");
  }
}
