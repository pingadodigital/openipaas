"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { testUnifiedApi } from '@/app/actions/test-api'

export function TestApiDialog({ linkedAccountId }: { linkedAccountId: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  async function handleTest() {
    console.log("Button clicked, running test API...")
    setIsLoading(true)
    setResult(null)
    try {
      const response = await testUnifiedApi(linkedAccountId)
      console.log("Response received:", response)
      setResult(response)
    } catch (error: any) {
      console.error("Test error:", error)
      setResult({ error: error.message || "Failed to call test action" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog onOpenChange={(isOpen) => {
      if (!isOpen) setResult(null)
    }}>
      <DialogTrigger render={<Button size="sm" variant="secondary" />}>
        Test API (Customers)
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Unified API Playground</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4 flex-1 overflow-hidden">
          <p className="text-sm text-muted-foreground">
            This will execute a real <code>GET /api/unified/v1/customers</code> request using the correct API Key and X-Account-Token for this connection.
          </p>

          <Button onClick={handleTest} disabled={isLoading} className="w-fit">
            {isLoading ? 'Running Test...' : 'Run Request'}
          </Button>

          {result && (
            <div className="flex-1 overflow-auto border rounded-md">
              <pre className="bg-muted p-4 text-xs font-mono whitespace-pre-wrap break-words">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
