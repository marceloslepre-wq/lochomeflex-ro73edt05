import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Layout from './components/Layout'
import Index from './pages/Index'
import { AuthProvider } from './hooks/use-auth'
import { ProtectedRoute } from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import ItemDetail from './pages/ItemDetail'
import Customers from './pages/Customers'
import Rentals from './pages/Rentals'
import RentalDetail from './pages/RentalDetail'
import Settings from './pages/Settings'
import Guide from './pages/Guide'
import NotFound from './pages/NotFound'
import PublicCustomerForm from './pages/PublicCustomerForm'

const App = () => (
  <AuthProvider>
    <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/public/customer/new" element={<PublicCustomerForm />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/inventory/:id" element={<ItemDetail />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/rentals" element={<Rentals />} />
              <Route path="/rentals/:id" element={<RentalDetail />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/guide" element={<Guide />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </AuthProvider>
)

export default App
