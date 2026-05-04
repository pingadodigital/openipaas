import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Cleanup
  await prisma.oAuthCredential.deleteMany()
  await prisma.linkedAccount.deleteMany()
  await prisma.apiKey.deleteMany()
  await prisma.client.deleteMany()

  console.log('🧹 Database cleaned.')

  // 1. Create Admin Client
  const adminClient = await prisma.client.create({
    data: {
      name: 'Admin Local',
      apiKeys: {
        create: {
          key: 'dev-master-key-001'
        }
      }
    }
  })

  // 2. Create Conta Azul Linked Account (Mock)
  await prisma.linkedAccount.create({
    data: {
      clientId: adminClient.id,
      provider: 'CONTA_AZUL',
      accountToken: 'dev-token-ca-123',
      credentials: {
        create: {
          accessToken: 'mock-ca-access-token',
          refreshToken: 'mock-ca-refresh-token',
          expiresAt: new Date(Date.now() + 3600 * 1000)
        }
      }
    }
  })

  // 3. Create Omie Linked Account (Mock)
  await prisma.linkedAccount.create({
    data: {
      clientId: adminClient.id,
      provider: 'OMIE',
      accountToken: 'dev-token-omie-123',
      credentials: {
        create: {
          accessToken: 'dev-omie-app-key-abc',
          refreshToken: 'dev-omie-app-secret-xyz'
        }
      }
    }
  })

  console.log('✅ Seed finished successfully!')
  console.log('---')
  console.log('Master API Key: dev-master-key-001')
  console.log('Conta Azul X-Account-Token: dev-token-ca-123')
  console.log('Omie X-Account-Token: dev-token-omie-123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
