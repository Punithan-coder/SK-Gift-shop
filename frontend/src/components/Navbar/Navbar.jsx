import './Navbar.css'
import cart from '../../assets/cart.png' 
import { Link } from 'react-router-dom';            

function Navbar() {
  return (
    <div className="nav-head">
      
    <h1>SK Gift Shop  </h1>
      <div className="nav-center">
        <div className='text-direction'>
          <h3><Link to="/">Home</Link></h3>
          <h3>Products</h3>
          <h3><Link to={"/Contact"}>Contact us</Link> </h3>
        </div>
        <div className='search-bar'>
          <input type="text" placeholder="Search products..." />
          <button>Search</button>
        </div>
      </div>

      {/* Actions: cart + sign in */}
      <div className="nav-actions">
        <div className='cart'>
          <Link to="/cart"><img src={cart} alt="Cart" /></Link>
        </div>
        <button className='signin'>Sign In</button>
      </div>

    </div>
  )
}

export default Navbar
