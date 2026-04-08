import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import AnimatedInView from '@/components/AnimatedInView';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const title = locale === 'he' ? 'פרויקטים' : 'Projects';
  return {
    title,
    description: 'Explore our portfolio of architectural lighting design projects.',
  };
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('Projects');
  
  const projects = await prisma.project.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }]
  });

  const settings = await prisma.siteSetting.findMany({
    where: { key: { in: ['projects_title_en', 'projects_title_he', 'projects_subtitle_en', 'projects_subtitle_he', 'projects_wallpaper'] } }
  });
  const sMap = settings.reduce((acc: Record<string, string>, curr) => ({ ...acc, [curr.key]: curr.value }), {});

  const displayTitle = locale === 'he' ? (sMap.projects_title_he || t('title')) : (sMap.projects_title_en || t('title'));
  const displaySubtitle = locale === 'he' ? (sMap.projects_subtitle_he || t('subtitle')) : (sMap.projects_subtitle_en || t('subtitle'));

  return (
    <>
      <main className="relative w-full min-h-screen text-foreground z-10 bg-background">
        <div className="max-w-7xl mx-auto px-6 flex flex-col justify-center min-h-[40vh] md:min-h-[50vh] pt-32 md:pt-40 pb-16 md:pb-24">
          
          {/* Header */}
          <header className="flex flex-col items-center text-center">
            <AnimatedInView delay={0.1} className="flex flex-col items-center">
              <h1 className="text-3xl md:text-5xl font-light uppercase tracking-[0.2em] text-foreground drop-shadow-md">
                {displayTitle}
              </h1>
              <div className="w-12 md:w-32 h-[1px] bg-foreground/20 my-8 md:my-10" />
              <p className="text-lg md:text-xl font-light text-foreground/80 max-w-2xl whitespace-pre-wrap drop-shadow-sm tracking-wide">
                {displaySubtitle}
              </p>
            </AnimatedInView>
          </header>
        </div>

      {/* Projects Gallery Blocks */}
      <div className="w-full flex flex-col border-t border-border mt-12 bg-background">
        {projects.map((project, idx) => {
          const images = project.images as string[];
          const mainImg = images.length > 0 ? images[0] : null;
          const isEven = idx % 2 === 0;

          return (
            <div key={project.id} className={`flex flex-col lg:flex-row w-full bg-background border-b border-border/40 ${!isEven ? 'lg:flex-row-reverse' : ''}`}>
              
              {/* Image Block: 55% width on Desktop */}
              <Link href={`/projects/${project.id}`} className="w-full lg:w-[55%] relative bg-muted group overflow-hidden min-h-[50vh] lg:min-h-[75vh] block flex-shrink-0">
                <AnimatedInView delay={0.1} yOffset={30} className="w-full h-full absolute inset-0">
                  {mainImg ? (
                    <img
                      src={mainImg}
                      alt={project.title}
                      className="w-full h-full object-cover absolute inset-0 transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full absolute inset-0 flex flex-col items-center justify-center bg-muted/50 text-muted-foreground font-light tracking-widest uppercase text-sm">
                      No Image
                    </div>
                  )}
                  {/* Gallery Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-700 flex items-center justify-center">
                    <span className="opacity-0 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-out text-white uppercase tracking-[0.2em] text-sm font-light flex items-center gap-3">
                       <span className="group-hover:-translate-x-2 transition-transform duration-700 delay-100">&rarr;</span> {t('viewProject')}
                    </span>
                  </div>
                </AnimatedInView>
              </Link>

              {/* Text Block: 45% width */}
              <div className="w-full lg:w-[45%] flex items-center justify-center p-12 py-20 lg:p-24 bg-background flex-shrink-0" dir={locale === 'he' ? 'rtl' : 'ltr'}>
                <AnimatedInView delay={0.2} yOffset={30} className="max-w-[320px] w-full flex flex-col mx-auto">
                  
                  {/* Project Title */}
                  <div className="flex flex-col w-full mb-14">
                    <h2 className="text-3xl lg:text-[2.5rem] font-light tracking-[0.18em] uppercase text-foreground leading-[1.1] mb-5">
                      {locale === 'he' && project.titleHe ? project.titleHe : project.title}
                    </h2>
                    <div className="w-16 h-[1px] bg-foreground/20" />
                  </div>
                  
                  {/* Editorial Metadata */}
                  <div className={`flex flex-col w-full gap-10 text-sm font-sans tracking-wide text-foreground ${locale === 'he' ? 'text-right' : 'text-left'}`}>
                    {project.architect && (
                      <div className="flex flex-col gap-1">
                        <span className="font-light text-lg opacity-[0.85]">{project.architect}</span>
                        <span className={`${locale === 'he' ? 'text-[11px]' : 'text-[9px]'} uppercase tracking-[0.15em] opacity-40 text-foreground`}>{t('architect')}</span>
                      </div>
                    )}
                    {project.photographer && (
                      <div className="flex flex-col gap-1">
                        <span className="font-light text-lg opacity-[0.85]">{project.photographer}</span>
                        <span className={`${locale === 'he' ? 'text-[11px]' : 'text-[9px]'} uppercase tracking-[0.15em] opacity-40 text-foreground`}>{t('photographer')}</span>
                      </div>
                    )}
                    {project.lightingConsultant && (
                      <div className="flex flex-col gap-1">
                        <span className="font-light text-lg opacity-[0.85]">{project.lightingConsultant}</span>
                        <span className={`${locale === 'he' ? 'text-[11px]' : 'text-[9px]'} uppercase tracking-[0.15em] opacity-40 text-foreground`}>{t('lightingConsultant')}</span>
                      </div>
                    )}
                    {project.location && (
                      <div className="flex flex-col gap-1">
                        <span className="font-light text-lg opacity-[0.85]">{project.location}</span>
                        <span className={`${locale === 'he' ? 'text-[11px]' : 'text-[9px]'} uppercase tracking-[0.15em] opacity-40 text-foreground`}>{t('location')}</span>
                      </div>
                    )}
                  </div>

                  {/* Mobile-only View Project Button (Desktop handles it via image hover) */}
                  <Link 
                    href={`/projects/${project.id}`}
                    className="lg:hidden mt-16 px-8 py-4 border border-border text-xs uppercase tracking-[0.2em] hover:text-background hover:bg-foreground transition-colors duration-500 w-fit"
                  >
                    {t('viewProject')}
                  </Link>
                </AnimatedInView>
              </div>

            </div>
          );
        })}

      </div>
    </main>
    </>
  );
}
