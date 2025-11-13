import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * EDITABLE COMPONENT - CategorySection
 * 
 * Category cards for main product categories.
 * Customize styling, layout, and categories as needed.
 */

interface CategoryCardProps {
  title: string;
  description: string;
  image: string;
  onClick: () => void;
}

const CategoryCard = ({ title, description, image, onClick }: CategoryCardProps) => {
  return (
    <div 
      className="group relative overflow-hidden rounded-2xl bg-card border border-border shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {description}
        </p>
        <Button 
          variant="ghost" 
          className="text-primary hover:text-primary p-0 h-auto font-semibold group-hover:translate-x-1 transition-transform"
        >
          Shop Now
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

interface CategorySectionProps {
  categories: Array<{
    id: string;
    name: string;
    description: string;
    image: string;
  }>;
  onCategoryClick: (categoryId: string) => void;
}

export const CategorySection = ({ categories, onCategoryClick }: CategorySectionProps) => {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find exactly what you need for your journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              title={category.name}
              description={category.description}
              image={category.image}
              onClick={() => onCategoryClick(category.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};