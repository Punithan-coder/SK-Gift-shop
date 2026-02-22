import Header from '../Header/Header'
import ProductList from '../ProductList'
import Exploremenu from '../Exploremenu/Exploremenu'
import './Homepage.css'

const Homepage = () => (
  <div className="homepage">
    <Header />
    <Exploremenu />
    <section id="products" className="products-section">
      <h2>Featured Gifts</h2>
      <p className="section-sub">Handpicked for special moments</p>
      <ProductList />
    </section>
  </div>
)

export default Homepage
