import React from 'react'

export default function ProductCard({ product }) {
  return (
    <div>
      <h3>{product?.title || 'Product Title'}</h3>
      <p>Price: {product?.price || '0.00'}</p>
    </div>
  )
}
