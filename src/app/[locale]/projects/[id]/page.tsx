import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProjectClientView from '@/components/ProjectClientView';
import SchemaOrg from '@/components/SchemaOrg';

export async function generateMetadata({ params }: { params: Promise<{ id: string, locale: string }> }) {
  const { id, locale } = await params;
  const projectId = parseInt(id, 10);
  
  if (isNaN(projectId)) return {};

  const project = await prisma.project.findUnique({
    where: { id: projectId }
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
      url: `${baseUrl}/${locale}/projects/${id}`,
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

export default async function SingleProjectPage({ params }: { params: Promise<{ id: string, locale: string }> }) {
  const { id, locale } = await params;
  const t = await getTranslations('Projects');
  
  const projectId = parseInt(id, 10);
  const project = await prisma.project.findUnique({
    where: { id: projectId }
  });

  if (!project) notFound();

  const prevProject = await prisma.project.findFirst({
    where: { id: { lt: projectId } },
    orderBy: { id: 'desc' }
  });

  const nextProject = await prisma.project.findFirst({
    where: { id: { gt: projectId } },
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
      '@id': `${baseUrl}/${locale}/projects/${id}`
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
