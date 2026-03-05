import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'sk_gift_cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  // keep localStorage in sync
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {}
  }, [items])

  const addToCart = useCallback((product) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id)
      if (idx !== -1) {
        const updated = [...prev]
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 }
        return updated
      }
      return [...prev, { product, quantity: 1 }]
    })
  }, [])

  const removeFromCart = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId))
  }, [])

  const updateQuantity = useCallback((productId, quantity) => {
    setItems((prev) => {
      if (quantity <= 0) return prev.filter((i) => i.product.id !== productId)
      return prev.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i
      )
    })
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
    totalPrice: items.reduce(
      (sum, i) => sum + i.quantity * (i.product.price || 0),
      0
    ),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
