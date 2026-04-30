import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { routing } from '@/i18n/routing';
import { generateSlug } from '@/lib/slugs';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://annlight.co.il';
  const locales = routing.locales;

  // Static routes
  const staticRoutes = [
    '',
    '/about',
    '/projects',
    '/catalog',
    '/architects',
    '/contact'
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add static routes for each locale
  staticRoutes.forEach(route => {
    locales.forEach(locale => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
      });
    });
  });

  // Fetch all projects for dynamic routes
  try {
    const projects = await prisma.project.findMany({
      select: {
        id: true,
        title: true,
        createdAt: true,
      }
    });

    projects.forEach(project => {
      locales.forEach(locale => {
        sitemapEntries.push({
          url: `${baseUrl}/${locale}/projects/${generateSlug(project.title)}`,
          lastModified: project.createdAt, 
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      });
    });
  } catch (error) {
    console.error('Error fetching projects for sitemap:', error);
  }

  return sitemapEntries;
}
