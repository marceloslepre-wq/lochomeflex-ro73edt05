import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Layout from './components/Layout'
import Index from './pages/Index'
import { AuthProvider } from './hooks/use-auth'
import { StoreProvider } from './stores/main'
import { ProtectedRoute } from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import ItemDetail from './pages/ItemDetail'
import Customers from './pages/Customers'
import Assets from './pages/Assets'
import Rentals from './pages/Rentals'
import RentalDetail from './pages/RentalDetail'
import Settings from './pages/Settings'
import Guide from './pages/Guide'
import NotFound from './pages/NotFound'
import PublicCustomerForm from './pages/PublicCustomerForm'
import PublicAssetForm from './pages/PublicAssetForm'

const App = () => (
  <AuthProvider>
    <StoreProvider>
      <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/public/customer/new" element={<PublicCustomerForm />} />
            <Route path="/public/asset/new" element={<PublicAssetForm />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/inventory/:id" element={<ItemDetail />} />
                <Route path="/assets" element={<Assets />} />
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
    </StoreProvider>
  </AuthProvider>
)

export default App
