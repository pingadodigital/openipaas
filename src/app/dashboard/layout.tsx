import { Sidebar } from '@/components/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen w-full bg-background dark">
      <Sidebar />
      <div className="flex flex-col w-full">
        <header className="h-14 lg:h-[60px] border-b flex items-center gap-4 px-6 bg-muted/10">
          <div className="flex-1">
            <h1 className="font-semibold text-sm">Dashboard</h1>
          </div>
        </header>
        <main className="flex-1 flex flex-col gap-4 p-4 md:gap-8 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
