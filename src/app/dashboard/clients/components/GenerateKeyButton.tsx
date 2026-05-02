"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { generateApiKey } from '@/app/actions/client'

export function GenerateKeyButton({ clientId }: { clientId: string }) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleGenerate() {
    setIsLoading(true)
    await generateApiKey(clientId)
    setIsLoading(false)
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleGenerate} disabled={isLoading}>
      {isLoading ? 'Generating...' : 'Generate New Key'}
    </Button>
  )
}
