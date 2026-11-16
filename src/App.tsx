import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import HomePage from './pages/Home/HomePage'
import ShopPage from './pages/Shop/ShopPage'
import CategoryPage from './pages/Category/CategoryPage'
import ProductDetailsPage from './pages/ProductDetails/ProductDetailsPage'
import CartPage from './pages/Cart/CartPage'
import AboutPage from './pages/About'
import ContactPage from './pages/Contact'
import NotFoundPage from './pages/NotFound'
import Preloader from './components/common/Preloader'

/**
 * Application shell — one page renders at a time.
 * Shared Header/Footer live in MainLayout, not in individual pages.
 */
export default function App() {
  return (
    <BrowserRouter>
      <Preloader />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/product/:slug" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
