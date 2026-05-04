import { IUnifiedProvider } from "./IProvider";
import { ContaAzulProvider } from "./implementations/ContaAzulProvider";
import { OmieProvider } from "./implementations/OmieProvider";

export class ProviderFactory {
  static getProvider(providerName: string): IUnifiedProvider {
    switch (providerName.toUpperCase()) {
      case 'CONTA_AZUL':
        return new ContaAzulProvider();
      case 'OMIE':
        return new OmieProvider();
      default:
        throw new Error(`Provider ${providerName} not supported`);
    }
  }
}
