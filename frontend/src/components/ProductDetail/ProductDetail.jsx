import { useParams, Link } from 'react-router-dom'
import { SAMPLE_PRODUCTS } from '../../data/products'
import './ProductDetail.css'

const ProductDetail = () => {
  const { id } = useParams()
  const product = SAMPLE_PRODUCTS.find((p) => String(p.id) === id)

  if (!product) {
    return (
      <div className="product-detail product-detail--not-found">
        <h2>Product not found</h2>
        <Link to="/">← Back to shop</Link>
      </div>
    )
  }

  const { title, price, category, image } = product

  return (
    <div className="product-detail">
      <Link to="/" className="product-detail__back">← Back to shop</Link>
      <div className="product-detail__grid">
        <div className="product-detail__image-wrap">
          {image ? (
            <img src={image} alt={title} />
          ) : (
            <div className="product-detail__placeholder" />
          )}
        </div>
        <div className="product-detail__info">
          <span className="product-detail__category">{category}</span>
          <h1>{title}</h1>
          <p className="product-detail__price">${typeof price === 'number' ? price.toFixed(2) : price}</p>
          <button type="button" className="product-detail__btn">Add to Cart</button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
