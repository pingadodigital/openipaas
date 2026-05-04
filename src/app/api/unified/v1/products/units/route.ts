import { NextRequest, NextResponse } from 'next/server'
import { withUnifiedAuth, UnifiedAuthContext } from '@/lib/api-auth'
import { unifiedErpRequestWithRetry } from '@/lib/unified-api-utils'
import { mapContaAzulUnitToUnified } from '@/lib/mappers/products'

async function unitsHandler(req: NextRequest, authContext: UnifiedAuthContext) {
  const { linkedAccount, credential } = authContext
  const url = new URL(req.url)
  const searchParams = new URLSearchParams()
  if (url.searchParams.get('search')) searchParams.append('busca_textual', url.searchParams.get('search')!)

  const path = `/produtos/unidades-medida${searchParams.toString() ? `?${searchParams.toString()}` : ''}`

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
        const items = (data.items || []).map(mapContaAzulUnitToUnified)
        return NextResponse.json({ items, totalItems: data.total_items || items.length })
      default:
        return NextResponse.json({ error: 'Provider not supported' }, { status: 400 })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export const GET = withUnifiedAuth(unitsHandler)
