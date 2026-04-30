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

  // Group collections into rows to support mixed layouts
  // e.g., Full width, then 2 grid, then Split Left, then Split Right
  const rows: any[] = [];
  let i = 0;
  while (i < collections.length) {
    const layoutType = rows.length % 4; // Cycle through 4 layouts: 0: Full, 1: Grid(2), 2: Split Left, 3: Split Right
    
    if (layoutType === 1 && i + 1 < collections.length) {
      // 2 grid
      rows.push({ type: 'grid2', items: [collections[i], collections[i + 1]] });
      i += 2;
    } else {
      // Full, Split Left, or Split Right
      const typeStr = layoutType === 0 ? 'full' : (layoutType === 2 ? 'split-left' : 'split-right');
      rows.push({ type: typeStr, items: [collections[i]] });
      i += 1;
    }
  }

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
        <h1 className="text-5xl md:text-7xl font-normal uppercase tracking-widest text-foreground mb-10 leading-tight">
          {categoryName}
        </h1>
        <div className="w-8 h-[1px] bg-foreground/20" />
      </div>

      {/* Gallery */}
      <div className="w-full flex flex-col gap-y-1 md:gap-y-2">
        {rows.map((row, rIndex) => (
          <div key={rIndex} className="w-full">
            {row.type === 'full' && (
              <FullWidthBlock col={row.items[0]} locale={locale} viewText={viewText} getImageUrl={getImageUrl} getSubTitle={getSubTitle} parentSlug={parentSlug} />
            )}
            {row.type === 'grid2' && (
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4 ${locale === 'he' ? 'rtl' : 'ltr'}`}>
                <GridBlock col={row.items[0]} locale={locale} viewText={viewText} getImageUrl={getImageUrl} getSubTitle={getSubTitle} parentSlug={parentSlug} />
                <GridBlock col={row.items[1]} locale={locale} viewText={viewText} getImageUrl={getImageUrl} getSubTitle={getSubTitle} parentSlug={parentSlug} />
              </div>
            )}
            {row.type === 'split-left' && (
              <SplitBlock col={row.items[0]} locale={locale} viewText={viewText} getImageUrl={getImageUrl} getSubTitle={getSubTitle} imageLeft={true} parentSlug={parentSlug} />
            )}
            {row.type === 'split-right' && (
              <SplitBlock col={row.items[0]} locale={locale} viewText={viewText} getImageUrl={getImageUrl} getSubTitle={getSubTitle} imageLeft={false} parentSlug={parentSlug} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Sub-components for layouts

function FullWidthBlock({ col, locale, viewText, getImageUrl, getSubTitle, parentSlug }: any) {
  const imageUrl = getImageUrl(col);
  const name = locale === 'he' && col.nameHe ? col.nameHe : col.name;
  const colSlug = generateSlug(col.name);

  return (
    <Link href={`/catalog/${parentSlug}/${colSlug}`} prefetch={false} className="group relative block w-full h-[60vh] md:h-[80vh] overflow-hidden active:scale-[0.98] active:opacity-90 transition-all duration-700 ease-[0.22,1,0.36,1]">
      <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-900 z-0">
        {imageUrl && (
          <motion.img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[0.22,1,0.36,1] group-hover:scale-[1.03]"
          />
        )}
      </div>
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-700 z-10" />
      
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-24 text-center">
        <h2 className="text-4xl md:text-6xl lg:text-[7vw] text-white mb-4 uppercase tracking-[0.2em] leading-none text-center font-normal">
          {name}
        </h2>
        <p className="text-white/80 text-xs md:text-sm uppercase tracking-[0.3em] font-light mb-8">
          {getSubTitle(col)}
        </p>
        
        {/* Fog/Glass Button */}
        <div className="overflow-hidden rounded-full backdrop-blur-md bg-white/10 border border-white/20 px-8 py-3 transition-all duration-500 group-hover:bg-white/20 group-hover:border-white/40">
          <span className="text-white text-xs uppercase tracking-widest font-light">
            {viewText}
          </span>
        </div>
      </div>
    </Link>
  );
}

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
        <h2 className="text-3xl md:text-5xl lg:text-[4vw] text-white mb-3 uppercase tracking-[0.2em] leading-none text-center font-normal">
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

function SplitBlock({ col, locale, viewText, getImageUrl, getSubTitle, imageLeft, parentSlug }: any) {
  const imageUrl = getImageUrl(col);
  const name = locale === 'he' && col.nameHe ? col.nameHe : col.name;
  const colSlug = generateSlug(col.name);

  return (
    <Link href={`/catalog/${parentSlug}/${colSlug}`} prefetch={false} className="group flex flex-col md:flex-row w-full h-auto md:h-[60vh] bg-neutral-100 dark:bg-neutral-900/50 overflow-hidden active:scale-[0.98] active:opacity-90 transition-all duration-700 ease-[0.22,1,0.36,1]">
      
      {/* Image Side */}
      <div className={`w-full md:w-1/2 h-[40vh] md:h-full relative overflow-hidden ${!imageLeft && 'md:order-2'}`}>
        {imageUrl ? (
          <motion.img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[0.22,1,0.36,1] group-hover:scale-[1.05]"
          />
        ) : (
          <div className="w-full h-full bg-neutral-200 dark:bg-neutral-800" />
        )}
      </div>

      {/* Text Side */}
      <div className={`w-full md:w-1/2 h-full flex flex-col items-center justify-center p-12 md:p-24 text-center ${!imageLeft && 'md:order-1'}`}>
        <p className="text-muted-foreground/60 text-[10px] md:text-xs uppercase tracking-[0.3em] font-light mb-6">
          {getSubTitle(col)}
        </p>
        <h2 className="text-3xl md:text-5xl lg:text-[4vw] text-foreground mb-12 uppercase tracking-[0.2em] leading-none text-center font-normal group-hover:text-black dark:group-hover:text-white transition-colors duration-500">
          {name}
        </h2>
        
        {/* Minimal Button for split layout */}
        <div className="relative overflow-hidden border border-foreground/20 rounded-full px-8 py-3 transition-colors duration-500 group-hover:bg-foreground group-hover:text-background">
          <span className="text-xs uppercase tracking-widest font-light transition-colors duration-500">
            {viewText}
          </span>
        </div>
      </div>
    </Link>
  );
}
