import productsData from '@/data/products.json'
import type { Product } from '@/types/product'

/**
 * Returns the verified Culturaft product catalogue.
 * All items originate from products.json and are verified against source files.
 */
export function useProducts(): Product[] {
  return productsData as unknown as Product[]
}
