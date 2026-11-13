import os
import sys
import time
import subprocess
from playwright.sync_api import sync_playwright

OUTPUT_DIR = '/home/tony/culturaft-frontend/redesign-artifacts/import-verification'
os.makedirs(OUTPUT_DIR, exist_ok=True)

PORT = 5199
PREVIEW_URL = f'http://localhost:{PORT}'

print(f'Starting vite preview server on port {PORT}...')
server_proc = subprocess.Popen(
    ['npm', 'run', 'preview', '--', '--port', str(PORT), '--strictPort'],
    cwd='/home/tony/culturaft-frontend',
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True,
)

# Wait for server to come up
time.sleep(2)

try:
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path='/usr/bin/google-chrome', headless=True)

        viewports = [
            ('desktop-1440', 1440, 900),
            ('desktop-1280', 1280, 800),
            ('tablet-1024', 1024, 768),
            ('tablet-768', 768, 1024),
            ('mobile-390', 390, 844),
            ('mobile-360', 360, 740),
        ]

        console_errors = []

        def handle_console(msg):
            if msg.type == 'error':
                console_errors.append(msg.text)

        # 1. TEST SHOP PAGE (Check 36 products rendered)
        print('\n--- 1. Testing Shop Page & Product Grid ---')
        page = browser.new_page(viewport={'width': 1440, 'height': 900})
        page.on('console', handle_console)
        page.goto(f'{PREVIEW_URL}/shop', wait_until='networkidle')
        page.wait_for_timeout(500)

        product_cards = page.locator('article')
        card_count = product_cards.count()
        print(f'Product cards rendered on /shop: {card_count} (Expected: 36)')
        assert card_count == 36, f'Expected 36 product cards, got {card_count}'

        page.screenshot(path=os.path.join(OUTPUT_DIR, 'shop-1440px.png'), full_page=True)
        print('Saved shop-1440px.png')

        # 2. TEST PRODUCT DETAILS: Black Outdoor Rope Armchair
        print('\n--- 2. Testing Product Detail: black-outdoor-rope-armchair ---')
        page.goto(f'{PREVIEW_URL}/product/black-outdoor-rope-armchair', wait_until='networkidle')
        page.wait_for_timeout(500)

        # Title check
        h1_text = page.locator('h1').text_content()
        print(f'H1 Title: {h1_text}')
        assert 'Black Outdoor Rope Armchair' in h1_text

        # Price check
        page_text = page.content()
        assert '₹18,000' in page_text, 'Price ₹18,000 not found in page'
        print('Verified Price: ₹18,000')

        # Key features check
        assert 'Modern black outdoor rope armchair design' in page_text
        print('Verified Key Features present')

        # Specifications check
        assert 'Outdoor Rope Armchair' in page_text
        assert 'Sunbrella Fabric Cushion' in page_text
        print('Verified Specifications present')

        # Global selling check
        assert 'Global Sourcing, Hospitality' in page_text
        assert 'infoculturaft@gmail.com' in page_text
        print('Verified Global Selling & Export section present')

        # Care instructions check
        assert 'Clean the aluminium frame' in page_text
        print('Verified Care Instructions present')

        # Lightbox interaction check
        view_larger_btn = page.locator('button:has-text("View larger")')
        if view_larger_btn.count() > 0:
            view_larger_btn.click()
            page.wait_for_timeout(300)
            dialog = page.locator('dialog.lb')
            assert dialog.is_visible(), 'Lightbox dialog did not open'
            print('Verified Lightbox opens cleanly')
            page.keyboard.press('Escape')
            page.wait_for_timeout(200)

        # Responsive captures of product detail
        for name, w, h in viewports:
            page.set_viewport_size({'width': w, 'height': h})
            page.wait_for_timeout(300)
            # check horizontal overflow
            overflow = page.evaluate("""() => [...document.querySelectorAll('*')]
                .filter(e => e.getBoundingClientRect().right > document.documentElement.clientWidth + 1)
                .slice(0, 5).map(e => e.tagName + '.' + e.className)""")
            if overflow:
                print(f'Warning: overflow at {name}: {overflow}')
            page.screenshot(
                path=os.path.join(OUTPUT_DIR, f'product-black-armchair-{name}.png'),
                full_page=True,
            )
            print(f'Captured product-black-armchair-{name}.png')

        # 3. TEST PRODUCT DETAILS: Handwoven Rope Bar Stool Set (with unit "1 Piece")
        print('\n--- 3. Testing Product Detail: handwoven-rope-bar-stool-set ---')
        page.set_viewport_size({'width': 1440, 'height': 900})
        page.goto(f'{PREVIEW_URL}/product/handwoven-rope-bar-stool-set', wait_until='networkidle')
        page.wait_for_timeout(500)
        p_text = page.content()
        assert '₹22,500' in p_text
        assert '1 Piece' in p_text
        page.screenshot(path=os.path.join(OUTPUT_DIR, 'product-bar-stool-set-1440px.png'), full_page=True)
        print('Verified ₹22,500 1 Piece displayed properly')

        # 4. TEST PRODUCT DETAILS: Culturaft Legacy Handwoven Wooden Bench (Price on Request)
        print('\n--- 4. Testing Product Detail: culturaft-legacy-handwoven-bench (0-byte source) ---')
        page.goto(f'{PREVIEW_URL}/product/culturaft-legacy-handwoven-bench', wait_until='networkidle')
        page.wait_for_timeout(500)
        p_text_legacy = page.content()
        assert 'Price on Request' in p_text_legacy
        page.screenshot(path=os.path.join(OUTPUT_DIR, 'product-legacy-bench-1440px.png'), full_page=True)
        print('Verified Price on Request for unpriced piece')

        # 5. TEST SEARCH & FILTER
        print('\n--- 5. Testing Interactive Search & Filters on /shop ---')
        page.goto(f'{PREVIEW_URL}/shop?q=Sunbrella', wait_until='networkidle')
        page.wait_for_timeout(500)
        search_cards = page.locator('article')
        print(f'Cards matching "Sunbrella": {search_cards.count()}')
        assert search_cards.count() >= 1

        page.goto(f'{PREVIEW_URL}/shop?usage=outdoor', wait_until='networkidle')
        page.wait_for_timeout(500)
        outdoor_cards = page.locator('article')
        print(f'Cards matching "outdoor": {outdoor_cards.count()}')
        assert outdoor_cards.count() >= 1

        # 6. TEST CATEGORY PAGES & SUBCOLLECTION NAVIGATION
        print('\n--- 6. Testing Category Navigation (/category/dining-chairs) ---')
        page.goto(f'{PREVIEW_URL}/category/dining-chairs', wait_until='networkidle')
        page.wait_for_timeout(500)
        dc_cards = page.locator('article')
        print(f'Dining Chairs count: {dc_cards.count()} (Expected: 11)')
        assert dc_cards.count() == 11
        page.screenshot(path=os.path.join(OUTPUT_DIR, 'category-dining-chairs-1440px.png'), full_page=True)

        # 7. HOMEPAGE VERIFICATION
        print('\n--- 7. Testing Homepage ---')
        page.goto(f'{PREVIEW_URL}/', wait_until='networkidle')
        page.wait_for_timeout(500)
        page.screenshot(path=os.path.join(OUTPUT_DIR, 'homepage-1440px.png'), full_page=True)
        for name, w, h in [('mobile-390', 390, 844)]:
            page.set_viewport_size({'width': w, 'height': h})
            page.wait_for_timeout(300)
            page.screenshot(path=os.path.join(OUTPUT_DIR, f'homepage-{name}.png'), full_page=True)

        browser.close()

        print('\n--- BROWSER VERIFICATION SUMMARY ---')
        print(f'Console Errors Recorded: {len(console_errors)}')
        if console_errors:
            print('Errors:', console_errors)
        else:
            print('No console errors detected! ALL BROWSER ASSERTIONS PASSED.')

finally:
    server_proc.terminate()
    server_proc.wait()
    print('Vite preview server terminated.')
