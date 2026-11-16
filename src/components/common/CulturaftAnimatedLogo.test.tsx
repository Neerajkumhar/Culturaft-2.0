import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { CulturaftAnimatedLogo } from './CulturaftAnimatedLogo'

describe('CulturaftAnimatedLogo', () => {
  it('starts in the original play state with the original SVG viewBox and masks', () => {
    const markup = renderToStaticMarkup(
      <CulturaftAnimatedLogo
        reducedMotion={false}
        onAnimationComplete={() => undefined}
      />,
    )

    expect(markup).toContain('class="culturaft-animation play"')
    expect(markup).toContain('viewBox="0 0 336 246"')
    expect(markup).toContain('id="rv"')
    expect(markup).toContain('id="wm"')
    expect(markup).toContain('class="dome"')
    expect(markup).toContain('class="pot"')
    expect(markup).toContain('class="wd"')
  })

  it('renders the same artwork as a static mark for reduced motion', () => {
    const markup = renderToStaticMarkup(
      <CulturaftAnimatedLogo
        reducedMotion
        onAnimationComplete={() => undefined}
      />,
    )

    expect(markup).toContain('class="culturaft-animation is-static"')
    expect(markup).toContain('viewBox="0 0 336 246"')
    expect(markup).toContain('id="rv"')
    expect(markup).toContain('id="wm"')
    expect(markup).not.toContain('AudioContext')
  })
})
