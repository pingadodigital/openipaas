import { NextRequest, NextResponse } from 'next/server'
import prisma from './prisma'
import { Client, LinkedAccount, OAuthCredential } from '@prisma/client'

export interface UnifiedAuthContext {
  client: Client
  linkedAccount: LinkedAccount
  credential: OAuthCredential
}

type HandlerFunction = (
  req: NextRequest,
  authContext: UnifiedAuthContext,
  ...args: any[]
) => Promise<NextResponse> | NextResponse

export function withUnifiedAuth(handler: HandlerFunction) {
  return async (req: NextRequest, ...args: any[]) => {
    try {
      // 1. Validate API Key (Authorization: Bearer <API_KEY>)
      const authHeader = req.headers.get('Authorization')
      if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Missing or invalid Authorization header' }, { status: 401 })
      }
      
      const apiKeyString = authHeader.split(' ')[1]
      
      const apiKeyRecord = await prisma.apiKey.findUnique({
        where: { key: apiKeyString },
        include: { client: true }
      })

      if (!apiKeyRecord || !apiKeyRecord.client) {
        return NextResponse.json({ error: 'Invalid API Key' }, { status: 401 })
      }

      // 2. Validate X-Account-Token header
      const accountToken = req.headers.get('X-Account-Token')
      if (!accountToken) {
        return NextResponse.json({ error: 'Missing X-Account-Token header' }, { status: 400 })
      }

      const linkedAccount = await prisma.linkedAccount.findUnique({
        where: { accountToken },
        include: { credentials: true }
      })

      // Must exist and belong to the authenticated client
      if (!linkedAccount || linkedAccount.clientId !== apiKeyRecord.clientId) {
        return NextResponse.json({ error: 'Invalid X-Account-Token' }, { status: 401 })
      }

      const credential = linkedAccount.credentials[0]
      if (!credential) {
        return NextResponse.json({ error: 'No OAuth credential found for this account' }, { status: 401 })
      }

      const authContext: UnifiedAuthContext = {
        client: apiKeyRecord.client,
        linkedAccount,
        credential
      }

      // Execute original handler with injected context
      return await handler(req, authContext, ...args)

    } catch (error) {
      console.error('[UnifiedAuth] Error:', error)
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
  }
}
