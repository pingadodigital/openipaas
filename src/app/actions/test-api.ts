"use server"

import prisma from '@/lib/prisma'

export async function testUnifiedApi(linkedAccountId: string) {
  try {
    // 1. Get the LinkedAccount and its associated Client
    const linkedAccount = await prisma.linkedAccount.findUnique({
      where: { id: linkedAccountId },
      include: { client: true }
    })

    if (!linkedAccount) {
      throw new Error("LinkedAccount not found")
    }

    // 2. Get a valid ApiKey for this Client
    const apiKey = await prisma.apiKey.findFirst({
      where: {
        clientId: linkedAccount.clientId
      }
    })

    if (!apiKey) {
      throw new Error("No active API Key found for this Client. Please generate one in the Clients tab.")
    }

    // 3. Prepare the fetch to our Unified API
    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').trim()
    const unifiedEndpoint = `${appUrl}/api/unified/v1/customers`

    const response = await fetch(unifiedEndpoint, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey.key}`,
        "X-Account-Token": linkedAccount.accountToken,
        "Content-Type": "application/json"
      }
    })

    const data = await response.json()

    return {
      success: response.ok,
      status: response.status,
      data
    }
  } catch (error: any) {
    console.error("Test API Action Error:", error)
    return {
      success: false,
      error: error.message || "An unexpected error occurred"
    }
  }
}
