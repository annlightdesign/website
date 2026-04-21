import { NextRequest, NextResponse } from 'next/server';
import { userAgent } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { path, source } = await req.json();
    
    const { browser, os, device } = userAgent(req);
    
    // Extract IP and location headers
    // Vercel populates these headers on edge deployments
    const ipStr = req.headers.get('x-forwarded-for');
    const ip = ipStr ? ipStr.split(',')[0] : 'Unknown';
    const safeDecode = (str: string | null) => {
      if (!str) return 'Unknown';
      try { return decodeURIComponent(str); } catch { return str; }
    };
    const country = safeDecode(req.headers.get('x-vercel-ip-country'));
    const city = safeDecode(req.headers.get('x-vercel-ip-city'));
    
    // Basic rate limit or session tracking (optional)
    // To prevent spam, we can check if this IP visited this exact path in the last 15 minutes.
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
    
    const recentVisit = await prisma.visitorLog.findFirst({
      where: {
        ip,
        path,
        createdAt: {
          gte: fifteenMinsAgo
        }
      }
    });

    if (recentVisit) {
      // Already logged recently, return early to save DB rows
      return NextResponse.json({ success: true, logged: false });
    }

    await prisma.visitorLog.create({
      data: {
        ip,
        country,
        city,
        browser: browser.name || 'Unknown',
        os: os.name || 'Unknown',
        device: device.type || 'desktop',
        path: path || '/',
        source: source || null,
      }
    });

    return NextResponse.json({ success: true, logged: true });
  } catch (error) {
    console.error('Error tracking visitor:', error);
    // Don't leak error to client for tracking points
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
