import { NextRequest, NextResponse } from 'next/server'
import { withUnifiedAuth, UnifiedAuthContext } from '@/lib/api-auth'
import { ProviderFactory } from '@/lib/providers/ProviderFactory'

async function bulkDeleteSalesHandler(req: NextRequest, authContext: UnifiedAuthContext) {
  const { linkedAccount, credential } = authContext
  try {
    const { ids } = await req.json()
    const provider = ProviderFactory.getProvider(linkedAccount.provider)
    const result = await provider.bulkDeleteSales(credential, ids)
    return NextResponse.json(result)

  } catch (error: any) {
    console.error('[Sales Bulk Delete API Error]', error)
    return NextResponse.json({ error: error.message || 'Error in bulk delete' }, { status: 500 })
  }
}

export const DELETE = withUnifiedAuth(bulkDeleteSalesHandler)
export const POST = withUnifiedAuth(bulkDeleteSalesHandler)
