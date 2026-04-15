import { useMemo, useCallback } from 'react'
import { flushSync } from 'react-dom'
import { useSearchParams, useNavigate } from 'react-router-dom'
import ProductCard from './ProductCard'
import './ProductList.css'
import { SAMPLE_PRODUCTS } from '../data/products'

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const q = (searchParams.get('q') ?? '').trim().toLowerCase()
  const cat = (searchParams.get('cat') ?? '').trim().toLowerCase()

  const products = useMemo(() => {
    const list = SAMPLE_PRODUCTS
    if (q) {
      return list.filter((p) =>
        (p.title ?? '').toLowerCase().includes(q) ||
        (p.category ?? '').toLowerCase().includes(q)
      )
    }
    if (cat) {
      return list.filter((p) => (p.category ?? '').toLowerCase() === cat)
    }
    return list
  }, [q, cat])

  /** Clears ?cat= / ?q= first (flushSync so URL updates before navigate, otherwise search can stay merged). */
  const openFullCatalog = useCallback(() => {
    flushSync(() => {
      setSearchParams(new URLSearchParams(), { replace: false })
    })
    navigate({ pathname: '/', search: '', hash: '#products' }, { replace: false })
  }, [setSearchParams, navigate])

  if (!products.length) {
    return (
      <div className="product-list-empty">
        <p>
          {q
            ? `No products found for "${searchParams.get('q')}".`
            : cat
              ? `No products found in "${searchParams.get('cat')}".`
              : 'No products available.'}
        </p>
      </div>
    )
  }

  return (
    <ul className="product-list">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} onOpenFullCatalog={openFullCatalog} />
        </li>
      ))}
    </ul>
  )
}

export default ProductList
