import { Check } from 'lucide-react';

/**
 * EDITABLE COMPONENT - NewbornChecklist
 * 
 * Visual checklist section showcasing key newborn essentials.
 * Feel free to customize items, styling, and layout.
 */

const checklistItems = [
  { title: 'Diapers & Wipes', description: 'Stock up on gentle, hypoallergenic options' },
  { title: 'Nursing Essentials', description: 'Bras, pads, and comfort items for mom' },
  { title: 'Hospital Bag', description: 'Packed and ready with all necessities' },
  { title: 'Baby Clothing', description: 'Soft onesies, swaddles, and sleepers' },
  { title: 'Recovery Kit', description: 'Postpartum care items for healing' },
  { title: 'Feeding Supplies', description: 'Bottles, pump, and storage solutions' },
];

export const NewbornChecklist = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-[hsl(var(--hero-gradient-start))] to-[hsl(var(--hero-gradient-end))]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Your Newborn Checklist
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to welcome your little one with confidence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {checklistItems.map((item, index) => (
            <div 
              key={index}
              className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-5 w-5 text-primary-foreground" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};