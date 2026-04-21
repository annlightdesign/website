import { prisma } from '@/lib/prisma';

import { BarChart, Monitor, Smartphone, Globe, MapPin, Search, ExternalLink, ArrowRightCircle } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import ClearVisitorsButton from './ClearVisitorsButton';

export const dynamic = 'force-dynamic';

export default async function VisitorsPage() {
  const t = await getTranslations('admin');
  let visitors: any[] = [];
  
  try {
    visitors = await prisma.visitorLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 1000 // Just load last 1000 for performance/memory
    });

    // Mark all unread ones as read when this page is visited
    await prisma.visitorLog.updateMany({
      where: { isRead: false },
      data: { isRead: true }
    });
  } catch (e) {
    console.error("Error loading visitors:", e);
  }

  // Basic aggregates
  const totalVisits = visitors.length;
  const uniqueIPs = new Set(visitors.map(v => v.ip)).size;
  const desktopCount = visitors.filter(v => v.device !== 'mobile' && v.device !== 'tablet').length;
  const mobileCount = visitors.filter(v => v.device === 'mobile' || v.device === 'tablet').length;

  return (
    <div className="p-8 pb-32 animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-light tracking-tight flex items-center gap-3">
            <BarChart className="w-8 h-8 text-muted-foreground" />
            Visitor Analytics
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Monitor real-time site traffic, device details, and geographic locations (Legal IP tracking).
          </p>
        </div>
        <div className="flex-shrink-0 z-50">
          <ClearVisitorsButton />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 p-6 rounded-sm flex flex-col justify-between">
          <Globe className="w-5 h-5 text-blue-500 mb-4" />
          <p className="text-sm text-muted-foreground">Total Page Views</p>
          <p className="text-3xl font-light">{totalVisits}</p>
        </div>
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 p-6 rounded-sm flex flex-col justify-between">
          <Search className="w-5 h-5 text-indigo-500 mb-4" />
          <p className="text-sm text-muted-foreground">Unique IPs</p>
          <p className="text-3xl font-light">{uniqueIPs}</p>
        </div>
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 p-6 rounded-sm flex flex-col justify-between">
          <Monitor className="w-5 h-5 text-emerald-500 mb-4" />
          <p className="text-sm text-muted-foreground">Desktop Hits</p>
          <p className="text-3xl font-light">{desktopCount}</p>
        </div>
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 p-6 rounded-sm flex flex-col justify-between">
          <Smartphone className="w-5 h-5 text-rose-500 mb-4" />
          <p className="text-sm text-muted-foreground">Mobile/Tablet</p>
          <p className="text-3xl font-light">{mobileCount}</p>
        </div>
      </div>

      <div className="bg-card/30 backdrop-blur-md rounded-sm border border-border/50 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">Time (Local)</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Path Visited</th>
                <th className="px-6 py-4 font-medium">Source</th>
                <th className="px-6 py-4 font-medium">Device & Browser</th>
                <th className="px-6 py-4 font-medium">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {visitors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No visitor data available yet.
                  </td>
                </tr>
              ) : (
                visitors.map((v, i) => (
                  <tr key={v.id} className={`border-b border-border/30 transition-colors ${!v.isRead ? 'bg-blue-500/5 hover:bg-blue-500/10 border-l-2 border-l-blue-500' : 'hover:bg-muted/20 border-l-2 border-l-transparent'}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {!v.isRead && <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>}
                        {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(v.createdAt))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        {(() => {
                           const safeDecode = (str: string | null) => {
                             if (!str) return 'Unknown';
                             try { return decodeURIComponent(str); } catch { return str; }
                           };
                           const cityStr = safeDecode(v.city);
                           const countryStr = safeDecode(v.country);
                           return `${cityStr !== 'Unknown' ? `${cityStr}, ` : ''}${countryStr}`;
                        })()}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs truncate max-w-[200px]" title={v.path || '/'}>
                      {v.path}
                    </td>
                    <td className="px-6 py-4 max-w-[150px] truncate">
                      {(() => {
                        if (!v.source) return <span className="text-muted-foreground flex items-center gap-1"><ArrowRightCircle className="w-3 h-3"/> Direct Visit</span>;
                        const lowerSource = v.source.toLowerCase();
                        if (lowerSource.includes('google.com')) return <span className="text-emerald-500 font-medium flex items-center gap-1"><Search className="w-3 h-3"/> Google</span>;
                        if (lowerSource.includes('bing.com')) return <span className="text-blue-500 font-medium flex items-center gap-1"><Search className="w-3 h-3"/> Bing</span>;
                        if (lowerSource.includes('instagram.com') || lowerSource.includes('facebook.com')) return <span className="text-pink-500 font-medium flex items-center gap-1"><ExternalLink className="w-3 h-3"/> Social</span>;
                        
                        try {
                          const url = new URL(v.source);
                          return <a href={v.source} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center gap-1" title={v.source}><ExternalLink className="w-3 h-3"/> {url.hostname.replace('www.', '')}</a>;
                        } catch {
                          return <span className="text-muted-foreground truncate block" title={v.source}>{v.source}</span>;
                        }
                      })()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="capitalize">{v.device === 'unknown' ? 'Desktop' : v.device} • {v.os}</span>
                        <span className="text-xs text-muted-foreground">{v.browser}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                      {v.ip}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
