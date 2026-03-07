import { useEffect, useRef } from 'react'
import Header from '../Header/Header'
import ProductList from '../ProductList'
import Exploremenu from '../Exploremenu/Exploremenu'
import './Homepage.css'

const Homepage = () => {
  const superheroRef = useRef(null)

  useEffect(() => {
    if (!superheroRef.current) return

    const handleCollision = () => {
      superheroRef.current.classList.add('collision')
      setTimeout(() => {
        superheroRef.current?.classList.remove('collision')
      }, 600)
    }

    const interval = setInterval(handleCollision, 8000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="homepage">
      <div className="superhero-background" ref={superheroRef}>
        <div className="superhero-left">
          <div className="superhero-figure" title="Batman">
            🦇
            <div className="superhero-cape" />
          </div>
        </div>
        <div className="superhero-right">
          <div className="superhero-figure" title="Superman">
            ⚡
            <div className="superhero-cape" />
          </div>
        </div>
        <div className="collision-effect" />
      </div>
      <Header />
      <Exploremenu />
      <section id="products" className="products-section">
        <h2>Featured Gifts</h2>
        <p className="section-sub">Handpicked for special moments</p>
        <ProductList />
      </section>
    </div>
  )
}

export default Homepage
