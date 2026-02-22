import { memo, useCallback } from 'react'
import './ProductCard.css'

const ProductCard = memo(({ product }) => {
  const { id, title, price, category, image } = product ?? {}

  const handleAddToCart = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    // TODO: add to cart
  }, [])

  if (id == null) return null

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
      >
        Add to Cart
      </button>
    </article>
  )
})

ProductCard.displayName = 'ProductCard'

export default ProductCard
