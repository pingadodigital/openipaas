import { refreshErpToken } from './token-refresh'

export async function contaAzulRequest(method: string, path: string, body: any, accessToken: string) {
  const BASE_URL = "https://api-v2.contaazul.com/v1";
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  
  if (!res.ok) {
    const errText = await res.text();
    console.error(`[Conta Azul Raw Error] Status: ${res.status} | Body: ${errText}`);
    
    if (res.status === 401) throw new Error("TOKEN_EXPIRED");
    
    // Se for 400 ou outro erro, tentamos extrair o campo "error" do JSON
    try {
      const errJson = JSON.parse(errText);
      if (errJson.error) throw new Error(errJson.error);
    } catch (e: any) {
      if (e.message !== "TOKEN_EXPIRED") {
        throw new Error(`Conta Azul API ${res.status}: ${errText}`);
      }
      throw e;
    }
    
    throw new Error(`Conta Azul API ${res.status}: ${errText}`);
  }
  
  const text = await res.text();
  if (!text) return { ok: true };
  try { return JSON.parse(text); } catch { return { raw: text }; }
}

export async function unifiedErpRequestWithRetry(
  provider: string,
  credentialId: string,
  accessToken: string,
  method: string,
  path: string,
  body: any
) {
  if (provider === 'CONTA_AZUL') {
    try {
      return await contaAzulRequest(method, path, body, accessToken);
    } catch (error: any) {
      if (error.message === 'TOKEN_EXPIRED') {
        console.log('[Conta Azul] 401 Unauthorized detected. Attempting to refresh token...');
        try {
          const newCredential = await refreshErpToken(credentialId);
          console.log('[Conta Azul] Refresh successful. Retrying original request with NEW token...');
          return await contaAzulRequest(method, path, body, newCredential.accessToken);
        } catch (refreshError: any) {
          console.error('[Conta Azul] Refresh or Retry failed:', refreshError.message);
          throw refreshError;
        }
      }
      throw error;
    }
  }
  
  throw new Error(`Provider ${provider} not supported for retry logic yet.`);
}
