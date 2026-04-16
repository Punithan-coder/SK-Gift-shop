import React, { Suspense, lazy, useEffect } from 'react'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Homepage from './components/Homepage/Homepage'
const ProductDetail = lazy(() => import('./components/ProductDetail/ProductDetail'))
const Cart = lazy(() => import('./components/Cart/Cart'))
const Checkout = lazy(() => import('./components/Checkout/Checkout'))
const OrderHistory = lazy(() => import('./components/OrderHistory/OrderHistory'))
const Contactpage = lazy(() => import('./components/Contactpage/Contactpage'))
const Login = lazy(() => import('./components/Auth/Login'))
const SignUp = lazy(() => import('./components/Auth/SignUp'))
const Aboutpage = lazy(() => import('./components/Aboutpage/Aboutpage'))

function LoadingFallback() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
      <div style={{ width: 40, height: 40, border: '3px solid #E8E2D9', borderTopColor: '#8B2942', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function App() {
  useEffect(() => {
    const blockGesture = (event) => {
      event.preventDefault()
    }
    const blockPinchZoomWheel = (event) => {
      if (event.ctrlKey) {
        event.preventDefault()
      }
    }

    document.addEventListener('gesturestart', blockGesture, { passive: false })
    document.addEventListener('gesturechange', blockGesture, { passive: false })
    document.addEventListener('gestureend', blockGesture, { passive: false })
    document.addEventListener('wheel', blockPinchZoomWheel, { passive: false })

    return () => {
      document.removeEventListener('gesturestart', blockGesture)
      document.removeEventListener('gesturechange', blockGesture)
      document.removeEventListener('gestureend', blockGesture)
      document.removeEventListener('wheel', blockPinchZoomWheel)
    }
  }, [])

  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="app">
          <Navbar />
          <main>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/contact" element={<Contactpage />} />
                <Route path="/about" element={<Aboutpage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
