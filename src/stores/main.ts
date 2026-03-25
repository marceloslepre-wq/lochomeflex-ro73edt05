import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { MOCK_CUSTOMERS, MOCK_INVENTORY, MOCK_RENTALS, MOCK_USERS, MOCK_SETTINGS } from './mockData'
import { PermissionKey } from '@/hooks/use-permissions'

export type InventoryItem = Omit<(typeof MOCK_INVENTORY)[0], 'conditionStatus'> & {
  description?: string
  conditionStatus: 'Disponível' | 'Manutenção' | 'Indisponível' | 'Esgotado'
}
export type Customer = (typeof MOCK_CUSTOMERS)[0]
export type Rental = (typeof MOCK_RENTALS)[0] & {
  customContractText?: string
  customContractHtml?: string
}
export type User = Omit<(typeof MOCK_USERS)[0], 'permissions'> & { permissions: PermissionKey[] }
export type Settings = typeof MOCK_SETTINGS

interface MainStore {
  currentUser: User | null
  setCurrentUser: (user: User | null) => void
  globalSearch: string
  setGlobalSearch: (search: string) => void
  inventory: InventoryItem[]
  customers: Customer[]
  rentals: Rental[]
  users: User[]
  settings: Settings
  addRental: (rental: Rental) => void
  returnRental: (rentalId: string, actualReturnDate: string) => void
  updateRental: (id: string, data: Partial<Rental>) => void
  addInventoryItem: (item: InventoryItem) => void
  updateInventoryItem: (id: string, data: Partial<InventoryItem>) => void
  deleteInventoryItem: (id: string) => void
  addCustomer: (customer: Customer) => void
  updateCustomer: (id: string, data: Partial<Customer>) => void
  deleteCustomer: (id: string) => void
  updateSettings: (data: Partial<Settings>) => void
  addUser: (user: User) => void
  updateUser: (id: string, data: Partial<User>) => void
  deleteUser: (id: string) => void
}

const StoreContext = createContext<MainStore | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser')
    return saved ? JSON.parse(saved) : null
  })
  const [globalSearch, setGlobalSearch] = useState('')
  const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY as InventoryItem[])
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS)
  const [rentals, setRentals] = useState<Rental[]>(MOCK_RENTALS)
  const [users, setUsers] = useState<User[]>(MOCK_USERS as User[])
  const [settings, setSettings] = useState<Settings>(MOCK_SETTINGS)

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser))
    } else {
      localStorage.removeItem('currentUser')
    }
  }, [currentUser])

  const addRental = (rental: Rental) => {
    setRentals((prev) => [rental, ...prev])
    setInventory((prev) =>
      prev.map((item) => {
        const rented = rental.items.find((ri) => ri.itemId === item.id)
        if (rented) {
          return {
            ...item,
            availableQty: item.availableQty - rented.qty,
            rentedQty: item.rentedQty + rented.qty,
          }
        }
        return item
      }),
    )
  }

  const returnRental = (rentalId: string, actualDate: string) => {
    const rental = rentals.find((r) => r.id === rentalId)
    if (!rental) return

    setRentals((prev) =>
      prev.map((r) =>
        r.id === rentalId ? { ...r, status: 'Devolvido', actualReturnDate: actualDate } : r,
      ),
    )
    setInventory((prev) =>
      prev.map((item) => {
        const rented = rental.items.find((ri) => ri.itemId === item.id)
        if (rented) {
          return {
            ...item,
            availableQty: item.availableQty + rented.qty,
            rentedQty: item.rentedQty - rented.qty,
          }
        }
        return item
      }),
    )
  }

  const updateRental = (id: string, data: Partial<Rental>) => {
    setRentals((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)))
  }

  const addInventoryItem = (item: InventoryItem) => setInventory((prev) => [item, ...prev])
  const updateInventoryItem = (id: string, data: Partial<InventoryItem>) =>
    setInventory((prev) => prev.map((i) => (i.id === id ? { ...i, ...data } : i)))
  const deleteInventoryItem = (id: string) =>
    setInventory((prev) => prev.filter((i) => i.id !== id))

  const addCustomer = (c: Customer) => setCustomers((prev) => [c, ...prev])
  const updateCustomer = (id: string, data: Partial<Customer>) =>
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)))
  const deleteCustomer = (id: string) => setCustomers((prev) => prev.filter((c) => c.id !== id))

  const updateSettings = (data: Partial<Settings>) => setSettings((prev) => ({ ...prev, ...data }))

  const addUser = (user: User) => setUsers((prev) => [...prev, user])
  const updateUser = (id: string, data: Partial<User>) =>
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...data } : u)))
  const deleteUser = (id: string) => setUsers((prev) => prev.filter((u) => u.id !== id))

  return React.createElement(
    StoreContext.Provider,
    {
      value: {
        currentUser,
        setCurrentUser,
        globalSearch,
        setGlobalSearch,
        inventory,
        customers,
        rentals,
        users,
        settings,
        addRental,
        returnRental,
        updateRental,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        updateSettings,
        addUser,
        updateUser,
        deleteUser,
      },
    },
    children,
  )
}

export default function useMainStore() {
  const context = useContext(StoreContext)
  if (!context) throw new Error('useMainStore must be used within a StoreProvider')
  return context
}
