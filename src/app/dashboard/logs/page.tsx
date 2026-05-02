"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([])

  useEffect(() => {
    // Generate mock logs
    const mockLogs = Array.from({ length: 15 }).map((_, i) => ({
      id: `log-${i}`,
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString(),
      client: ['Acme Corp', 'Globex Inc', 'Initech'][Math.floor(Math.random() * 3)],
      endpoint: '/api/unified/v1/customers',
      status: Math.random() > 0.8 ? 401 : 200,
      latency: Math.floor(Math.random() * 800) + 50
    })).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    
    setLogs(mockLogs)
  }, [])

  return (
    <div className="space-y-4 max-w-6xl w-full mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">API Logs</h2>
        <p className="text-muted-foreground">Real-time mock traffic monitoring.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Requests</CardTitle>
          <CardDescription>Showing the latest API calls across all connected clients.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Endpoint</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Latency</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-medium">{log.client}</TableCell>
                  <TableCell className="font-mono text-xs">{log.endpoint}</TableCell>
                  <TableCell>
                    <Badge variant={log.status === 200 ? 'default' : 'destructive'}>
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs">
                    {log.latency}ms
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
