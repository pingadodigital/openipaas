import { NextRequest, NextResponse } from 'next/server'
import { withUnifiedAuth, UnifiedAuthContext } from '@/lib/api-auth'
import { refreshErpToken } from '@/lib/token-refresh'

async function contaAzulRequest(method: string, path: string, body: any, accessToken: string) {
  const BASE_URL = "https://api.contaazul.com/v1";
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  
  if (!res.ok) {
    if (res.status === 401) throw new Error("TOKEN_EXPIRED");
    const err = await res.text();
    throw new Error(`Conta Azul API ${res.status}: ${err}`);
  }
  
  const text = await res.text();
  if (!text) return { ok: true };
  try { return JSON.parse(text); } catch { return { raw: text }; }
}

async function fetchContaAzulCustomersWithRetry(credential: any) {
  let accessToken = credential.accessToken;
  let autoRefreshed = false;

  try {
    return { data: await contaAzulRequest('GET', '/customers', null, accessToken), autoRefreshed };
  } catch (error: any) {
    if (error.message === 'TOKEN_EXPIRED') {
      console.log('[Conta Azul] Token expired. Refreshing...');
      // Chamamos o utilitário que atualiza o token no banco
      const newCredential = await refreshErpToken(credential.id);
      autoRefreshed = true;
      // Tentamos de novo com o token atualizado
      return { data: await contaAzulRequest('GET', '/customers', null, newCredential.accessToken), autoRefreshed };
    }
    throw error;
  }
}

async function getCustomersHandler(req: NextRequest, authContext: UnifiedAuthContext) {
  const { linkedAccount, credential } = authContext

  let customers: any[] = []
  let autoRefreshed = false

  try {
    if (linkedAccount.provider === 'CONTA_AZUL') {
      const result = await fetchContaAzulCustomersWithRetry(credential);
      
      // Mapeando a resposta da Conta Azul para o nosso formato padrão
      // Assumindo que a resposta devolve um array ou objeto com uma propriedade de array
      const rawData = Array.isArray(result.data) ? result.data : (result.data?.items || result.data || []);
      
      customers = rawData.map((caCustomer: any) => ({
        unifiedId: caCustomer.id?.toString() || 'unknown',
        name: caCustomer.name || caCustomer.social_reason || 'Unknown',
        source: 'CONTA_AZUL',
        raw: caCustomer 
      }))
      autoRefreshed = result.autoRefreshed;
      
    } else if (linkedAccount.provider === 'OMIE') {
      // OMIE Mock
      customers = [
        { unifiedId: 'om-1', name: 'Empresa X (Omie)', source: 'OMIE' },
        { unifiedId: 'om-2', name: 'Empresa Y (Omie)', source: 'OMIE' }
      ]
    } else {
      return NextResponse.json({ error: 'Unsupported Provider' }, { status: 400 })
    }

    return NextResponse.json({
      data: customers,
      meta: {
        provider: linkedAccount.provider,
        autoRefreshed
      }
    })
  } catch (error: any) {
    console.error('[Unified API Error]', error)
    return NextResponse.json({ error: error.message || 'Error fetching customers' }, { status: 500 })
  }
}

export const GET = withUnifiedAuth(getCustomersHandler)
