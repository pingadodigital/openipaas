import { NextRequest, NextResponse } from 'next/server'
import { withUnifiedAuth, UnifiedAuthContext } from '@/lib/api-auth'
import { unifiedErpRequestWithRetry } from '@/lib/unified-api-utils'

async function cestHandler(req: NextRequest, authContext: UnifiedAuthContext) {
  const { linkedAccount, credential } = authContext
  const url = new URL(req.url)
  const searchParams = new URLSearchParams()
  if (url.searchParams.get('search')) searchParams.append('busca_textual', url.searchParams.get('search')!)

  const path = `/produtos/cest${searchParams.toString() ? `?${searchParams.toString()}` : ''}`

  try {
    switch (linkedAccount.provider) {
      case 'CONTA_AZUL':
        const data = await unifiedErpRequestWithRetry(
          'CONTA_AZUL',
          credential.id,
          credential.accessToken,
          'GET',
          path,
          null
        )
        return NextResponse.json(data)
      default:
        return NextResponse.json({ error: 'Provider not supported' }, { status: 400 })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export const GET = withUnifiedAuth(cestHandler)
