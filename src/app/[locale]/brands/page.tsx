import { Assistant } from 'next/font/google';

const assistantFont = Assistant({ subsets: ['hebrew', 'latin'] });

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const title = locale === 'he' ? 'מותגים' : 'Brands';
  return {
    title,
    description: 'Explore the Ann Light architectural lighting brands.',
  };
}

import { prisma } from '@/lib/prisma';

export default async function BrandsPage(props: { 
  params: Promise<{ locale: string }>
}) {
  const { locale } = await props.params;
  
  const setting = await prisma.siteSetting.findUnique({ where: { key: 'construction_brands' } });
  const isComingSoon = setting?.value !== 'false'; // Default to true if not set since it's in development

  if (isComingSoon) {
    return (
    <main className={`container mx-auto px-6 py-32 min-h-[70vh] flex flex-col items-center justify-center text-center ${locale === 'he' ? assistantFont.className : ''}`}>
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl md:text-5xl uppercase font-light tracking-[0.2em] text-foreground">
          {locale === 'he' ? 'המותגים בבנייה' : 'Brands Coming Soon'}
        </h1>
        <div className="w-16 h-[1px] bg-foreground/20 mx-auto"></div>
        <p className="text-muted-foreground text-lg md:text-xl font-light leading-relaxed">
          {locale === 'he' 
            ? 'אנו שוקדים כעת על הכנת רשימת המותגים שלנו. במקביל אפשר לראות את הפרויקטים שלנו ולתרשם מהקולקציות החדשות שמופיעות ממש עוד מעט.' 
            : 'We are currently curating our brands list. It will be available soon featuring our latest architectural lighting collections.'}
        </p>
      </div>
    </main>
    );
  }

  // Fallback actual brands grid (Empty state for now)
  return (
    <main className={`container mx-auto px-6 py-32 min-h-[70vh] flex flex-col items-center justify-center text-center ${locale === 'he' ? assistantFont.className : ''}`}>
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl md:text-5xl uppercase font-light tracking-[0.2em] text-foreground">
          {locale === 'he' ? 'מותגים' : 'Brands'}
        </h1>
        <div className="w-16 h-[1px] bg-foreground/20 mx-auto"></div>
        <p className="text-muted-foreground text-lg md:text-xl font-light leading-relaxed">
          {locale === 'he' ? 'אין מותגים להצגה עדיין.' : 'No brands to display yet.'}
        </p>
      </div>
    </main>
  );
}
