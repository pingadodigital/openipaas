import * as fs from 'fs';
import * as path from 'path';

const providerName = process.argv[2];

if (!providerName) {
  console.error('❌ Please provide a provider name. Usage: npm run generate-provider <name>');
  process.exit(1);
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
const lowercase = (s: string) => s.toLowerCase();

const capitalizedName = capitalize(providerName);
const lowerName = lowercase(providerName);

const providerTemplate = `import { IUnifiedProvider } from "../IProvider";
import { 
  UnifiedCustomer, 
  UnifiedProduct, 
  UnifiedSale, 
  UnifiedSeller,
  UnifiedListResponse
} from "@/types/unified";

/**
 * ${capitalizedName} Provider Implementation
 * Created via CLI
 */
export class ${capitalizedName}Provider implements IUnifiedProvider {
  async listCustomers(credentials: any, params: any): Promise<UnifiedListResponse<UnifiedCustomer>> {
    console.log('[${capitalizedName}Provider] listCustomers not yet implemented');
    return { items: [], totalItems: 0 };
  }

  async listProducts(credentials: any, params: any): Promise<UnifiedListResponse<UnifiedProduct>> {
    console.log('[${capitalizedName}Provider] listProducts not yet implemented');
    return { items: [], totalItems: 0 };
  }

  async listSales(credentials: any, params: any): Promise<UnifiedListResponse<UnifiedSale>> {
    console.log('[${capitalizedName}Provider] listSales not yet implemented');
    return { items: [], totalItems: 0 };
  }

  async listSellers(credentials: any): Promise<UnifiedSeller[]> {
    console.log('[${capitalizedName}Provider] listSellers not yet implemented');
    return [];
  }

  async getSaleDetail(credentials: any, id: string): Promise<UnifiedSale> {
    throw new Error('[${capitalizedName}Provider] getSaleDetail not implemented');
  }

  async getSalePdf(credentials: any, id: string): Promise<ArrayBuffer> {
    throw new Error('[${capitalizedName}Provider] getSalePdf not implemented');
  }

  async bulkDeleteSales(credentials: any, ids: string[]): Promise<{ deletedCount: number, ignoredCount: number }> {
    throw new Error('[${capitalizedName}Provider] bulkDeleteSales not implemented');
  }
}
`;

const testTemplate = `import { describe, it, expect } from 'vitest';
import { ${capitalizedName}Provider } from '@/lib/providers/implementations/${capitalizedName}Provider';

describe('${capitalizedName}Provider', () => {
  it('should be correctly instantiated', () => {
    const provider = new ${capitalizedName}Provider();
    expect(provider).toBeInstanceOf(${capitalizedName}Provider);
  });
});
`;

// Paths
const providerPath = path.join(process.cwd(), 'src', 'lib', 'providers', 'implementations', `${capitalizedName}Provider.ts`);
const testPath = path.join(process.cwd(), 'src', 'tests', 'mappers', `${lowerName}.test.ts`);

// Create files
try {
  fs.writeFileSync(providerPath, providerTemplate);
  console.log(`✅ Created Provider: ${providerPath}`);

  fs.writeFileSync(testPath, testTemplate);
  console.log(`✅ Created Test: ${testPath}`);

  console.log('\n---');
  console.log(`🚀 Success! Provider ${capitalizedName} created.`);
  console.log(`👉 Next Step: Remember to register it in 'src/lib/providers/ProviderFactory.ts'.`);
  console.log('---\n');
} catch (error) {
  console.error('❌ Error generating provider:', error);
  process.exit(1);
}
