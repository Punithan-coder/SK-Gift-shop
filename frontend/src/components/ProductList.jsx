import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from './ProductCard'
import './ProductList.css'
import { SAMPLE_PRODUCTS } from '../data/products'

const ProductList = () => {
  const [searchParams] = useSearchParams()
  const q = (searchParams.get('q') ?? '').trim().toLowerCase()

  const products = useMemo(() => {
    const list = SAMPLE_PRODUCTS
    if (!q) return list
    return list.filter((p) => (p.title ?? '').toLowerCase().includes(q))
  }, [q])

  if (!products.length) {
    return (
      <div className="product-list-empty">
        <p>{q ? `No products found for "${searchParams.get('q')}".` : 'No products available.'}</p>
      </div>
    )
  }

  return (
    <ul className="product-list">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  )
}

export default ProductList
