import { memo, useCallback, useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './ProductCard.css'

const ProductCard = memo(({ product }) => {
  const { id, title, price, category, image } = product ?? {}
  const navigate = useNavigate()
  const { addToCart, items } = useCart()
  const [showToast, setShowToast] = useState(false)

  if (id == null) return null

  const inCart = useMemo(() => {
    return items.some((i) => i.product.id === id)
  }, [items, id])

  const handleAddToCart = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (product && !inCart) {
      addToCart(product)
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    }
  }, [addToCart, product, inCart])

  const handleGoToCart = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    navigate('/cart')
  }, [navigate])

  return (
    <>
      <article className="product-card">
        <a href={`/product/${id}`} className="product-card__link">
          <div className="product-card__image">
            {image ? (
              <img src={image} alt={title} loading="lazy" />
            ) : (
              <div className="product-card__placeholder" />
            )}
            <span className="product-card__badge">{category}</span>
          </div>
          <div className="product-card__body">
            <h3 className="product-card__title">{title || 'Product Title'}</h3>
            <p className="product-card__price">
              ₹{typeof price === 'number' ? price.toFixed(2) : price ?? '0.00'}
            </p>
          </div>
        </a>
        <div className="product-card__actions">
          {!inCart ? (
            <button
              type="button"
              className="product-card__btn product-card__btn--add"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          ) : (
            <button
              type="button"
              className="product-card__btn product-card__btn--cart"
              onClick={handleGoToCart}
            >
              ✓ Go to Cart
            </button>
          )}
        </div>
      </article>
      
      {showToast && (
        <div className="product-card__toast">
          <div className="product-card__toast-content">
            <span className="product-card__toast-icon">🎉</span>
            <div className="product-card__toast-text">
              <p className="product-card__toast-title">Added to Cart!</p>
              <p className="product-card__toast-subtitle">{title}</p>
            </div>
            <button
              className="product-card__toast-cta"
              onClick={handleGoToCart}
            >
              Go to Cart →
            </button>
          </div>
        </div>
      )}
    </>
  )
})

ProductCard.displayName = 'ProductCard'

export default ProductCard
