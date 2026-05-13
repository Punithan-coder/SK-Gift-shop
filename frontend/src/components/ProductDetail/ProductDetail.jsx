import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useCart } from '../../context/CartContext'
import './ProductDetail.css'

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'

const ProductDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products/${id}`)
        if (!response.ok) throw new Error('Product not found')
        const data = await response.json()
        setProduct(data.product)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  if (loading) {
    return <div className="product-detail"><p>Loading...</p></div>
  }

  if (error || !product) {
    return (
      <div className="product-detail product-detail--not-found">
        <h2>{error || 'Product not found'}</h2>
        <Link to={{ pathname: '/', search: '', hash: '#products' }}>← Back to shop</Link>
      </div>
    )
  }

  const { title, price, category, image } = product

  const { addToCart, items } = useCart()

  const inCart = items.some((i) => i.product.id === product.id)

  const handleAdd = () => {
    if (!inCart) addToCart(product)
  }

  const imageUrl = image?.startsWith('/static/') ? `${API_URL}${image}` : image

  return (
    <div className="product-detail">
      <Link
        to={{ pathname: '/', search: '', hash: '#products' }}
        className="product-detail__back"
      >
        ← Back to shop
      </Link>
      <div className="product-detail__grid">
        <div className="product-detail__image-wrap">
          {imageUrl ? (
            <img src={imageUrl} alt={title} />
          ) : (
            <div className="product-detail__placeholder" />
          )}
        </div>
        <div className="product-detail__info">
          <span className="product-detail__category">{category}</span>
          <h1>{title}</h1>
          <p className="product-detail__price">₹{typeof price === 'number' ? price.toFixed(2) : price}</p>
          <button
            type="button"
            className="product-detail__btn"
            onClick={handleAdd}
            disabled={inCart}
          >
            {inCart ? 'Added' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
