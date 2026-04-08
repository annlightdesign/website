import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Assistant } from 'next/font/google';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { translateCategory, translateSpecKey, translateSpecValue } from '@/lib/dictionaries';
import ProductGallery from '@/components/ProductGallery';

const assistantFont = Assistant({ subsets: ['hebrew', 'latin'] });

export async function generateMetadata({ params }: { params: Promise<{ id: string, locale: string }> }) {
  const { id, locale } = await params;
  console.log("generateMetadata ID params received:", id);
  const product = await prisma.product.findUnique({ where: { id: parseInt(id) } });
  console.log("generateMetadata product found:", product?.id);
  
  if (!product) return { title: 'Not Found' };
  return { title: locale === 'he' && product.titleHe ? `\u2068${product.titleHe}\u2069` : product.title };
}

export default async function ProductPage(props: { params: Promise<{ id: string, locale: string }> }) {
  const { id, locale } = await props.params;
  const t = await getTranslations('Navigation');
  console.log("ProductPage ID params received:", id);
  
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
    include: { category: true, brand: true }
  });
  console.log("ProductPage product found:", product?.id);

  if (!product) {
    notFound();
  }

  const images = (product.images as string[]) || [];
  const specifications = typeof product.specifications === 'string' 
    ? JSON.parse(product.specifications) 
    : (product.specifications || {});

  const specKeys = Object.keys(specifications);

  return (
    <main className={`container mx-auto px-6 py-12 pt-32 min-h-screen ${locale === 'he' ? assistantFont.className : ''}`}>
      <Link 
        href="/catalog" 
        className={`flex items-center gap-2 hover:text-foreground text-muted-foreground w-fit uppercase text-xs tracking-widest font-semibold transition-colors mb-12 ${locale === 'he' ? 'ml-auto flex-row-reverse' : ''}`}
      >
        {locale === 'he' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
        {locale === 'he' ? 'חזרה לקטלוג' : 'Back to Catalog'}
      </Link>

      <div className={`flex flex-col lg:flex-row gap-16 lg:gap-24 ${locale === 'he' ? 'lg:flex-row-reverse text-right' : 'text-left'}`}>
        
        {/* Gallery Section */}
        <div className="flex-1 w-full flex flex-col gap-4">
          <ProductGallery images={images} title={product.title} locale={locale} />
        </div>

        {/* Details Section */}
        <div className="flex-1 flex flex-col justify-center">
           <div className={`mb-8 border-b border-border pb-8`}>
             <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-3">
               {product.category?.name ? translateCategory(product.category.name, locale) : (locale === 'he' ? 'ללא קטגוריה' : 'Uncategorized')}
             </h3>
             <h1 className="text-3xl md:text-5xl font-light uppercase tracking-widest mb-6 leading-tight" dir="auto">
               {locale === 'he' && product.titleHe ? product.titleHe : product.title}
             </h1>
             
             {product.description && (
               <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm md:text-base">
                 {product.description}
               </p>
             )}
           </div>

           {specKeys.length > 0 && (
             <div>
               <h3 className="text-xs uppercase tracking-widest text-foreground font-semibold mb-6">
                 {locale === 'he' ? 'מפרט טכני' : 'Technical Specifications'}
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

           {/* Call to action or dynamic info can go here */}
           <div className="mt-16">
             <Link href="/contact" className={`inline-block border border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors px-10 py-4 uppercase text-xs tracking-[0.2em] font-semibold ${locale === 'he' ? 'text-center w-full md:w-auto' : ''}`}>
               {locale === 'he' ? 'לקבלת פרטים נוספים והצעת מחיר' : 'Request More Information'}
             </Link>
           </div>
        </div>

      </div>
    </main>
  );
}
