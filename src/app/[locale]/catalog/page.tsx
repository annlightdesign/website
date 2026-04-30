import { prisma } from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Assistant } from 'next/font/google';
import { translateCategory } from '@/lib/dictionaries';
import CinematicCategory from '@/components/CinematicCategory';


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
  const tNav = await getTranslations('Navigation');

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

  // LAYER 1: CINEMATIC LANDING (The only logic left here)
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
      <main className={`w-full min-h-screen bg-background text-foreground ${locale === 'he' ? assistantFont.className : ''}`}>
        
        {/* Editorial Header */}
        <div className="w-full pt-48 pb-24 px-8 md:px-16 flex flex-col items-center text-center">
          <h1 className="text-3xl md:text-5xl uppercase tracking-[0.3em] font-light text-foreground mb-10">
            {tNav('catalog')}
          </h1>
          <div className="w-8 h-[1px] bg-foreground/20 mb-24" />
          
          <p className="text-xs uppercase tracking-[0.2em] font-light text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {locale === 'he' ? 'חקור את קולקציות התאורה האדריכלית שלנו.' : 'Explore our architectural lighting collections.'}
          </p>
        </div>

        {/* Collections Grid */}
        <div className="w-full px-8 md:px-16 pb-40">
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 md:gap-x-24 gap-y-32 max-w-[1800px] mx-auto ${locale === 'he' ? 'rtl' : 'ltr'}`}>
            {categories.length === 0 ? (
              <div className="col-span-full py-32 text-center text-muted-foreground font-light tracking-widest uppercase text-sm">
                {locale === 'he' ? 'לא נמצאו קולקציות.' : 'No collections found.'}
              </div>
            ) : (
              categories.map(cat => {
                let imgUrl = cat.image || null;
                const products = cat.products || [];
                if (!imgUrl && products.length > 0 && products[0].images) {
                   const imgs = products[0].images as string[];
                   if (imgs.length > 0) imgUrl = imgs[0];
                }
                const catSlug = encodeURIComponent(cat.name);
                
                return (
                  <Link 
                    key={cat.id} 
                    href={`/catalog/${catSlug}`} 
                    prefetch={false}
                    className="group flex flex-col items-center"
                  >
                    {/* Floating Image Container */}
                    <div className="w-full aspect-[4/5] relative flex items-center justify-center mb-10 overflow-hidden bg-neutral-100/5 dark:bg-neutral-900/50 rounded-sm">
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={locale === 'he' && cat.nameHe ? cat.nameHe : translateCategory(cat.name, locale)}
                          className="w-full h-full object-contain transition-transform duration-[1.5s] ease-[0.22,1,0.36,1] group-hover:scale-[1.04]"
                        />
                      ) : (
                        <span className="text-[9px] uppercase tracking-widest text-muted-foreground/30">Archive</span>
                      )}
                    </div>
                    
                    {/* Minimal Typography */}
                    <h2 className="text-sm md:text-base font-light uppercase tracking-[0.2em] text-foreground/80 group-hover:text-foreground transition-colors duration-700 text-center" dir="auto">
                      {locale === 'he' && cat.nameHe ? cat.nameHe : translateCategory(cat.name, locale)}
                    </h2>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </main>
    );
}
