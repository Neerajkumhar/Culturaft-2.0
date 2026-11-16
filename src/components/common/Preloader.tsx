import { Component, useCallback, useEffect, useRef, useState } from 'react'
import type { ErrorInfo, ReactNode, TransitionEvent } from 'react'
import { createPortal } from 'react-dom'
import { useLocation } from 'react-router-dom'
import { useCart } from '@/hooks/useCart'
import { useCatalogFilters } from '@/hooks/useCatalogFilters'
import {
  getCriticalImageUrls,
  useImagePreloader,
} from '@/hooks/useImagePreloader'
import { CulturaftAnimatedLogo } from './CulturaftAnimatedLogo'
import './Preloader.css'

const SAFETY_TIMEOUT_MS = 8000
const FADE_FALLBACK_MS = 400
const STATIC_FALLBACK_MS = 320

interface BoundaryProps {
  children: ReactNode
}

interface BoundaryState {
  hasError: boolean
}

class PreloaderErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { hasError: false }

  static getDerivedStateFromError(): BoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('CULTURAFT preloader failed; rendering the site without it.', error, errorInfo)
  }

  render() {
    return this.state.hasError ? null : this.props.children
  }
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function InitialPagePreloader() {
  const { pathname, search } = useLocation()
  const categorySlug = /^\/category\/([^/]+)\/?$/.exec(pathname)?.[1]
  const filters = useCatalogFilters(categorySlug)
  const { lines } = useCart()
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion)
  const [criticalImages] = useState(() =>
    getCriticalImageUrls({
      pathname,
      search,
      viewportWidth: window.innerWidth,
      devicePixelRatio: window.devicePixelRatio,
      cartProductIds: lines.map((line) => line.productId),
      filterProducts: filters.apply,
    }),
  )
  const imageState = useImagePreloader(criticalImages)
  const [animationComplete, setAnimationComplete] = useState(reducedMotion)
  const [animationFailed, setAnimationFailed] = useState(false)
  const [safetyTimeoutElapsed, setSafetyTimeoutElapsed] = useState(false)
  const [mounted, setMounted] = useState(true)
  const animationCompleteRef = useRef(reducedMotion)
  const imageStateRef = useRef(imageState)

  useEffect(() => {
    imageStateRef.current = imageState
  }, [imageState])

  const markAnimationComplete = useCallback(() => {
    if (animationCompleteRef.current) return
    animationCompleteRef.current = true
    setAnimationComplete(true)
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener('change', updatePreference)
    return () => mediaQuery.removeEventListener('change', updatePreference)
  }, [])

  useEffect(() => {
    if (!mounted || reducedMotion) return

    let staticFallbackTimeout: number | undefined
    const timeout = window.setTimeout(() => {
      const animationDidNotFinish = !animationCompleteRef.current
      if (animationDidNotFinish) {
        console.warn('CULTURAFT preloader animation reached its safety timeout.')
        setAnimationFailed(true)
      }
      if (!imageStateRef.current.isComplete) {
        console.warn('CULTURAFT preloader is continuing without every critical image.')
      }

      const dismiss = () => {
        setSafetyTimeoutElapsed(true)
        markAnimationComplete()
      }

      if (animationDidNotFinish) {
        staticFallbackTimeout = window.setTimeout(dismiss, STATIC_FALLBACK_MS)
      } else {
        dismiss()
      }
    }, SAFETY_TIMEOUT_MS)

    return () => {
      window.clearTimeout(timeout)
      if (staticFallbackTimeout !== undefined) {
        window.clearTimeout(staticFallbackTimeout)
      }
    }
  }, [markAnimationComplete, mounted, reducedMotion])

  const ready =
    reducedMotion ||
    safetyTimeoutElapsed ||
    (animationComplete && imageState.isComplete)

  useEffect(() => {
    if (!ready || !mounted || !reducedMotion) return
    const frame = window.requestAnimationFrame(() => setMounted(false))
    return () => window.cancelAnimationFrame(frame)
  }, [mounted, ready, reducedMotion])

  useEffect(() => {
    if (!mounted || ready) return

    const appRoot = document.getElementById('root')
    if (!appRoot) {
      console.error('CULTURAFT preloader could not find the application root.')
      return
    }

    const previousOverflow = document.body.style.overflow
    const previousInert = appRoot.inert
    const previousAriaHidden = appRoot.getAttribute('aria-hidden')

    document.body.style.overflow = 'hidden'
    appRoot.inert = true
    appRoot.setAttribute('aria-hidden', 'true')

    return () => {
      document.body.style.overflow = previousOverflow
      appRoot.inert = previousInert
      if (previousAriaHidden === null) {
        appRoot.removeAttribute('aria-hidden')
      } else {
        appRoot.setAttribute('aria-hidden', previousAriaHidden)
      }
    }
  }, [mounted, ready])

  useEffect(() => {
    if (!ready || !mounted || reducedMotion) return
    const timeout = window.setTimeout(() => setMounted(false), FADE_FALLBACK_MS)
    return () => window.clearTimeout(timeout)
  }, [mounted, ready, reducedMotion])

  const handleFadeEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (
      event.target === event.currentTarget &&
      event.propertyName === 'opacity' &&
      ready
    ) {
      setMounted(false)
    }
  }

  if (!mounted) return null

  return createPortal(
    <div
      className={`culturaft-preloader${ready ? ' is-leaving' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Loading CULTURAFT website"
      aria-busy={!ready}
      onTransitionEnd={handleFadeEnd}
    >
      <div className="culturaft-preloader__paper" aria-hidden="true" />
      <CulturaftAnimatedLogo
        reducedMotion={reducedMotion || animationFailed}
        onAnimationComplete={markAnimationComplete}
      />
    </div>,
    document.body,
  )
}

export default function Preloader() {
  return (
    <PreloaderErrorBoundary>
      <InitialPagePreloader />
    </PreloaderErrorBoundary>
  )
}
