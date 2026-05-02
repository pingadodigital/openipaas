"use server"

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function connectErpAccount(formData: FormData) {
  const clientId = formData.get('clientId') as string
  const provider = formData.get('provider') as string
  const erpClientId = formData.get('erpClientId') as string | null
  const erpClientSecret = formData.get('erpClientSecret') as string | null
  const accessToken = formData.get('accessToken') as string
  const refreshToken = formData.get('refreshToken') as string | null

  if (!clientId || !provider || !accessToken) {
    return { error: 'Missing required fields' }
  }

  // 1. Create LinkedAccount and the credential relationship atomically
  const linkedAccount = await prisma.linkedAccount.create({
    data: {
      clientId,
      provider,
      // accountToken will be generated automatically via uuid() default
      credentials: {
        create: {
          accessToken,
          refreshToken,
          erpClientId,
          erpClientSecret,
          // You could set expiresAt if you know the expiration time
        }
      }
    }
  })

  revalidatePath('/dashboard/linked-accounts')
  return { success: true, linkedAccount }
}
