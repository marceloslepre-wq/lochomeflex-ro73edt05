import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, Users, FileText, Settings, BookOpen, LogOut } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import useMainStore from '@/stores/main'
import { usePermissions } from '@/hooks/use-permissions'
import { useAuth } from '@/hooks/use-auth'

export function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { settings, setCurrentUser } = useMainStore()
  const { can } = usePermissions()
  const { signOut } = useAuth()

  const navItems = [
    { title: 'Painel', url: '/dashboard', icon: LayoutDashboard, show: true },
    { title: 'Estoque', url: '/inventory', icon: Package, show: true },
    { title: 'Locações', url: '/rentals', icon: FileText, show: true },
    { title: 'Clientes', url: '/customers', icon: Users, show: true },
    { title: 'Guia de Uso', url: '/guide', icon: BookOpen, show: true },
    {
      title: 'Configurações',
      url: '/settings',
      icon: Settings,
      show: can('users:manage') || can('reports:view'),
    },
  ].filter((i) => i.show)

  const handleLogout = async () => {
    try {
      await signOut()
    } finally {
      setCurrentUser(null)
      // Limpa qualquer dado residual do localStorage para evitar reconexão fantasma
      if (typeof window !== 'undefined') {
        Object.keys(window.localStorage).forEach((key) => {
          if (key.startsWith('sb-')) {
            window.localStorage.removeItem(key)
          }
        })
      }
      navigate('/', { replace: true })
    }
  }

  return (
    <Sidebar className="border-r border-border bg-sidebar print:hidden">
      <SidebarHeader className="p-4 flex items-center justify-center border-b h-16">
        <div className="flex items-center gap-2 font-bold text-xl text-primary">
          {settings.logoUrl ? (
            <img src={settings.logoUrl} alt="Logo" className="max-h-8 w-auto object-contain" />
          ) : (
            <>
              <Package className="w-6 h-6" />
              <span>LocaWeb</span>
            </>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={
                  location.pathname === item.url || location.pathname.startsWith(item.url + '/')
                }
              >
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
              className="text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
              onClick={handleLogout}
            >
              <div>
                <LogOut className="w-5 h-5" />
                <span>Sair</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
