import prisma from './prisma'

export async function refreshErpToken(credentialId: string) {
  console.log(`[TokenRefresh] Initiating refresh for credential: ${credentialId}`)
  
  const credential = await prisma.oAuthCredential.findUnique({
    where: { id: credentialId },
    include: { linkedAccount: true }
  })

  if (!credential || !credential.refreshToken) {
    throw new Error("No refresh token available to renew the session.")
  }

  if (credential.linkedAccount.provider === 'CONTA_AZUL') {
    const contaAzulClientId = (process.env.CONTA_AZUL_CLIENT_ID || process.env.NEXT_PUBLIC_CONTA_AZUL_CLIENT_ID || "").trim()
    const contaAzulClientSecret = (process.env.CONTA_AZUL_CLIENT_SECRET || "").trim()

    if (!contaAzulClientId || !contaAzulClientSecret) {
      throw new Error("Conta Azul credentials not configured on the server.")
    }

    const basicAuth = Buffer.from(`${contaAzulClientId}:${contaAzulClientSecret}`).toString('base64')

    console.log("[TokenRefresh] Sending request to auth.contaazul.com...")
    const response = await fetch('https://auth.contaazul.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: credential.refreshToken
      })
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error(`[TokenRefresh Raw Error] Status: ${response.status} | Body: ${errText}`)
      throw new Error(`Failed to refresh token: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("[TokenRefresh] New tokens received successfully.")
    
    const expiresAt = data.expires_in ? new Date(Date.now() + data.expires_in * 1000) : null

    const updated = await prisma.oAuthCredential.update({
      where: { id: credentialId },
      data: {
        accessToken: data.access_token,
        refreshToken: data.refresh_token || credential.refreshToken,
        expiresAt: expiresAt,
        updatedAt: new Date(),
      }
    })

    return updated
  }

  // Fallback for other mock providers
  const newAccessToken = `mock-access-token-${Date.now()}`
  const updated = await prisma.oAuthCredential.update({
    where: { id: credentialId },
    data: {
      accessToken: newAccessToken,
      updatedAt: new Date(),
    }
  })

  console.log(`[TokenRefresh] Mock Token refreshed successfully`)
  return updated
}
