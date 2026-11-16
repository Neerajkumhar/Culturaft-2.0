import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import CartToast from '@/components/cart/CartToast'

/**
 * Scrolls the window back to the top whenever the route changes,
 * so SPA navigation behaves like a fresh page load.
 */
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

/**
 * Shared application layout: skip link, sticky header, routed page
 * content (one <main> landmark for the whole document), footer.
 * Rendered once around the Router Outlet — pages must not include
 * their own Header/Footer/main landmarks.
 */
function MainLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-chalk">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <ScrollToTop />
      <Header />
      <CartToast />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
