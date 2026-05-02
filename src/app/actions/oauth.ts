"use server"

export async function getContaAzulAuthUrl(clientId: string) {
  const contaAzulClientId = process.env.CONTA_AZUL_CLIENT_ID || process.env.NEXT_PUBLIC_CONTA_AZUL_CLIENT_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'http://localhost:3000';
  const redirectUri = `${appUrl}/api/oauth/callback/conta-azul`;
  
  return `https://auth.contaazul.com/login?response_type=code&client_id=${contaAzulClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${clientId}&scope=openid+profile+aws.cognito.signin.user.admin`;
}
