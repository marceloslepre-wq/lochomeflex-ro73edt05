import React, { createContext, useContext, useState, ReactNode } from 'react'
import { MOCK_CUSTOMERS, MOCK_INVENTORY, MOCK_RENTALS, MOCK_USERS, MOCK_SETTINGS } from './mockData'

export type InventoryItem = Omit<(typeof MOCK_INVENTORY)[0], 'conditionStatus'> & {
  description?: string
  conditionStatus: 'Disponível' | 'Manutenção' | 'Indisponível'
}
export type Customer = (typeof MOCK_CUSTOMERS)[0]
export type Rental = (typeof MOCK_RENTALS)[0] & { customContractText?: string }
export type User = (typeof MOCK_USERS)[0]
export type Settings = typeof MOCK_SETTINGS

interface MainStore {
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
  updateSettings: (data: Partial<Settings>) => void
  addUser: (user: User) => void
  updateUser: (id: string, data: Partial<User>) => void
}

const StoreContext = createContext<MainStore | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [globalSearch, setGlobalSearch] = useState('')
  const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY as InventoryItem[])
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS)
  const [rentals, setRentals] = useState<Rental[]>(MOCK_RENTALS)
  const [users, setUsers] = useState<User[]>(MOCK_USERS)
  const [settings, setSettings] = useState<Settings>(MOCK_SETTINGS)

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

  const addInventoryItem = (item: InventoryItem) => {
    setInventory((prev) => [item, ...prev])
  }

  const updateInventoryItem = (id: string, data: Partial<InventoryItem>) => {
    setInventory((prev) => prev.map((i) => (i.id === id ? { ...i, ...data } : i)))
  }

  const updateSettings = (data: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...data }))
  }

  const addUser = (user: User) => {
    setUsers((prev) => [...prev, user])
  }

  const updateUser = (id: string, data: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...data } : u)))
  }

  return React.createElement(
    StoreContext.Provider,
    {
      value: {
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
        updateSettings,
        addUser,
        updateUser,
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
