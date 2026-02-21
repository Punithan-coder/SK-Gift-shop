import React from 'react'
import ProductCard from './ProductCard'

export default function ProductList() {
  const dummy = []
  return (
    <div>
      {dummy.length === 0 ? <p>No products (placeholder)</p> : dummy.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  )
}
