"use client";

import { Link } from "@/i18n/routing";
import { generateSlug } from '@/lib/slugs';
import { ArrowRight, ArrowLeft } from 'lucide-react';

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

  const backText = locale === 'he' ? 'חזור' : 'Back';

  return (
    <div className="w-full overflow-x-hidden">
      <style>{`
        ::-webkit-scrollbar { display: none; }
        * { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      {/* Editorial Header */}
      <div className="w-full pt-32 pb-12 px-8 md:px-16 flex flex-col items-center text-center relative">
        <div className="w-full max-w-[1800px] mx-auto flex">
          <Link 
            href="/catalog" 
            className={`flex items-center gap-2 hover:text-foreground text-muted-foreground w-fit uppercase text-xs tracking-widest font-semibold transition-colors mb-12 ${locale === 'he' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            {locale === 'he' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {backText}
          </Link>
        </div>

        <h1 className="text-3xl md:text-5xl uppercase tracking-[0.3em] font-light text-foreground mb-10 mt-10">
          {categoryName}
        </h1>
        <div className="w-8 h-[1px] bg-foreground/20 mb-16" />
      </div>

      {/* Gallery */}
      <div className="w-full px-8 md:px-16 pb-40">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 md:gap-x-24 gap-y-32 max-w-[1800px] mx-auto ${locale === 'he' ? 'rtl' : 'ltr'}`}>
          {collections.length === 0 ? (
            <div className="col-span-full py-32 text-center text-muted-foreground font-light tracking-widest uppercase text-sm">
              {locale === 'he' ? 'לא נמצאו קולקציות.' : 'No collections found.'}
            </div>
          ) : (
            collections.map((col) => {
              const imgUrl = getImageUrl(col);
              const colSlug = generateSlug(col.name);
              const name = locale === 'he' && col.nameHe ? col.nameHe : col.name;

              return (
                <Link 
                  key={col.id} 
                  href={`/catalog/${parentSlug}/${colSlug}`} 
                  prefetch={false}
                  className="group flex flex-col items-center active:scale-[0.97] active:opacity-80 transition-all duration-500 ease-out"
                >
                  <div className="w-full aspect-[4/5] relative flex items-center justify-center mb-10 overflow-hidden bg-neutral-100/5 dark:bg-neutral-900/50 rounded-sm">
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={name}
                        className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[0.22,1,0.36,1] group-hover:scale-[1.04]"
                      />
                    ) : (
                      <span className="text-[9px] uppercase tracking-widest text-muted-foreground/30">Archive</span>
                    )}
                  </div>
                  <h2 className="text-sm md:text-base font-light uppercase tracking-[0.2em] text-foreground/80 group-hover:text-foreground transition-colors duration-700 text-center" dir="auto">
                    {name}
                  </h2>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
