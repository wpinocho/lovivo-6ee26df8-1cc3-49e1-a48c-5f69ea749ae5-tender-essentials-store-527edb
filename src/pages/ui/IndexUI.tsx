import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { FloatingCart } from '@/components/FloatingCart';
import { NewsletterSection } from '@/components/NewsletterSection';
import { EcommerceTemplate } from '@/templates/EcommerceTemplate';
import { NewbornChecklist } from '@/components/NewbornChecklist';
import { CategorySection } from '@/components/CategorySection';
import { HospitalPacksSection } from '@/components/HospitalPacksSection';
import type { UseIndexLogicReturn } from '@/components/headless/HeadlessIndex';
import heroImage from '@/assets/hero-hospital-basket.jpg';

/**
 * EDITABLE UI - IndexUI
 * 
 * Baby & Postpartum Essentials Store Homepage
 * Fully customizable UI with tender, caring design.
 */

interface IndexUIProps {
  logic: UseIndexLogicReturn;
}

export const IndexUI = ({ logic }: IndexUIProps) => {
  const {
    collections,
    loading,
    loadingCollections,
    selectedCollectionId,
    filteredProducts,
    handleViewCollectionProducts,
    handleShowAllProducts,
  } = logic;

  // Get featured products and hospital packs
  const featuredProducts = filteredProducts.filter(p => p.featured);
  const hospitalPacks = filteredProducts.filter(p => 
    p.tags?.some((tag: string) => tag.toLowerCase().includes('hospital'))
  );

  // Main categories for CategorySection
  const mainCategories = collections
    .filter(c => ['nursing-essentials', 'diaper-essentials', 'mom-care'].includes(c.handle || ''))
    .map(c => ({
      id: c.id,
      name: c.name,
      description: c.description || '',
      image: c.image || ''
    }));

  return (
    <EcommerceTemplate showCart={true}>
      {/* Hero Section with Hospital Basket */}
      <section className="relative bg-gradient-to-br from-[hsl(var(--hero-gradient-start))] to-[hsl(var(--hero-gradient-end))] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Everything for Your
                <span className="text-primary block mt-2">Hospital Stay</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl">
                Thoughtfully curated essentials for mom and baby. From nursing care to postpartum recovery, we've got you covered.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="text-lg h-14 px-8 shadow-lg hover:shadow-xl transition-shadow"
                  onClick={() => {
                    const section = document.getElementById('essentials');
                    section?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  See Essentials
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg h-14 px-8"
                  onClick={() => {
                    const hospitalCollection = collections.find(c => c.handle === 'hospital-packs');
                    if (hospitalCollection) handleViewCollectionProducts(hospitalCollection.id);
                  }}
                >
                  View Hospital Packs
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src={heroImage} 
                  alt="Beautiful hospital basket with baby essentials"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground px-8 py-4 rounded-2xl shadow-xl">
                <p className="text-sm font-medium">Complete Basket</p>
                <p className="text-2xl font-bold">$149.99</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newborn Checklist */}
      <NewbornChecklist />

      {/* Category Section - Nursing, Diapers, Mom Care */}
      {!loadingCollections && mainCategories.length > 0 && (
        <CategorySection 
          categories={mainCategories}
          onCategoryClick={handleViewCollectionProducts}
        />
      )}

      {/* Hospital Packs Section */}
      {!loading && hospitalPacks.length > 0 && (
        <HospitalPacksSection products={hospitalPacks} />
      )}

      {/* Featured Products Section */}
      <section id="essentials" className="py-16 bg-background scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {selectedCollectionId 
                  ? collections.find(c => c.id === selectedCollectionId)?.name || 'Products'
                  : 'Essential Products'
                }
              </h2>
              <p className="text-lg text-muted-foreground">
                {selectedCollectionId 
                  ? 'Curated items for this category'
                  : 'Handpicked for new parents'
                }
              </p>
            </div>
            {selectedCollectionId && (
              <Button 
                variant="outline" 
                onClick={handleShowAllProducts}
              >
                See All Products
              </Button>
            )}
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-muted rounded-lg h-80 animate-pulse"></div>
              ))}
            </div>
          ) : (selectedCollectionId ? filteredProducts : featuredProducts).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {(selectedCollectionId ? filteredProducts : featuredProducts).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No products available.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterSection />

      <FloatingCart />
    </EcommerceTemplate>
  );
};