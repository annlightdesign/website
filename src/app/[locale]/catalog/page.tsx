import { prisma } from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Assistant } from 'next/font/google';
import { translateCategory } from '@/lib/dictionaries';

const assistantFont = Assistant({ subsets: ['hebrew', 'latin'] });

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const title = locale === 'he' ? 'קטלוג' : 'Catalog';
  return {
    title,
    description: 'Explore the Ann Light architectural lighting catalog.',
  };
}

export default async function CatalogPage(props: { 
  params: Promise<{ locale: string }>,
  searchParams: Promise<{ category?: string }>
}) {
  const { locale } = await props.params;
  const searchParams = await props.searchParams;
  const categoryId = searchParams.category ? parseInt(searchParams.category) : undefined;
  
  const t = await getTranslations('Catalog');
  const tNav = await getTranslations('Navigation');

  const categories = await prisma.category.findMany({
    where: { enabled: true }
  });

  const products = await prisma.product.findMany({
    where: { 
      categories: { some: { id: categoryId, enabled: true } },
    },
    include: { categories: true, brand: true },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }]
  });

  return (
    <main className={`container mx-auto px-6 py-12 pt-32 min-h-screen ${locale === 'he' ? assistantFont.className : ''}`}>
      <h1 className={`text-[40px] uppercase mb-12 ${locale === 'he' ? 'text-right font-extralight tracking-[0.2em]' : 'font-sans font-light tracking-[0.25em]'}`}>{tNav('catalog')}</h1>

      <div className={`flex flex-col gap-12 ${locale === 'he' ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-28 space-y-8">
            <div>
              <h3 className={`font-light uppercase text-lg tracking-[0.1em] mb-6 border-b border-border/40 pb-4 text-foreground ${locale === 'he' ? 'text-right' : 'text-left'}`}>
                {locale === 'he' ? 'קטגוריות' : 'Categories'}
              </h3>
              <ul className={`space-y-4 text-[15px] font-light text-muted-foreground w-full break-normal ${locale === 'he' ? 'text-right' : 'text-left'}`} dir={locale === 'he' ? 'rtl' : 'ltr'}>
                <li>
                  <Link href="/catalog" prefetch={false} className={`block hover:text-foreground transition-colors duration-300 ${!categoryId ? 'text-foreground font-medium tracking-wide' : 'hover:translate-x-1 hover:rtl:-translate-x-1'}`}>
                    {locale === 'he' ? 'נמכרים ביותר' : 'Top Selling'}
                  </Link>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link href={`/catalog?category=${cat.id}`} prefetch={false} scroll={false} className={`block hover:text-foreground transition-colors duration-300 ${categoryId === cat.id ? 'text-foreground font-medium tracking-wide' : 'hover:translate-x-1 hover:rtl:-translate-x-1'}`}>
                      {translateCategory(cat.name, locale)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className={`font-light uppercase text-lg tracking-[0.1em] mb-6 border-b border-border/40 pb-4 text-foreground mt-12 ${locale === 'he' ? 'text-right' : 'text-left'}`}>
                {locale === 'he' ? 'מותגים' : 'Brands'}
              </h3>
              <ul className={`space-y-4 text-[15px] font-light text-muted-foreground ${locale === 'he' ? 'text-right' : 'text-left'}`}>
                <li className="hover:text-foreground cursor-pointer transition-colors duration-300 hover:translate-x-1">Vibia</li>
                <li className="hover:text-foreground cursor-pointer transition-colors duration-300 hover:translate-x-1">Lodes</li>
                <li className="hover:text-foreground cursor-pointer transition-colors duration-300 hover:translate-x-1">Ferroluce</li>
                <li className="hover:text-foreground cursor-pointer transition-colors duration-300 hover:translate-x-1">Panzeri</li>
              </ul>
            </div>
          </div>
        </aside>

        <div className="flex-1 gallery-grid">
          {products.length === 0 ? (
            <p className="text-muted-foreground text-sm col-span-full py-20 text-center border-dashed border-2 border-border rounded-lg">No products found in the catalog.</p>
          ) : (
            products.map((product) => (
              <Link key={product.id} href={`/catalog/product/${product.id}`} prefetch={false} className="group flex flex-col gap-3 cursor-pointer">
                <div className="aspect-[4/5] bg-muted relative overflow-hidden flex items-center justify-center text-muted-foreground">
                  {(product.images as string[])?.[0] ? (
                    <img
                      src={(product.images as string[])[0]}
                      alt={locale === 'he' && product.titleHe ? product.titleHe : product.title}
                      className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <span className="text-xs uppercase tracking-widest">No Image</span>
                  )}
                </div>
                <div className={locale === 'he' ? 'text-right' : 'text-left'}>
                  <h2 className="text-sm font-semibold uppercase tracking-wider" dir="auto">{locale === 'he' && product.titleHe ? product.titleHe : product.title}</h2>
                  <p className="text-xs text-muted-foreground mt-1 text-inherit">{product.categories && product.categories.length > 0 ? product.categories.map(c => translateCategory(c.name, locale)).join(', ') : (locale === 'he' ? 'ללא קטגוריה' : 'Uncategorized')}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
