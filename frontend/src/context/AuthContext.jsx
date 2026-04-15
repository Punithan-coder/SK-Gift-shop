import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'
const TOKEN_KEY = 'sk_gift_token'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchWithToken = useCallback((url, options = {}) => {
    const token = localStorage.getItem(TOKEN_KEY)
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    }
    return fetch(`${API_URL}${url}`, { ...options, headers })
  }, [])

  const login = useCallback(async (email, password) => {
    let res
    try {
      res = await fetchWithToken('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
    } catch (e) {
      throw new Error('Could not connect. Make sure the backend is running (python app.py).')
    }
    const text = await res.text()
    let data = {}
    try {
      data = text ? JSON.parse(text) : {}
    } catch (_) {}
    if (!res.ok) {
      let msg = data.error
      if (!msg) {
        if ([502, 503, 504].includes(res.status)) msg = 'Backend not reachable. Start it: cd backend && python app.py'
        else if (res.status === 500) msg = 'Server error. Check backend console.'
        else msg = 'Login failed'
      }
      throw new Error(msg)
    }
    localStorage.setItem(TOKEN_KEY, data.token)
    setUser(data.user)
    return data
  }, [fetchWithToken])

  const signup = useCallback(async (email, password) => {
    let res
    try {
      res = await fetchWithToken('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
    } catch (e) {
      throw new Error('Could not connect. Make sure the backend is running (python app.py in the backend folder).')
    }
    const text = await res.text()
    let data = {}
    try {
      data = text ? JSON.parse(text) : {}
    } catch (_) {}
    if (!res.ok) {
      let msg = data.error
      if (!msg) {
        if ([502, 503, 504].includes(res.status)) msg = 'Backend not reachable. Start it: cd backend && python app.py'
        else if (res.status === 500) msg = 'Server error. Check backend console.'
        else msg = 'Sign up failed'
      }
      throw new Error(msg)
    }
    localStorage.setItem(TOKEN_KEY, data.token)
    setUser(data.user)
    return data
  }, [fetchWithToken])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setLoading(false)
      return
    }
    fetchWithToken('/api/auth/me')
      .then((res) => {
        if (res.ok) return res.json()
        throw new Error('Invalid token')
      })
      .then((data) => setUser(data.user))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false))
  }, [fetchWithToken])

  const value = { user, loading, login, signup, logout, isAuthenticated: !!user }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
