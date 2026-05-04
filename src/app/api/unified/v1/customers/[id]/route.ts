import { NextRequest, NextResponse } from 'next/server'
import { withUnifiedAuth, UnifiedAuthContext } from '@/lib/api-auth'
import { unifiedErpRequestWithRetry } from '@/lib/unified-api-utils'
import { mapContaAzulCustomerToUnified } from '@/lib/mappers/contaazul'

async function customerIdHandler(
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
      body = await req.json() 
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
          `/pessoas/${id}`,
          body
        )

        // Map data for GET by ID
        if (method === 'GET') {
          return NextResponse.json(mapContaAzulCustomerToUnified(data))
        }

        return NextResponse.json(data)
      default:
        return NextResponse.json({ error: 'Provider not supported' }, { status: 400 })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export const GET = withUnifiedAuth(customerIdHandler)
export const PUT = withUnifiedAuth(customerIdHandler)
export const PATCH = withUnifiedAuth(customerIdHandler)
