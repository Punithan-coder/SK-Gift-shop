import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from './ProductCard'
import './ProductList.css'
import { SAMPLE_PRODUCTS } from '../data/products'

const ProductList = () => {
  const [searchParams] = useSearchParams()
  const q = (searchParams.get('q') ?? '').trim().toLowerCase()

  const { products, groupedByCategory } = useMemo(() => {
    const list = SAMPLE_PRODUCTS
    const filtered = q ? list.filter((p) => (p.title ?? '').toLowerCase().includes(q)) : list
    
    // Group products by category
    const grouped = filtered.reduce((acc, product) => {
      const cat = product.category || 'Other'
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(product)
      return acc
    }, {})
    
    return { 
      products: filtered, 
      groupedByCategory: grouped,
      categories: Object.keys(grouped).sort()
    }
  }, [q])

  if (!products.length) {
    return (
      <div className="product-list-empty">
        <p>{q ? `No products found for "${searchParams.get('q')}".` : 'No products available.'}</p>
      </div>
    )
  }

  // If searching, show flat list; otherwise show by category
  if (q) {
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

  return (
    <div className="products-by-category">
      {Object.entries(groupedByCategory).map(([category, categoryProducts]) => (
        <section key={category} className="product-category-section">
          <h3 className="product-category-title">{category}</h3>
          <ul className="product-list">
            {categoryProducts.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

export default ProductList
