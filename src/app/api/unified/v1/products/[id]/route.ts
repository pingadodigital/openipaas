import { NextRequest, NextResponse } from 'next/server'
import { withUnifiedAuth, UnifiedAuthContext } from '@/lib/api-auth'
import { unifiedErpRequestWithRetry } from '@/lib/unified-api-utils'
import { mapContaAzulProductToUnified, mapUnifiedToContaAzulProductPatch } from '@/lib/mappers/products'

async function productIdHandler(
  req: NextRequest, 
  authContext: UnifiedAuthContext,
  { params }: { params: { id: string } }
) {
  const { linkedAccount, credential } = authContext
  const { id } = params
  const method = req.method

  let body = null
  if (['PUT', 'PATCH'].includes(method)) {
    try { 
      const rawBody = await req.json() 
      if (method === 'PATCH' && linkedAccount.provider === 'CONTA_AZUL') {
        body = mapUnifiedToContaAzulProductPatch(rawBody)
      } else {
        body = rawBody
      }
    } catch (e) { 
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }
  }

  try {
    switch (linkedAccount.provider) {
      case 'CONTA_AZUL':
        const data = await unifiedErpRequestWithRetry(
          'CONTA_AZUL',
          credential.id,
          credential.accessToken,
          method,
          `/produtos/${id}`,
          body
        )

        if (method === 'GET') {
          return NextResponse.json(mapContaAzulProductToUnified(data))
        }

        return NextResponse.json(data)
      default:
        return NextResponse.json({ error: 'Provider not supported' }, { status: 400 })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export const GET = withUnifiedAuth(productIdHandler)
export const PUT = withUnifiedAuth(productIdHandler)
export const PATCH = withUnifiedAuth(productIdHandler)
export const DELETE = withUnifiedAuth(productIdHandler)
