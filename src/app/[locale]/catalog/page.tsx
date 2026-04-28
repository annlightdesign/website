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
  const t = await getTranslations('Catalog');

  const setting = await prisma.siteSetting.findUnique({ where: { key: 'construction_catalog' } });
  const isComingSoon = setting?.value === 'true';
  
  if (isComingSoon) {
    return (
      <main className={`container mx-auto px-6 py-32 min-h-[70vh] flex flex-col items-center justify-center text-center ${locale === 'he' ? assistantFont.className : ''}`}>
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-4xl md:text-5xl uppercase font-light tracking-[0.2em] text-foreground">
            {t('title')}
          </h1>
          <div className="w-16 h-[1px] bg-foreground/20 mx-auto"></div>
          <p className="text-muted-foreground text-lg md:text-xl font-light leading-relaxed">
            {t('description')}
          </p>
        </div>
      </main>
    );
  }

  // === RESERVED CINEMATIC CATALOG LOGIC ===
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
      <main className={`w-full h-[100svh] overflow-y-scroll overflow-x-hidden snap-y snap-mandatory no-scrollbar scroll-smooth ${locale === 'he' ? assistantFont.className : ''}`}>
        <CustomCursor />
        {categories.map(cat => {
          // Find the dedicated category image or fallback to the first product image
          let imgUrl = cat.image || null;
          const products = cat.products || [];
          if (!imgUrl && products.length > 0 && products[0].images) {
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
    <main className={`w-full min-h-screen bg-[#faf9f8] text-[#2a2a2a] ${locale === 'he' ? assistantFont.className : ''}`}>
      <CustomCursor />
      
      {/* Editorial Header */}
      <div className="w-full pt-48 pb-24 px-8 md:px-16 flex flex-col items-center text-center">
        <h1 className="text-3xl md:text-5xl uppercase tracking-[0.3em] font-light text-[#2a2a2a] mb-10">
          {category ? translateCategory(category.name, locale) : tNav('catalog')}
        </h1>
        <div className="w-8 h-[1px] bg-[#2a2a2a]/20 mb-24" />

        {/* Emotion/Mood Filters */}
        <div className={`w-full max-w-6xl flex flex-col md:flex-row justify-between gap-16 text-xs uppercase tracking-[0.2em] font-light text-[#2a2a2a]/50 ${locale === 'he' ? 'md:flex-row-reverse' : ''}`}>
          
          <div className="flex flex-col gap-6">
            <span className="text-[9px] tracking-[0.4em] opacity-40">{locale === 'he' ? 'סינון לפי אווירה' : 'Mood'}</span>
            <div className={`flex flex-wrap gap-8 ${locale === 'he' ? 'justify-end md:justify-start' : 'justify-start'}`}>
              {moods.map((m, i) => (
                <button key={i} className="hover:text-[#2a2a2a] transition-colors duration-700">{m}</button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <span className="text-[9px] tracking-[0.4em] opacity-40">{locale === 'he' ? 'קנה לפי חלל' : 'Space'}</span>
            <div className={`flex flex-wrap gap-8 ${locale === 'he' ? 'justify-end' : 'justify-start'}`}>
              {projects.map((p, i) => (
                <button key={i} className="hover:text-[#2a2a2a] transition-colors duration-700">{p}</button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Luxury Grid */}
      <div className="w-full px-8 md:px-16 pb-40">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 md:gap-x-24 gap-y-32 max-w-[1800px] mx-auto ${locale === 'he' ? 'rtl' : 'ltr'}`}>
          {products.length === 0 ? (
            <div className="col-span-full py-32 text-center text-[#2a2a2a]/40 font-light tracking-widest uppercase text-sm">
              {locale === 'he' ? 'לא נמצאו מוצרים בקולקציה זו.' : 'No pieces found in this collection.'}
            </div>
          ) : (
            products.map((product) => (
              <Link 
                key={product.id} 
                href={`/catalog/product/${product.id}`} 
                prefetch={false}
                className="group flex flex-col items-center cursor-none"
              >
                {/* Floating Image Container (No Borders/Backgrounds) */}
                <div className="w-full aspect-[4/5] relative flex items-center justify-center mb-10 overflow-hidden">
                  {(product.images as string[])?.[0] ? (
                    <img
                      src={(product.images as string[])[0]}
                      alt={locale === 'he' && product.titleHe ? product.titleHe : product.title}
                      className="w-full h-full object-contain mix-blend-multiply transition-transform duration-[1.5s] ease-[0.22,1,0.36,1] group-hover:scale-[1.04]"
                    />
                  ) : (
                    <span className="text-[9px] uppercase tracking-widest text-[#2a2a2a]/20">Archive</span>
                  )}
                </div>
                
                {/* Minimal Typography (Only Name) */}
                <h2 className="text-[11px] md:text-[13px] font-light uppercase tracking-[0.25em] text-[#2a2a2a]/70 group-hover:text-[#2a2a2a] transition-colors duration-700 text-center" dir="auto">
                  {locale === 'he' && product.titleHe ? product.titleHe : product.title}
                </h2>
              </Link>
            ))
          )}
        </div>
      </div>
      
      {/* Bottom return link */}
      <div className="w-full flex justify-center pb-32">
        <Link href="/catalog" prefetch={false} className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-[#2a2a2a]/40 hover:text-[#2a2a2a] transition-colors duration-700 border-b border-transparent hover:border-[#2a2a2a]/30 pb-2">
          {locale === 'he' ? 'חזור לקולקציות' : 'Return to Collections'}
        </Link>
      </div>
    </main>
  );
}
