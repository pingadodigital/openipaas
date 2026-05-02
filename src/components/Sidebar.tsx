import Link from 'next/link'
import { LayoutDashboard, Users, Link2, Activity } from 'lucide-react'

export function Sidebar() {
  return (
    <div className="w-64 border-r bg-muted/30 min-h-screen p-4 flex flex-col gap-4">
      <div className="flex items-center gap-2 px-2 py-4">
        <LayoutDashboard className="h-6 w-6 text-primary" />
        <span className="font-semibold text-lg tracking-tight">Unified API Hub</span>
      </div>
      
      <nav className="flex flex-col gap-1">
        <Link href="/dashboard/clients" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted">
          <Users className="h-4 w-4" />
          Clients & Keys
        </Link>
        <Link href="/dashboard/linked-accounts" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted">
          <Link2 className="h-4 w-4" />
          Linked Accounts
        </Link>
        <Link href="/dashboard/logs" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted">
          <Activity className="h-4 w-4" />
          API Logs
        </Link>
      </nav>
    </div>
  )
}
