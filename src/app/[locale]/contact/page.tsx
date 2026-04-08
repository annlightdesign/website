import { getTranslations } from 'next-intl/server';
import { MapPin, Phone, Clock } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import SchemaOrg from '@/components/SchemaOrg';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const title = locale === 'he' ? 'צור קשר' : 'Contact';
  return {
    title,
    description: 'Contact Ann Light for architectural lighting and design.',
  };
}

export default async function ContactPage() {
  const t = await getTranslations('Contact');

  let wallpaperUrl = '';
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: 'contact_wallpaper' } });
    if (setting?.value) wallpaperUrl = setting.value;
  } catch (e) { }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://annlight.co.il';

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Ann Light',
    image: `${baseUrl}/favicon.ico`,
    url: baseUrl,
    telephone: '050-602-2220',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IL',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 32.4247293,
      longitude: 35.0362527
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday'
        ],
        opens: '09:00',
        closes: '18:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Friday',
        opens: '09:00',
        closes: '13:00'
      }
    ]
  };

  return (
    <>
      <SchemaOrg schema={localBusinessSchema} />
      {wallpaperUrl && (
        <>
          <img 
            src={wallpaperUrl} 
            alt="Contact Background" 
            className="fixed inset-0 w-full h-full object-cover pointer-events-none z-[0]" 
          />
          <div className="fixed inset-0 z-[0] bg-background/60 backdrop-blur-md pointer-events-none" />
        </>
      )}
      <main className={`relative z-10 w-full min-h-screen ${wallpaperUrl ? 'bg-transparent' : 'bg-background'}`}>
        <div className={`max-w-6xl mx-auto px-6 py-24 md:py-32 pt-32 md:pt-40 ${wallpaperUrl ? 'mt-32' : ''}`}>
          <header className="text-center mb-16 flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-light uppercase tracking-[0.15em] text-foreground drop-shadow-sm">{t('title')}</h1>
            <div className="w-24 h-[1px] bg-foreground/20 mt-6 mb-8" />
            <p className="text-muted-foreground/80 text-lg font-light drop-shadow-sm">{t('subtitle')}</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-20 md:gap-24 text-center">
            {/* Card 1: Location */}
            <div className="flex flex-col items-center px-4 group">
              <div className="mb-8 opacity-30 group-hover:opacity-50 group-hover:scale-[1.02] transition-all duration-500">
                <MapPin className="w-8 h-8" strokeWidth={0.75} />
              </div>
              <h3 className="text-lg font-medium uppercase tracking-[0.15em] mb-4 text-foreground">{t('address_label')}</h3>
              <p className="text-muted-foreground/60 leading-[1.8] text-[1.05rem]">
                {t('address')}<br /><br />
                <a
                  href="https://ul.waze.com/ul?venue_id=22937924.229641386.513805&overview=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground/80 hover:text-foreground transition-all duration-300 inline-flex items-center gap-2 border-b border-transparent hover:border-foreground/50 pb-0.5"
                >
                  <img src="https://cdn.simpleicons.org/waze/000000" className="w-[14px] h-[14px] dark:invert opacity-60 group-hover:opacity-100 transition-opacity duration-300" alt="Waze" /> {t('waze_button')}
                </a>
              </p>
            </div>

            {/* Card 2: Contact Info */}
            <div className="flex flex-col items-center px-4 group">
              <div className="mb-8 opacity-30 group-hover:opacity-50 group-hover:scale-[1.02] transition-all duration-500">
                <Phone className="w-8 h-8" strokeWidth={0.75} />
              </div>
              <h3 className="text-lg font-medium uppercase tracking-[0.15em] mb-4 text-foreground">{t('get_in_touch')}</h3>
              <p className="text-muted-foreground/60 leading-[1.6] text-[1.05rem] w-full text-center flex flex-col gap-1 items-center">
                <span className="block font-normal text-foreground/90" dir="auto">{t('phone_label')}:</span>
                <a href="tel:050-602-2220" className="block text-foreground/80 hover:text-foreground font-medium tracking-wide transition-colors duration-300 cursor-pointer" dir="ltr">050-602-2220</a>
                <a href="tel:053-660-3033" className="block text-foreground/80 hover:text-foreground font-medium tracking-wide transition-colors duration-300 mb-4 cursor-pointer" dir="ltr">{t('phone')}</a>

                <span className="block font-normal text-foreground/90 mt-2" dir="auto">{t('email_label')}:</span>
                <a href="mailto:ann.light.design@gmail.com" className="block text-foreground/80 hover:text-foreground font-medium tracking-wide transition-all duration-300 border-b border-transparent hover:border-foreground/50 pb-0.5 break-all cursor-pointer" dir="ltr">{t('email')}</a>
              </p>
            </div>

            {/* Card 3: Hours */}
            <div className="flex flex-col items-center px-4 group">
              <div className="mb-8 opacity-30 group-hover:opacity-50 group-hover:scale-[1.02] transition-all duration-500">
                <Clock className="w-8 h-8" strokeWidth={0.75} />
              </div>
              <h3 className="text-lg font-medium uppercase tracking-[0.15em] mb-4 text-foreground">{t('hours_label')}</h3>
              <div className="text-muted-foreground/60 leading-[1.8] text-[1.05rem]">
                {t('hours')}
              </div>
            </div>
          </div>
        </div>

        {/* Beautiful Fading Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent my-16 opacity-80" />

        {/* Ultra Dark Clean Map Section */}
        <div
          className="relative w-full h-[400px] bg-[#000] overflow-hidden rounded-xl shadow-[inset_0_4px_20px_rgba(0,0,0,0.5)]"
          style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%)', maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%)' }}
        >

          <iframe
            className="absolute border-none filter invert grayscale contrast-[1.2] opacity-80 pointer-events-none"
            style={{ width: 'calc(100% + 600px)', height: 'calc(100% + 250px)', top: '-125px', left: '-300px' }}
            src="https://maps.google.com/maps?q=32.4247293,35.0362527&t=m&z=17&ie=UTF8&iwloc=&output=embed"
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full flex flex-col items-center pointer-events-none z-10">
            <div className="absolute bottom-[2px] w-[30px] h-[15px] bg-black scale-[1.5] blur-[6px] z-[-1] rounded-full translate-y-2 opacity-100" />
            <img src="https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi3.png" alt="Map Pin" className="w-[36px] h-[56px] relative z-20" />
          </div>
        </div>
      </main>
    </>
  );
}
