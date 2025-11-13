import { ProductCard } from '@/components/ProductCard';
import type { Product } from '@/lib/supabase';

/**
 * EDITABLE COMPONENT - HospitalPacksSection
 * 
 * Showcase section for hospital packs.
 * Customize styling and layout as needed.
 */

interface HospitalPacksSectionProps {
  products: Product[];
}

export const HospitalPacksSection = ({ products }: HospitalPacksSectionProps) => {
  if (products.length === 0) return null;

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready-to-Go Hospital Packs
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need, thoughtfully bundled for your hospital stay
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};