import { MAIN_CATEGORIES } from '@/data/categoryNavigation'

/**
 * Catalogue category navigation — two editorial rows that sit above the
 * filter toolbar.
 *
 * The first row lists every main category plus "All Categories" as hairline
 * text tabs sharing a single rule, with a gold underline marking the active
 * tab. The second row appears only when a category with subcategories is
 * active, and narrows within it as compact text links.
 *
 * The set of categories and subcategories, their counts and the selection
 * behaviour are unchanged from the previous markup — only the visual
 * treatment is new. Selection is state-driven (not routed) exactly as
 * before, so nothing about category navigation changes.
 */
export interface CategoryNavProps {
  activeSlug: string | null
  onSelectCategory: (slug: string | null) => void
  activeSubcategoryId: string | null
  onSelectSubcategory: (id: string | null) => void
  /** Total number of products, shown on the "All Categories" tab. */
  totalCount: number
}

export function CategoryNav({
  activeSlug,
  onSelectCategory,
  activeSubcategoryId,
  onSelectSubcategory,
  totalCount,
}: CategoryNavProps) {
  const activeCategory = activeSlug
    ? MAIN_CATEGORIES.find((category) => category.slug === activeSlug) ?? null
    : null
  const subcategories = activeCategory?.subcategories ?? []

  return (
    <div className="category-nav">
      <div className="category-nav__scroll" role="group" aria-label="Filter by category">
        <button
          type="button"
          onClick={() => onSelectCategory(null)}
          aria-pressed={activeSlug === null}
          className="cat-tab"
        >
          All Categories
          <span className="cat-tab__count">{totalCount}</span>
        </button>

        {MAIN_CATEGORIES.map((category) => {
          const isActive = activeSlug === category.slug
          return (
            <button
              key={category.slug}
              type="button"
              onClick={() => onSelectCategory(category.slug)}
              aria-pressed={isActive}
              className="cat-tab"
            >
              {category.name}
              <span className="cat-tab__count">{category.productCount}</span>
            </button>
          )
        })}
      </div>

      {activeCategory && subcategories.length > 0 && (
        <div
          className="category-nav__scroll category-nav__scroll--sub"
          role="group"
          aria-label="Filter by subcategory"
        >
          <button
            type="button"
            onClick={() => onSelectSubcategory(null)}
            aria-pressed={activeSubcategoryId === null}
            className="subcat-tab"
          >
            All {activeCategory.name}
          </button>

          {subcategories.map((subcategory) => {
            const isActive = activeSubcategoryId === subcategory.id
            return (
              <button
                key={subcategory.id}
                type="button"
                onClick={() => onSelectSubcategory(subcategory.id)}
                aria-pressed={isActive}
                className="subcat-tab"
              >
                {subcategory.name}
                <span className="subcat-tab__count">{subcategory.productCount}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
