import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProjectClientView from '@/components/ProjectClientView';
import SchemaOrg from '@/components/SchemaOrg';
import { decodeSlug } from '@/lib/slugs';

export async function generateMetadata({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const { slug, locale } = await params;
  const decodedTitle = decodeSlug(slug);
  
  const project = await prisma.project.findFirst({
    where: { OR: [{ title: { equals: decodedTitle, mode: 'insensitive' } }, { titleHe: decodedTitle }] }
  });

  if (!project) return {};

  const images = (project.images as string[]) || [];
  const mainImage = images.length > 0 ? images[0] : '/favicon.ico';
  const title = locale === 'he' && project.titleHe ? project.titleHe : project.title;
  let description = `${title} - Architectural Lighting Project by Ann Light`;
  
  if (project.location) description += ` located in ${project.location}.`;
  if (project.architect) description += ` Architect: ${project.architect}.`;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://annlight.co.il';
  
  let ogImage = mainImage;
  if (ogImage.includes('cloudinary.com') && ogImage.includes('/upload/')) {
    ogImage = ogImage.replace('/upload/', '/upload/c_scale,w_1200,q_auto/');
  } else if (!ogImage.startsWith('http')) {
    ogImage = `${baseUrl}${ogImage}`;
  }

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Ann Light`,
      description,
      url: `${baseUrl}/${locale}/projects/${slug}`,
      type: 'article',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Ann Light`,
      description,
      images: [ogImage],
    }
  };
}

export default async function SingleProjectPage({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const { slug, locale } = await params;
  const t = await getTranslations('Projects');
  
  const decodedTitle = decodeSlug(slug);
  
  const project = await prisma.project.findFirst({
    where: { OR: [{ title: { equals: decodedTitle, mode: 'insensitive' } }, { titleHe: decodedTitle }] }
  });

  if (!project) notFound();

  const prevProject = await prisma.project.findFirst({
    where: { id: { lt: project.id } },
    orderBy: { id: 'desc' }
  });

  const nextProject = await prisma.project.findFirst({
    where: { id: { gt: project.id } },
    orderBy: { id: 'asc' }
  });

  const images = (project.images as string[]) || [];
  const mainImage = images.length > 0 ? images[0] : '/favicon.ico';
  const title = locale === 'he' && project.titleHe ? project.titleHe : project.title;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://annlight.co.il';

  let schemaImage = mainImage;
  if (schemaImage.includes('cloudinary.com') && schemaImage.includes('/upload/')) {
    schemaImage = schemaImage.replace('/upload/', '/upload/c_scale,w_1200,q_auto/');
  } else if (!schemaImage.startsWith('http')) {
    schemaImage = `${baseUrl}${schemaImage}`;
  }

  const projectSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    image: [schemaImage],
    author: {
      '@type': 'Organization',
      name: 'Ann Light',
      url: baseUrl
    },
    publisher: {
      '@type': 'Organization',
      name: 'Ann Light',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/favicon.ico`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/${locale}/projects/${slug}`
    }
  };

  let titleSize = '72';
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: 'project_title_size' } });
    if (setting?.value) titleSize = setting.value;
  } catch(e) {}

  return (
    <>
      <SchemaOrg schema={projectSchema} />
      <ProjectClientView 
        project={project}
        prevProject={prevProject}
        nextProject={nextProject}
        images={images}
        locale={locale}
        titleSize={titleSize}
        tAbout={t('about')}
        tArchitect={t('architect')}
        tPhotographer={t('photographer')}
        tLightingConsultant={t('lightingConsultant')}
        tLocation={t('location')}
        tBack={t('back')}
      />
    </>
  );
}
