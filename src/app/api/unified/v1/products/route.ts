import { NextRequest, NextResponse } from 'next/server'
import { withUnifiedAuth, UnifiedAuthContext } from '@/lib/api-auth'
import { ProviderFactory } from '@/lib/providers/ProviderFactory'

async function productsHandler(req: NextRequest, authContext: UnifiedAuthContext) {
  const { linkedAccount, credential } = authContext
  const method = req.method
  
  const url = new URL(req.url)
  const queryParams = Object.fromEntries(url.searchParams.entries())

  try {
    const provider = ProviderFactory.getProvider(linkedAccount.provider)

    if (method === 'GET') {
      const data = await provider.listProducts(credential, queryParams)
      return NextResponse.json(data)
    }

    return NextResponse.json({ error: 'Method not implemented in provider plugin' }, { status: 501 })

  } catch (error: any) {
    console.error('[Unified Products API Error]', error)
    return NextResponse.json({ error: error.message || 'Error processing products request' }, { status: 500 })
  }
}

export const GET = withUnifiedAuth(productsHandler)
export const POST = withUnifiedAuth(productsHandler)
