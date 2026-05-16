"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { generateSlug } from '@/lib/slugs';

interface Category {
  id: number;
  name: string;
  nameHe: string | null;
  image: string | null;
  products: any[];
}

interface CollectionGalleryProps {
  collections: Category[];
  locale: string;
  categoryName: string;
  parentSlug: string;
}

export default function CollectionGallery({ collections, locale, categoryName, parentSlug }: CollectionGalleryProps) {
  const getImageUrl = (col: Category) => {
    if (col.image) return col.image;
    if (col.products && col.products.length > 0 && col.products[0].images && col.products[0].images.length > 0) {
      return col.products[0].images[0];
    }
    return null; // fallback
  };

  const getSubTitle = (col: Category) => {
    return locale === 'he' ? 'קולקציה אדריכלית' : 'Architectural Collection';
  };

  const viewText = locale === 'he' ? 'צפה בקולקציה' : 'View Collection';

  // Render gallery
  return (
    <div className="w-full bg-[#FAFAFA] dark:bg-[#0A0A0A] text-foreground pb-32 overflow-x-hidden">
      <style>{`
        ::-webkit-scrollbar { display: none; }
        * { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      {/* Editorial Header */}
      <div className="w-full pt-40 pb-24 px-8 md:px-16 flex flex-col items-center text-center">
        <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-muted-foreground mb-6">
          {locale === 'he' ? 'משפחות מוצרים' : 'Product Families'}
        </span>
        <h1 className="text-3xl md:text-5xl uppercase tracking-[0.3em] font-light text-foreground mb-10">
          {categoryName}
        </h1>
        <div className="w-8 h-[1px] bg-foreground/20" />
      </div>

      {/* Gallery */}
      <div className={`w-full grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-2 ${locale === 'he' ? 'rtl' : 'ltr'}`}>
        {collections.map((col) => (
          <GridBlock key={col.id} col={col} locale={locale} viewText={viewText} getImageUrl={getImageUrl} getSubTitle={getSubTitle} parentSlug={parentSlug} />
        ))}
      </div>
    </div>
  );
}

// Sub-components for layouts

function GridBlock({ col, locale, viewText, getImageUrl, getSubTitle, parentSlug }: any) {
  const imageUrl = getImageUrl(col);
  const name = locale === 'he' && col.nameHe ? col.nameHe : col.name;
  const colSlug = generateSlug(col.name);

  return (
    <Link href={`/catalog/${parentSlug}/${colSlug}`} prefetch={false} className="group relative block w-full h-[50vh] md:h-[70vh] overflow-hidden active:scale-[0.98] active:opacity-90 transition-all duration-700 ease-[0.22,1,0.36,1]">
      <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-900 z-0">
        {imageUrl && (
          <motion.img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[0.22,1,0.36,1] group-hover:scale-[1.04]"
          />
        )}
      </div>
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-700 z-10" />
      
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-8">
        <h2 className="text-2xl md:text-4xl lg:text-5xl text-white mb-3 uppercase tracking-[0.2em] leading-none text-center font-normal">
          {name}
        </h2>
        <p className="text-white/80 text-[10px] md:text-xs uppercase tracking-[0.2em] font-light mb-8 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700">
          {getSubTitle(col)}
        </p>
        
        {/* Fog/Glass Label */}
        <div className="opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 delay-100 backdrop-blur-md bg-white/10 border border-white/20 rounded-full px-6 py-2">
          <span className="text-white text-[10px] uppercase tracking-widest font-light">
            {viewText}
          </span>
        </div>
      </div>
    </Link>
  );
}
