import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import ArchitectsClientForm from './ArchitectsClientForm';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const title = locale === 'he' ? 'אדריכלים' : 'Architects';
  return {
    title,
    description: 'Services and inquiries for architects and designers at Ann Light.',
  };
}

export default async function ArchitectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('Architects');

  const dict = {
    formTitle: t('formTitle'),
    namePlaceholder: t('namePlaceholder'),
    phonePlaceholder: t('phonePlaceholder'),
    emailPlaceholder: t('emailPlaceholder'),
    privacyPolicy: t('privacyPolicy'),
    sendRequest: t('sendRequest')
  };

  const setting = await prisma.siteSetting.findUnique({ where: { key: 'construction_architects' } });
  if (setting?.value === 'true') {
    return (
      <main className="container mx-auto px-6 py-32 min-h-[70vh] flex flex-col items-center justify-center text-center z-10 relative">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-4xl md:text-5xl uppercase font-light tracking-[0.2em] text-foreground">
            {locale === 'he' ? 'אדריכלים - בקרוב' : 'Architects - Coming Soon'}
          </h1>
          <div className="w-16 h-[1px] bg-foreground/20 mx-auto"></div>
          <p className="text-muted-foreground text-lg md:text-xl font-light leading-relaxed">
            {locale === 'he' ? 'עמוד האדריכלים יעלה לאוויר ממש בקרוב.' : 'Our dedicated architects portal will be available shortly.'}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative z-10 w-full min-h-screen bg-background">
      <div 
        className="max-w-7xl mx-auto px-6 py-24 md:py-32 pt-40 md:pt-48 flex flex-col lg:flex-row gap-16 lg:gap-24 items-start"
        dir={locale === 'he' ? 'rtl' : 'ltr'}
      >
        
        {/* LEFT BLOCK: Editorial Text */}
        <div className="w-full lg:w-[45%] flex flex-col items-start">
          <h1 className="text-4xl md:text-5xl font-light uppercase tracking-[0.15em] text-foreground drop-shadow-sm">
            {t('title')}
          </h1>
          <div className="w-24 h-[1px] bg-foreground/20 mt-8 mb-10" />

          <div className={`text-muted-foreground text-lg font-light drop-shadow-sm leading-relaxed flex flex-col gap-6 w-full max-w-[420px] ${locale === 'he' ? 'text-right' : 'text-left'}`}>
            <p className="opacity-90">{t('p1')}</p>
            <p className="opacity-90">{t('p2')} {t('p3')}</p>
            <p className="text-foreground text-[18px] mt-6 tracking-wide drop-shadow-md">
              {t('p4')}
            </p>
          </div>
        </div>

        {/* RIGHT BLOCK: Minimalist Form */}
        <div className="w-full lg:w-[55%] flex flex-col lg:pt-4">
          <ArchitectsClientForm t={dict} locale={locale} />
        </div>

      </div>
    </main>
  );
}
