const BASE_URL = "https://app.omie.com.br/api/v1";

/**
 * Omie API Request Utility
 * Omie uses a JSON-RPC style: all requests are POST to a specific path,
 * and the body contains the 'call', 'app_key', 'app_secret', and 'param'.
 */
export async function omieRequest(
  path: string, 
  call: string, 
  param: any[], 
  appKey: string, 
  appSecret: string
): Promise<any> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      call,
      app_key: appKey,
      app_secret: appSecret,
      param,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`[Omie Raw Error] Status: ${res.status} | Body: ${errText}`);
    throw new Error(`Omie API ${res.status}: ${errText}`);
  }

  const data = await res.json();

  // Omie sometimes returns error info inside the JSON body even with 200 OK
  if (data.faultString) {
    throw new Error(`Omie API Error: ${data.faultString} (${data.faultCode})`);
  }

  return data;
}
