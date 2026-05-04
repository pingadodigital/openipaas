import { NextRequest, NextResponse } from 'next/server'
import { withUnifiedAuth, UnifiedAuthContext } from '@/lib/api-auth'
import { ProviderFactory } from '@/lib/providers/ProviderFactory'

async function salePdfHandler(
  req: NextRequest, 
  authContext: UnifiedAuthContext,
  { params }: { params: { id: string } }
) {
  const { linkedAccount, credential } = authContext
  const id = params.id

  try {
    const provider = ProviderFactory.getProvider(linkedAccount.provider)
    
    try {
      const buffer = await provider.getSalePdf(credential, id)
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="venda_${id}.pdf"`
        }
      })
    } catch (err: any) {
      if (err.message === 'PDF_REFRESH_NEEDED') {
        // Here we would ideally trigger a refresh and retry, 
        // but for now we follow the existing pattern of reporting error.
        // In the route, it was using unifiedErpRequestWithRetry but that was for JSON.
        // The original route had special logic for PDF.
        throw err;
      }
      throw err;
    }

  } catch (error: any) {
    console.error('[Sale PDF API Error]', error)
    return NextResponse.json({ error: error.message || 'Error downloading PDF' }, { status: 500 })
  }
}

export const GET = withUnifiedAuth(salePdfHandler as any)
