import { memo, useCallback, useMemo } from 'react'
import { useCart } from '../context/CartContext'
import './ProductCard.css'

const ProductCard = memo(({ product }) => {
  const { id, title, price, category, image } = product ?? {}

  const { addToCart, items } = useCart()

  if (id == null) return null

  const inCart = useMemo(() => {
    return items.some((i) => i.product.id === id)
  }, [items, id])

  const handleAddToCart = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (product && !inCart) {
      addToCart(product)
    }
  }, [addToCart, product, inCart])

  return (
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
            ${typeof price === 'number' ? price.toFixed(2) : price ?? '0.00'}
          </p>
        </div>
      </a>
      <button
        type="button"
        className="product-card__btn"
        onClick={handleAddToCart}
        disabled={inCart}
      >
        {inCart ? 'Added' : 'Add to Cart'}
      </button>
    </article>
  )
})

ProductCard.displayName = 'ProductCard'

export default ProductCard
