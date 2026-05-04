import { NextRequest, NextResponse } from 'next/server'
import { withUnifiedAuth, UnifiedAuthContext } from '@/lib/api-auth'
import { ProviderFactory } from '@/lib/providers/ProviderFactory'

async function saleDetailHandler(
  req: NextRequest, 
  authContext: UnifiedAuthContext,
  { params }: { params: { id: string } }
) {
  const { linkedAccount, credential } = authContext
  const id = params.id

  try {
    const provider = ProviderFactory.getProvider(linkedAccount.provider)
    const data = await provider.getSaleDetail(credential, id)
    return NextResponse.json(data)

  } catch (error: any) {
    console.error('[Sale Detail API Error]', error)
    return NextResponse.json({ error: error.message || 'Error fetching sale details' }, { status: 500 })
  }
}

export const GET = withUnifiedAuth(saleDetailHandler as any)
