import { prisma } from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Assistant } from 'next/font/google';
import { translateCategory } from '@/lib/dictionaries';
import CinematicCategory from '@/components/CinematicCategory';
import CustomCursor from '@/components/CustomCursor';

const assistantFont = Assistant({ subsets: ['hebrew', 'latin'] });

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const title = locale === 'he' ? 'קולקציה' : 'Collection';
  return {
    title,
    description: 'Explore the Ann Light architectural lighting collection.',
  };
}

export default async function CatalogPage(props: { 
  params: Promise<{ locale: string }>,
  searchParams: Promise<{ category?: string }>
}) {
  const { locale } = await props.params;
  const searchParams = await props.searchParams;
  const categoryId = searchParams.category ? parseInt(searchParams.category) : undefined;
  
  const tNav = await getTranslations('Navigation');

  // LAYER 1: CINEMATIC LANDING (If no specific category is selected)
  if (!categoryId) {
    const categories = await prisma.category.findMany({
      where: { enabled: true, parentId: null },
      include: {
        products: {
          take: 1,
          orderBy: { id: 'desc' }
        }
      },
      orderBy: { order: 'asc' }
    });

    return (
      <main className={`relative w-full h-screen snap-y snap-mandatory overflow-y-scroll ${locale === 'he' ? assistantFont.className : ''}`}>
        <CustomCursor />
        {categories.map(cat => {
          // Find the first product image to use as the background
          const products = cat.products || [];
          let imgUrl = null;
          if (products.length > 0 && products[0].images) {
             const imgs = products[0].images as string[];
             if (imgs.length > 0) imgUrl = imgs[0];
          }
          
          return (
            <CinematicCategory 
              key={cat.id} 
              id={cat.id}
              name={translateCategory(cat.name, locale)} 
              image={imgUrl}
              locale={locale}
            />
          );
        })}
      </main>
    );
  }

  // LAYER 2: CLEAN MINIMAL GRID (Inside Category)
  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  
  const products = await prisma.product.findMany({
    where: { 
      categories: { some: { id: categoryId, enabled: true } },
    },
    include: { categories: true },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }]
  });

  const moods = locale === 'he' 
    ? ['מינימליסטי', 'חמים', 'טכני', 'דקורטיבי']
    : ['Minimal', 'Warm', 'Technical', 'Decorative'];

  const projects = locale === 'he'
    ? ['סלון', 'מטבח', 'משרד', 'וילה']
    : ['Living Room', 'Kitchen', 'Office', 'Villa'];

  return (
    <main className={`w-full min-h-screen bg-background ${locale === 'he' ? assistantFont.className : ''}`}>
      <CustomCursor />
      
      {/* Editorial Header */}
      <div className="w-full pt-40 pb-20 px-8 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl uppercase tracking-[0.25em] font-light text-foreground mb-6">
          {category ? translateCategory(category.name, locale) : tNav('catalog')}
        </h1>
        <div className="w-16 h-[1px] bg-foreground/20 mb-16" />

        {/* Emotion/Mood Filters */}
        <div className={`w-full max-w-5xl flex flex-col md:flex-row justify-between gap-12 text-sm uppercase tracking-[0.15em] font-light text-muted-foreground ${locale === 'he' ? 'md:flex-row-reverse' : ''}`}>
          
          <div className="flex flex-col gap-4">
            <span className="text-[10px] tracking-[0.3em] opacity-40 mb-2">{locale === 'he' ? 'סינון לפי אווירה' : 'Mood-based'}</span>
            <div className={`flex flex-wrap gap-8 ${locale === 'he' ? 'justify-end md:justify-start' : 'justify-start'}`}>
              {moods.map((m, i) => (
                <button key={i} className="hover:text-foreground transition-colors hover:glow">{m}</button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-[10px] tracking-[0.3em] opacity-40 mb-2">{locale === 'he' ? 'קנה לפי חלל' : 'Shop by Project'}</span>
            <div className={`flex flex-wrap gap-8 ${locale === 'he' ? 'justify-end' : 'justify-start'}`}>
              {projects.map((p, i) => (
                <button key={i} className="hover:text-foreground transition-colors hover:glow">{p}</button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Luxury Grid */}
      <div className="w-full px-4 md:px-12 pb-32">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 md:gap-x-16 gap-y-24 max-w-[1600px] mx-auto ${locale === 'he' ? 'rtl' : 'ltr'}`}>
          {products.length === 0 ? (
            <div className="col-span-full py-32 text-center text-muted-foreground font-light tracking-widest uppercase">
              {locale === 'he' ? 'לא נמצאו מוצרים בקולקציה זו.' : 'No pieces found in this collection.'}
            </div>
          ) : (
            products.map((product) => (
              <Link 
                key={product.id} 
                href={`/catalog/product/${product.id}`} 
                prefetch={false}
                className="group flex flex-col gap-6 cursor-none"
              >
                <div className="aspect-[3/4] bg-neutral-100/5 dark:bg-neutral-900 relative overflow-hidden flex items-center justify-center transition-all duration-[1s] group-hover:bg-neutral-200/10 group-hover:shadow-2xl">
                  {(product.images as string[])?.[0] ? (
                    <img
                      src={(product.images as string[])[0]}
                      alt={locale === 'he' && product.titleHe ? product.titleHe : product.title}
                      className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    />
                  ) : (
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground opacity-30">Archive</span>
                  )}
                  {/* Subtle hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-1000" />
                </div>
                
                <div className={`flex flex-col gap-2 ${locale === 'he' ? 'text-right' : 'text-left'}`}>
                  <h2 className="text-base font-light uppercase tracking-[0.15em] text-foreground/90 group-hover:text-foreground transition-colors" dir="auto">
                    {locale === 'he' && product.titleHe ? product.titleHe : product.title}
                  </h2>
                  <p className="text-[11px] text-muted-foreground/60 uppercase tracking-widest">
                    {product.categories && product.categories.length > 0 ? translateCategory(product.categories[0].name, locale) : ''}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
      
      {/* Bottom return link */}
      <div className="w-full flex justify-center pb-20">
        <Link href="/catalog" prefetch={false} className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors border-b border-transparent hover:border-foreground pb-1">
          {locale === 'he' ? 'חזור לקולקציות' : 'Return to Collections'}
        </Link>
      </div>
    </main>
  );
}
