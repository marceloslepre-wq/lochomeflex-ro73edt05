import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, Users, FileText, Settings, LogOut } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'

const navItems = [
  { title: 'Painel', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Estoque', url: '/inventory', icon: Package },
  { title: 'Locações', url: '/rentals', icon: FileText },
  { title: 'Clientes', url: '/customers', icon: Users },
  { title: 'Configurações', url: '/settings', icon: Settings },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar className="border-r border-border bg-sidebar">
      <SidebarHeader className="p-4 flex items-center justify-center border-b">
        <div className="flex items-center gap-2 font-bold text-xl text-primary">
          <Package className="w-6 h-6" />
          <span>LocaWeb</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                <Link to={item.url} className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              variant="ghost"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Link to="/">
                <LogOut className="w-5 h-5" />
                <span>Sair</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
