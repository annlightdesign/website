import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Assistant } from 'next/font/google';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { translateCategory, translateSpecKey, translateSpecValue } from '@/lib/dictionaries';
import ProductGallery from '@/components/ProductGallery';
import CollectionGallery from '@/components/CollectionGallery';
import { generateSlug, decodeSlug } from '@/lib/slugs';

const assistantFont = Assistant({ subsets: ['hebrew', 'latin'] });

export async function generateMetadata({ params }: { params: Promise<{ locale: string, slug: string[] }> }) {
  const { locale, slug } = await params;
  const decodedSlug = slug.map(s => decodeSlug(s));
  const titleStr = decodedSlug[decodedSlug.length - 1];
  return {
    title: titleStr,
    description: `Explore ${titleStr} from Ann Light.`,
  };
}

export default async function DynamicCatalogPage(props: { params: Promise<{ locale: string, slug: string[] }> }) {
  const { locale, slug } = await props.params;
  const decodedSlug = slug.map(s => decodeSlug(s));
  const t = await getTranslations('Catalog');
  const tNav = await getTranslations('Navigation');

  // Helper to fetch Category by Name
  const findCategoryByName = async (name: string, parentId: number | null = null) => {
    return await prisma.category.findFirst({
      where: {
        AND: [
          parentId !== null ? { parentId } : { parentId: null },
          { OR: [{ name: { equals: name, mode: 'insensitive' } }, { nameHe: name }] }
        ]
      },
      include: {
        children: {
          where: { enabled: true },
          orderBy: { order: 'asc' },
          include: { products: { take: 1, orderBy: { id: 'desc' } } }
        }
      }
    });
  };

  // Helper to fetch Product by Name
  const findProductByName = async (name: string) => {
    return await prisma.product.findFirst({
      where: { OR: [{ title: { equals: name, mode: 'insensitive' } }, { titleHe: name }] },
      include: { categories: true, brand: true }
    });
  };

  const catName = decodedSlug[0];
  const category = await findCategoryByName(catName);

  if (!category) {
    notFound();
  }

  // --- Determine what to render based on slug depth ---

  let renderType: 'collection-gallery' | 'product-grid' | 'product-single' = 'product-grid';
  let targetCategory = category;
  let targetProduct = null;
  let backHref = '/catalog';

  if (decodedSlug.length === 1) {
    if (category.children && category.children.length > 0) {
      renderType = 'collection-gallery';
    } else {
      renderType = 'product-grid';
    }
  } else if (decodedSlug.length === 2) {
    // It's either a Collection (child category) OR a Product
    const childCatName = decodedSlug[1];
    const childCategory = await findCategoryByName(childCatName, category.id);
    
    if (childCategory) {
      targetCategory = childCategory;
      renderType = 'product-grid';
      backHref = `/catalog/${generateSlug(catName)}`;
    } else {
      const product = await findProductByName(childCatName);
      if (product) {
        targetProduct = product;
        renderType = 'product-single';
        backHref = `/catalog/${generateSlug(catName)}`;
      } else {
        notFound();
      }
    }
  } else if (decodedSlug.length === 3) {
    // It's [category, collection, product]
    const prodName = decodedSlug[2];
    const product = await findProductByName(prodName);
    if (product) {
      targetProduct = product;
      renderType = 'product-single';
      backHref = `/catalog/${generateSlug(catName)}/${generateSlug(decodedSlug[1])}`;
    } else {
      notFound();
    }
  } else {
    notFound();
  }

  // --- RENDER COLLECTION GALLERY ---
  if (renderType === 'collection-gallery') {
    return (
      <main className={`w-full min-h-screen bg-background text-foreground ${locale === 'he' ? assistantFont.className : ''}`}>
        <CollectionGallery 
          collections={category.children} 
          locale={locale} 
          categoryName={locale === 'he' && category.nameHe ? category.nameHe : translateCategory(category.name, locale)} 
          parentSlug={generateSlug(catName)}
        />
      </main>
    );
  }

  // --- RENDER PRODUCT GRID (Layer 3) ---
  if (renderType === 'product-grid') {
    const products = await prisma.product.findMany({
      where: { 
        categories: { some: { id: targetCategory.id, enabled: true } },
      },
      include: { categories: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }]
    });

    const moods = locale === 'he' ? ['מינימליסטי', 'חמים', 'טכני', 'דקורטיבי'] : ['Minimal', 'Warm', 'Technical', 'Decorative'];
    const projects = locale === 'he' ? ['סלון', 'מטבח', 'משרד', 'וילה'] : ['Living Room', 'Kitchen', 'Office', 'Villa'];

    // Construct the base URL for the products
    const baseUrl = decodedSlug.map(s => generateSlug(s)).join('/');

    return (
      <main className={`w-full min-h-screen bg-background text-foreground ${locale === 'he' ? assistantFont.className : ''}`}>
        <div className="w-full pt-48 pb-24 px-8 md:px-16 flex flex-col items-center text-center">
          <h1 className="text-3xl md:text-5xl uppercase tracking-[0.3em] font-light text-foreground mb-10">
            {locale === 'he' && targetCategory.nameHe ? targetCategory.nameHe : translateCategory(targetCategory.name, locale)}
          </h1>
          <div className="w-8 h-[1px] bg-foreground/20 mb-24" />
          <div className={`w-full max-w-6xl flex flex-col md:flex-row justify-between gap-16 text-xs uppercase tracking-[0.2em] font-light text-muted-foreground ${locale === 'he' ? 'md:flex-row-reverse' : ''}`}>
            <div className="flex flex-col gap-6">
              <span className="text-[9px] tracking-[0.4em] opacity-40">{locale === 'he' ? 'סינון לפי אווירה' : 'Mood'}</span>
              <div className={`flex flex-wrap gap-8 ${locale === 'he' ? 'justify-end md:justify-start' : 'justify-start'}`}>
                {moods.map((m, i) => (<button key={i} className="hover:text-foreground transition-colors duration-700">{m}</button>))}
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <span className="text-[9px] tracking-[0.4em] opacity-40">{locale === 'he' ? 'קנה לפי חלל' : 'Space'}</span>
              <div className={`flex flex-wrap gap-8 ${locale === 'he' ? 'justify-end' : 'justify-start'}`}>
                {projects.map((p, i) => (<button key={i} className="hover:text-foreground transition-colors duration-700">{p}</button>))}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full px-8 md:px-16 pb-40">
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 md:gap-x-24 gap-y-32 max-w-[1800px] mx-auto ${locale === 'he' ? 'rtl' : 'ltr'}`}>
            {products.length === 0 ? (
              <div className="col-span-full py-32 text-center text-muted-foreground font-light tracking-widest uppercase text-sm">
                {locale === 'he' ? 'לא נמצאו מוצרים.' : 'No pieces found.'}
              </div>
            ) : (
              products.map((product) => {
                const prodSlug = generateSlug(product.title);
                return (
                <Link 
                  key={product.id} 
                  href={`/catalog/${baseUrl}/${prodSlug}`} 
                  prefetch={false}
                  className="group flex flex-col items-center"
                >
                  <div className="w-full aspect-[4/5] relative flex items-center justify-center mb-10 overflow-hidden bg-neutral-100/5 dark:bg-neutral-900/50 rounded-sm">
                    {(product.images as string[])?.[0] ? (
                      <img
                        src={(product.images as string[])[0]}
                        alt={locale === 'he' && product.titleHe ? product.titleHe : product.title}
                        className="w-full h-full object-contain transition-transform duration-[1.5s] ease-[0.22,1,0.36,1] group-hover:scale-[1.04]"
                      />
                    ) : (
                      <span className="text-[9px] uppercase tracking-widest text-muted-foreground/30">Archive</span>
                    )}
                  </div>
                  <h2 className="text-sm md:text-base font-light uppercase tracking-[0.2em] text-foreground/80 group-hover:text-foreground transition-colors duration-700 text-center" dir="auto">
                    {locale === 'he' && product.titleHe ? product.titleHe : product.title}
                  </h2>
                </Link>
              )})
            )}
          </div>
        </div>
        
        <div className="w-full flex justify-center pb-32">
          <Link href={backHref} prefetch={false} className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-colors duration-700 border-b border-transparent hover:border-foreground/30 pb-2">
            {locale === 'he' ? 'חזור' : 'Go Back'}
          </Link>
        </div>
      </main>
    );
  }

  // --- RENDER PRODUCT SINGLE ---
  if (renderType === 'product-single' && targetProduct) {
    const images = (targetProduct.images as string[]) || [];
    const specifications = typeof targetProduct.specifications === 'string' 
      ? JSON.parse(targetProduct.specifications) 
      : (targetProduct.specifications || {});
    const specKeys = Object.keys(specifications);

    return (
      <main className={`container mx-auto px-6 py-12 pt-32 min-h-screen ${locale === 'he' ? assistantFont.className : ''}`}>
        <Link 
          href={backHref} 
          className={`flex items-center gap-2 hover:text-foreground text-muted-foreground w-fit uppercase text-xs tracking-widest font-semibold transition-colors mb-12 ${locale === 'he' ? 'ml-auto flex-row-reverse' : ''}`}
        >
          {locale === 'he' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          {t('back')}
        </Link>

        <div className={`flex flex-col lg:flex-row gap-16 lg:gap-24 ${locale === 'he' ? 'lg:flex-row-reverse text-right' : 'text-left'}`}>
          <div className="flex-1 w-full flex flex-col gap-4">
            <ProductGallery images={images} title={targetProduct.title} locale={locale} />
          </div>

          <div className="flex-1 flex flex-col justify-center">
             <div className={`mb-8 border-b border-border pb-8`}>
               <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-3">
                 {targetProduct.categories && targetProduct.categories.length > 0 ? targetProduct.categories.map(c => locale === 'he' && c.nameHe ? c.nameHe : c.name).join(', ') : t('uncategorized')}
               </h3>
               <h1 className="text-3xl md:text-5xl font-light uppercase tracking-widest mb-6 leading-tight" dir="auto">
                 {locale === 'he' && targetProduct.titleHe ? targetProduct.titleHe : targetProduct.title}
               </h1>
               {targetProduct.description && (
                 <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm md:text-base">
                   {targetProduct.description}
                 </p>
               )}
             </div>

             {specKeys.length > 0 && (
               <div>
                 <h3 className="text-xs uppercase tracking-widest text-foreground font-semibold mb-6">
                   {t('technicalSpecs')}
                 </h3>
                 <div className="grid grid-cols-1 gap-x-12 gap-y-4">
                   {specKeys.map((key) => (
                     <div key={key} className={`flex justify-between border-b border-border/50 pb-2 ${locale === 'he' ? 'flex-row-reverse' : ''}`}>
                       <span className="text-muted-foreground text-sm uppercase tracking-wider">{translateSpecKey(key, locale)}</span>
                       <span className="font-medium text-sm">{translateSpecValue(String(specifications[key]), locale)}</span>
                     </div>
                   ))}
                 </div>
               </div>
             )}

             <div className="mt-16">
               <Link href="/contact" className={`inline-block border border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors px-10 py-4 uppercase text-xs tracking-[0.2em] font-semibold ${locale === 'he' ? 'text-center w-full md:w-auto' : ''}`}>
                 {t('requestInfo')}
               </Link>
             </div>
          </div>
        </div>
      </main>
    );
  }

  return null;
}
