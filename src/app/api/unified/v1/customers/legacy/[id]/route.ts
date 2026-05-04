import { NextRequest, NextResponse } from 'next/server'
import { withUnifiedAuth, UnifiedAuthContext } from '@/lib/api-auth'
import { unifiedErpRequestWithRetry } from '@/lib/unified-api-utils'

async function legacyHandler(
  req: NextRequest, 
  authContext: UnifiedAuthContext,
  { params }: { params: { id: string } }
) {
  const { linkedAccount, credential } = authContext
  const { id } = params

  try {
    switch (linkedAccount.provider) {
      case 'CONTA_AZUL':
        const data = await unifiedErpRequestWithRetry(
          'CONTA_AZUL',
          credential.id,
          credential.accessToken,
          'GET',
          `/pessoas/legado/${id}`,
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

export const GET = withUnifiedAuth(legacyHandler)
