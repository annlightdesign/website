import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { prisma } from '@/lib/prisma';
import Navigation from '@/components/Navigation';
import AntiTheft from '@/components/AntiTheft';
import TypographyGuardian from '@/components/TypographyGuardian';
import ToasterWrapper from '@/components/ToasterWrapper';
import FooterWrapper from '@/components/FooterWrapper';
import SchemaOrg from '@/components/SchemaOrg';
import VisitorTracker from '@/components/VisitorTracker';
import '../globals.css';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://annlight.co.il';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Ann Light',
    template: '%s | Ann Light'
  },
  description: 'Much more than lighting. Architectural lighting and design studio.',
  openGraph: {
    title: 'Ann Light',
    description: 'Much more than lighting. Architectural lighting and design studio.',
    url: baseUrl,
    siteName: 'Ann Light',
    images: [
      {
        url: '/icon.png',
        width: 935,
        height: 935,
        alt: 'Ann Light Logo'
      }
    ],
    locale: 'he_IL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ann Light',
    description: 'Much more than lighting. Architectural lighting and design studio.',
    images: ['/icon.png'],
  },
  alternates: {
    canonical: baseUrl,
  }
};

export default async function LocaleLayout(
  props: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
  }
) {
  const { locale } = await props.params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  let securityConfig: Record<string, string> = {};
  try {
    const siteSettings = await prisma.siteSetting.findMany({
      where: { OR: [{ key: { startsWith: 'anti_theft_' } }, { key: { startsWith: 'typography_' } }] }
    });
    securityConfig = siteSettings.reduce((acc: Record<string, string>, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
  } catch (e: any) {
    console.error("Layout Prisma Error:", e?.message);
  }

  const isEnabled = securityConfig['anti_theft_enabled'] !== 'false';
  const blockRC = securityConfig['anti_theft_right_click'] !== 'false';
  const blockF12 = securityConfig['anti_theft_f12'] !== 'false';
  const protectHome = securityConfig['anti_theft_home_enabled'] !== 'false';
  const protectCatalog = securityConfig['anti_theft_catalog_enabled'] !== 'false';
  const protectProjects = securityConfig['anti_theft_projects_enabled'] !== 'false';
  const protectContact = securityConfig['anti_theft_contact_enabled'] === 'true'; // Default false
  
  const typeEnabled = securityConfig['typography_enabled'] !== 'false';
  const typeProtectHome = securityConfig['typography_home'] !== 'false';
  const typeProtectCatalog = securityConfig['typography_catalog'] !== 'false';
  const typeProtectProjects = securityConfig['typography_projects'] !== 'false';
  const typeProtectContact = securityConfig['typography_contact'] !== 'false';
  const typeBlockCtrlA = securityConfig['typography_block_ctrl_a'] !== 'false';
  const typeDisableScrollbar = securityConfig['typography_disable_scrollbar'] === 'true';

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Ann Light',
    url: baseUrl,
    logo: `${baseUrl}/icon.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '050-602-2220',
      contactType: 'customer service',
      email: 'ann.light.design@gmail.com',
      availableLanguage: ['Hebrew', 'English']
    }
  };

  return (
    <html lang={locale} dir="ltr">
      <head>
        {typeDisableScrollbar && (
          <style>{`
            ::-webkit-scrollbar {
              display: none;
            }
            * {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
        )}
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <SchemaOrg schema={organizationSchema} />
          <VisitorTracker />
          <TypographyGuardian 
            enabled={typeEnabled}
            protectHome={typeProtectHome}
            protectCatalog={typeProtectCatalog}
            protectProjects={typeProtectProjects}
            protectContact={typeProtectContact}
            blockCtrlA={typeBlockCtrlA}
          />
          <AntiTheft 
            enabled={isEnabled} 
            blockRightClick={blockRC} 
            blockF12={blockF12} 
            protectHome={protectHome}
            protectCatalog={protectCatalog}
            protectProjects={protectProjects}
            protectContact={protectContact}
          />
          <ToasterWrapper />
          <Navigation />
          <div className="flex-1 flex flex-col relative w-full h-full">
            {props.children}
          </div>
          <FooterWrapper />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
