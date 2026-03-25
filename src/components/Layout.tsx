import { Outlet, useLocation } from 'react-router-dom'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { Bell, Search, UserCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function Layout() {
  const location = useLocation()
  const isLoginPage = location.pathname === '/'

  if (isLoginPage) {
    return <Outlet />
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background overflow-hidden">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 border-b bg-card flex items-center justify-between px-4 sticky top-0 z-10 shadow-sm">
            <div className="flex items-center gap-4 flex-1">
              <SidebarTrigger />
              <div className="relative max-w-md hidden sm:block">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar locações, clientes..."
                  className="pl-9 bg-muted/50 border-none w-full"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative text-muted-foreground">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
              </Button>
              <div className="flex items-center gap-2 border-l pl-4">
                <UserCircle className="w-8 h-8 text-primary" />
                <div className="hidden md:flex flex-col text-sm">
                  <span className="font-semibold leading-none">Admin Silva</span>
                  <span className="text-xs text-muted-foreground">Administrador</span>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-y-auto animate-fade-in-up pb-20">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
