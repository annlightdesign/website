import { prisma } from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
import { Tinos, Playfair_Display, Assistant } from 'next/font/google';
import Footer from '@/components/Footer';
import AboutSection from '@/components/AboutSection';
import ScrollIndicator from '@/components/ScrollIndicator';
import { Link } from '@/i18n/routing';
import HomeHero from '@/components/HomeHero';
import HomeSecond from '@/components/HomeSecond';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const tinosFont = Tinos({ weight: ['400', '700'], subsets: ['hebrew', 'latin'] });
const playfairFont = Playfair_Display({ weight: ['400', '700'], subsets: ['latin'] });
const assistantFont = Assistant({ weight: ['200', '300', '400'], subsets: ['hebrew', 'latin'] });

export default async function HomePage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  const t = await getTranslations('Hero');
  const tNav = await getTranslations('Navigation');

  let dict: Record<string, string> = {};
  try {
    const settings = await prisma.siteSetting.findMany();
    dict = settings.reduce((acc, cur) => { acc[cur.key] = cur.value; return acc; }, {} as Record<string, string>);
  } catch (e) { }

  const titleKey = `hero_title_${locale}`;
  const subtitleKey = `hero_subtitle_${locale}`;

  const finalTitle = dict[titleKey] || t('title');
  const finalSubtitle = dict[subtitleKey] || t('subtitle');

  const aboutTitleKey = `about_title_${locale}`;
  const aboutTextKey = `about_text_${locale}`;
  const aboutTitle = dict[aboutTitleKey];
  const aboutText = dict[aboutTextKey];

  const secondTitleKey = `second_title_${locale}`;
  const secondTextKey = `second_text_${locale}`;

  let secondTitle = dict[secondTitleKey];
  let secondText = dict[secondTextKey];

  if (!secondTitle) {
    secondTitle = locale === 'he'
      ? 'חוויה חדשה של תאורה'
      : 'A New Lighting Experience';
  }
  if (!secondText) {
    secondText = locale === 'he'
      ? 'ברוכים הבאים לעולם של עיצוב, איכות ואור שלא הכרתם\nכל פריט נבחר בקפידה כדי להאיר את הבית שלכם בסטייל ייחודי'
      : "Welcome to a world of design, quality and light you haven't known.\nEvery item is carefully selected to illuminate your home with a unique style.";
  }

  const wallpaperUrl = dict['homepage_wallpaper'];
  const wallpaperUrl2 = dict['homepage_wallpaper_2'];
  const wallpaperUrl3 = dict['homepage_wallpaper_3'];

  const dynamicFont = locale === 'he' ? { fontFamily: '"Oron Tavnit", "Oron", system-ui, sans-serif' } : undefined;

  return (
    <main className="w-full h-[100dvh] overflow-y-scroll overflow-x-hidden snap-y snap-mandatory no-scrollbar scroll-smooth" style={dynamicFont}>
      <HomeHero 
        title={finalTitle} 
        subtitle={finalSubtitle} 
        wallpaperUrl={wallpaperUrl} 
        locale={locale} 
        assistantFontClassName={assistantFont.className} 
      />

      <HomeSecond 
        secondTitle={secondTitle} 
        secondText={secondText} 
        wallpaperUrl2={wallpaperUrl2} 
        locale={locale} 
        assistantFontClassName={assistantFont.className} 
        btnText={tNav('projects')}
      />

      {/* Third Parallax Section & Animated About Text */}
      <AboutSection
        aboutTitle={aboutTitle}
        aboutText={aboutText}
        wallpaperUrl2={wallpaperUrl3}
        locale={locale}
        assistantFontClassName={assistantFont.className}
      />

      <section
        className="w-full snap-start snap-always mt-auto relative z-20"
      >
        {(wallpaperUrl3 || wallpaperUrl2 || wallpaperUrl) && (
          <img src={wallpaperUrl3 || wallpaperUrl2 || wallpaperUrl} alt="Footer Wallpaper" className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0" />
        )}
        {/* Match the bg-black/40 of the previous section and smoothly fade it darker */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70 z-0 pointer-events-none" />

        {/* Fade in the backdrop blur smoothly at the top seam */}
        <div className="absolute inset-0 bg-background/0 backdrop-blur-xl [mask-image:linear-gradient(to_bottom,transparent,black_150px)] pointer-events-none z-0" />

        <div className="relative z-10 w-full h-full">
          <Footer />
        </div>
      </section>
    </main>
  );
}
