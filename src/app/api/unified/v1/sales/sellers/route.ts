import { NextRequest, NextResponse } from 'next/server'
import { withUnifiedAuth, UnifiedAuthContext } from '@/lib/api-auth'
import { ProviderFactory } from '@/lib/providers/ProviderFactory'

async function sellersHandler(req: NextRequest, authContext: UnifiedAuthContext) {
  const { linkedAccount, credential } = authContext

  try {
    const provider = ProviderFactory.getProvider(linkedAccount.provider)
    const data = await provider.listSellers(credential)
    return NextResponse.json(data)

  } catch (error: any) {
    console.error('[Sellers API Error]', error)
    return NextResponse.json({ error: error.message || 'Error fetching sellers' }, { status: 500 })
  }
}

export const GET = withUnifiedAuth(sellersHandler)
