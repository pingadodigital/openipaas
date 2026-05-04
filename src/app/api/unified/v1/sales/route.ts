import { NextRequest, NextResponse } from 'next/server'
import { withUnifiedAuth, UnifiedAuthContext } from '@/lib/api-auth'
import { ProviderFactory } from '@/lib/providers/ProviderFactory'

async function salesHandler(req: NextRequest, authContext: UnifiedAuthContext) {
  const { linkedAccount, credential } = authContext
  const method = req.method
  
  const url = new URL(req.url)
  const queryParams = Object.fromEntries(url.searchParams.entries())

  try {
    const provider = ProviderFactory.getProvider(linkedAccount.provider)

    if (method === 'GET') {
      const data = await provider.listSales(credential, queryParams)
      return NextResponse.json(data)
    }

    return NextResponse.json({ error: 'Method not implemented in provider plugin' }, { status: 501 })

  } catch (error: any) {
    console.error('[Unified Sales API Error]', error)
    return NextResponse.json({ error: error.message || 'Error processing sales request' }, { status: 500 })
  }
}

export const GET = withUnifiedAuth(salesHandler)
export const POST = withUnifiedAuth(salesHandler)
