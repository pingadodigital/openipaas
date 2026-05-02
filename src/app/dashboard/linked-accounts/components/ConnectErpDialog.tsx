"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getContaAzulAuthUrl } from '@/app/actions/oauth'

export function ConnectErpDialog({ clients }: { clients: { id: string, name: string }[] }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    
    const formData = new FormData(e.currentTarget)
    const clientId = formData.get('clientId') as string
    const provider = formData.get('provider') as string

    if (!clientId || !provider) {
      alert("Please select a client and a provider.")
      return
    }

    setIsLoading(true)

    if (provider === 'CONTA_AZUL') {
      const authUrl = await getContaAzulAuthUrl(clientId)
      setIsLoading(false)
      setOpen(false)
      window.location.href = authUrl
    } else {
      setIsLoading(false)
      alert("OAuth for this provider is not implemented yet.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>Connect ERP</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Connect ERP Account</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          
          <div className="space-y-2">
            <Label htmlFor="clientId">Client</Label>
            <Select name="clientId" required>
              <SelectTrigger>
                <SelectValue placeholder="Select a Client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="provider">Provider</Label>
            <Select name="provider" required>
              <SelectTrigger>
                <SelectValue placeholder="Select ERP Provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CONTA_AZUL">Conta Azul</SelectItem>
                <SelectItem value="OMIE">Omie</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Connecting...' : 'Connect ERP'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
