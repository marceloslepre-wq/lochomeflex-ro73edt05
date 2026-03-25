import React, { createContext, useContext, useState, ReactNode } from 'react'
import { MOCK_CUSTOMERS, MOCK_INVENTORY, MOCK_RENTALS } from './mockData'

export type InventoryItem = (typeof MOCK_INVENTORY)[0]
export type Customer = (typeof MOCK_CUSTOMERS)[0]
export type Rental = (typeof MOCK_RENTALS)[0]

interface MainStore {
  inventory: InventoryItem[]
  customers: Customer[]
  rentals: Rental[]
  addRental: (rental: Rental) => void
  returnRental: (rentalId: string, actualReturnDate: string) => void
  addInventoryItem: (item: InventoryItem) => void
}

const StoreContext = createContext<MainStore | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY)
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS)
  const [rentals, setRentals] = useState<Rental[]>(MOCK_RENTALS)

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

  const addInventoryItem = (item: InventoryItem) => {
    setInventory((prev) => [item, ...prev])
  }

  return React.createElement(
    StoreContext.Provider,
    { value: { inventory, customers, rentals, addRental, returnRental, addInventoryItem } },
    children,
  )
}

export default function useMainStore() {
  const context = useContext(StoreContext)
  if (!context) throw new Error('useMainStore must be used within a StoreProvider')
  return context
}
