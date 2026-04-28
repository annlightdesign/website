"use client";

import { useState, useEffect } from 'react';
import { Settings, X } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [formData, setFormData] = useState({
    hero_title_en: '',
    hero_title_he: '',
    hero_subtitle_en: '',
    hero_subtitle_he: '',
    about_title_en: '',
    about_title_he: '',
    about_text_en: '',
    about_text_he: '',
    second_title_en: '',
    second_title_he: '',
    second_text_en: '',
    second_text_he: '',
    projects_title_en: '',
    projects_title_he: '',
    projects_subtitle_en: '',
    projects_subtitle_he: '',
    projects_wallpaper: '',
    homepage_wallpaper: '',
    homepage_wallpaper_2: '',
    homepage_wallpaper_3: '',
    contact_wallpaper: '',
    project_title_size: '72',
    construction_catalog: 'true',
    construction_brands: 'true',
    construction_architects: 'true',
    construction_projects: 'true'
  });

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(data => {
      setFormData({
        hero_title_en: data.hero_title_en || '',
        hero_title_he: data.hero_title_he || '',
        hero_subtitle_en: data.hero_subtitle_en || '',
        hero_subtitle_he: data.hero_subtitle_he || '',
        about_title_en: data.about_title_en || '',
        about_title_he: data.about_title_he || '',
        about_text_en: data.about_text_en || '',
        about_text_he: data.about_text_he || '',
        second_title_en: data.second_title_en || 'A New Lighting Experience',
        second_title_he: data.second_title_he || 'חוויה חדשה של תאורה',
        second_text_en: data.second_text_en || "Welcome to a world of design, quality and light you haven't known.\nEvery item is carefully selected to illuminate your home with a unique style.",
        second_text_he: data.second_text_he || 'ברוכים הבאים לעולם של עיצוב, איכות ואור שלא הכרתם\nכל פריט נבחר בקפידה כדי להאיר את הבית שלכם בסטייל ייחודי..',
        projects_title_en: data.projects_title_en || '',
        projects_title_he: data.projects_title_he || '',
        projects_subtitle_en: data.projects_subtitle_en || '',
        projects_subtitle_he: data.projects_subtitle_he || '',
        projects_wallpaper: data.projects_wallpaper || '',
        homepage_wallpaper: data.homepage_wallpaper || '',
        homepage_wallpaper_2: data.homepage_wallpaper_2 || '',
        homepage_wallpaper_3: data.homepage_wallpaper_3 || '',
        contact_wallpaper: data.contact_wallpaper || '',
        project_title_size: data.project_title_size || '72',
        construction_catalog: data.construction_catalog || 'false',
        construction_brands: data.construction_brands || 'false',
        construction_architects: data.construction_architects || 'false',
        construction_projects: data.construction_projects || 'false'
      });
    });
  }, []);

  // Protect against accidental exits
  useEffect(() => {
    (window as any).hasUnsavedAdminChanges = isDirty;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      (window as any).hasUnsavedAdminChanges = false;
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

  const [uploadingWallpaper, setUploadingWallpaper] = useState(false);
  const [uploadingWallpaper2, setUploadingWallpaper2] = useState(false);
  const [uploadingWallpaper3, setUploadingWallpaper3] = useState(false);
  const [uploadingContactWallpaper, setUploadingContactWallpaper] = useState(false);
  const [uploadingProjectsWallpaper, setUploadingProjectsWallpaper] = useState(false);

  const handleWallpaperUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingWallpaper(true);
    const formPayload = new FormData();
    formPayload.append('file', e.target.files[0]);
    
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formPayload });
      const responseData = await res.json();
      if (responseData.url) {
        setFormData(prev => ({ ...prev, homepage_wallpaper: responseData.url }));
        setIsDirty(true);
        toast.success("Wallpaper Staged", { description: "Top Hero Section" });
      } else {
        toast.error("Upload parsing failed");
      }
    } catch (err) {
      toast.error("Failed to upload image");
    }
    setUploadingWallpaper(false);
  };

  const handleWallpaper2Upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingWallpaper2(true);
    const formPayload = new FormData();
    formPayload.append('file', e.target.files[0]);
    
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formPayload });
      const responseData = await res.json();
      if (responseData.url) {
        setFormData(prev => ({ ...prev, homepage_wallpaper_2: responseData.url }));
        setIsDirty(true);
        toast.success("Wallpaper Staged", { description: "Second Section" });
      } else {
        toast.error("Upload parsing failed");
      }
    } catch (err) {
      toast.error("Failed to upload image");
    }
    setUploadingWallpaper2(false);
  };

  const handleWallpaper3Upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingWallpaper3(true);
    const formPayload = new FormData();
    formPayload.append('file', e.target.files[0]);
    
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formPayload });
      const responseData = await res.json();
      if (responseData.url) {
        setFormData(prev => ({ ...prev, homepage_wallpaper_3: responseData.url }));
        setIsDirty(true);
        toast.success("Wallpaper Staged", { description: "About Us Section" });
      } else {
        toast.error("Upload parsing failed");
      }
    } catch (err) {
      toast.error("Failed to upload image");
    }
    setUploadingWallpaper3(false);
  };

  const handleContactWallpaperUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingContactWallpaper(true);
    const formPayload = new FormData();
    formPayload.append('file', e.target.files[0]);
    
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formPayload });
      const responseData = await res.json();
      if (responseData.url) {
        setFormData(prev => ({ ...prev, contact_wallpaper: responseData.url }));
        setIsDirty(true);
        toast.success("Wallpaper Staged", { description: "Contact Page" });
      } else {
        toast.error("Upload parsing failed");
      }
    } catch (err) {
      toast.error("Failed to upload image");
    }
    setUploadingContactWallpaper(false);
  };

  const handleProjectsWallpaperUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingProjectsWallpaper(true);
    const formPayload = new FormData();
    formPayload.append('file', e.target.files[0]);
    
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formPayload });
      const responseData = await res.json();
      if (responseData.url) {
        setFormData(prev => ({ ...prev, projects_wallpaper: responseData.url }));
        setIsDirty(true);
        toast.success("Wallpaper Staged", { description: "Projects Page" });
      } else {
        toast.error("Upload parsing failed");
      }
    } catch (err) {
      toast.error("Failed to upload image");
    }
    setUploadingProjectsWallpaper(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/settings', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      setIsDirty(false);
      toast.success("Network Updated", { description: "All global configurations deployed." });
    } else {
      toast.error("Failed to deploy settings");
    }
    setLoading(false);
  };

  return (
    <div className="w-full h-[75vh] flex flex-col">
      <div className="flex flex-col md:flex-row gap-8 flex-1 overflow-hidden">
              <div className="w-full md:w-1/4 border-r border-border pr-2 flex flex-col gap-1 flex-shrink-0 overflow-y-auto">
                <button type="button" onClick={() => setActiveTab('hero')} className={`text-left px-4 py-3 text-xs uppercase tracking-widest transition-colors border-l-2 ${activeTab === 'hero' ? 'bg-muted border-foreground font-bold' : 'border-transparent hover:bg-muted/50 text-muted-foreground'}`}>
                  Top Hero Section
                </button>
                <button type="button" onClick={() => setActiveTab('second')} className={`text-left px-4 py-3 text-xs uppercase tracking-widest transition-colors border-l-2 ${activeTab === 'second' ? 'bg-muted border-foreground font-bold' : 'border-transparent hover:bg-muted/50 text-muted-foreground'}`}>
                  Second Section
                </button>
                <button type="button" onClick={() => setActiveTab('about')} className={`text-left px-4 py-3 text-xs uppercase tracking-widest transition-colors border-l-2 ${activeTab === 'about' ? 'bg-muted border-foreground font-bold' : 'border-transparent hover:bg-muted/50 text-muted-foreground'}`}>
                  About Us Section
                </button>
                <button type="button" onClick={() => setActiveTab('contact')} className={`text-left px-4 py-3 text-xs uppercase tracking-widest transition-colors border-l-2 ${activeTab === 'contact' ? 'bg-muted border-foreground font-bold' : 'border-transparent hover:bg-muted/50 text-muted-foreground'}`}>
                  Contact Page
                </button>
                <button type="button" onClick={() => setActiveTab('projects')} className={`text-left px-4 py-3 text-xs uppercase tracking-widest transition-colors border-l-2 ${activeTab === 'projects' ? 'bg-muted border-foreground font-bold' : 'border-transparent hover:bg-muted/50 text-muted-foreground'}`}>
                  Projects Page
                </button>
                <button type="button" onClick={() => setActiveTab('visibility')} className={`text-left px-4 py-3 text-xs uppercase tracking-widest transition-colors border-l-2 ${activeTab === 'visibility' ? 'bg-muted border-foreground font-bold' : 'border-transparent hover:bg-muted/50 text-muted-foreground'}`}>
                  Page Visibility
                </button>
              </div>

              <form onSubmit={submit} className="w-full md:w-3/4 flex flex-col flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto pr-4 pb-4">
                  {activeTab === 'hero' && (
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Main Title (EN)</label>
                        <input value={formData.hero_title_en} onChange={e=>setFormData({...formData, hero_title_en: e.target.value})} className="border p-3 outline-none" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Main Title (HE)</label>
                        <input dir="rtl" value={formData.hero_title_he} onChange={e=>setFormData({...formData, hero_title_he: e.target.value})} className="border p-3 outline-none text-right font-sans" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Subtitle (EN)</label>
                        <textarea value={formData.hero_subtitle_en} onChange={e=>setFormData({...formData, hero_subtitle_en: e.target.value})} className="border p-3 outline-none min-h-[100px]" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Subtitle (HE)</label>
                        <textarea dir="rtl" value={formData.hero_subtitle_he} onChange={e=>setFormData({...formData, hero_subtitle_he: e.target.value})} className="border p-3 outline-none text-right font-sans min-h-[100px]" />
                      </div>
                      <div className="flex flex-col gap-2 border-t border-border pt-4 mt-2">
                        <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Homepage Wallpaper (Top Hero)</label>
                        <div className="flex gap-2 items-center">
                          <input type="file" accept="image/*" onChange={handleWallpaperUpload} disabled={uploadingWallpaper} className="border p-3 outline-none flex-1" />
                          {formData.homepage_wallpaper && (
                            <button type="button" onClick={() => setFormData({...formData, homepage_wallpaper: ''})} className="flex-shrink-0 bg-red-500 hover:bg-red-600 text-white p-3 rounded-sm transition-colors" title="Remove Photo">
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                        {uploadingWallpaper && <span className="text-xs text-muted-foreground animate-pulse">Uploading please wait...</span>}
                        {formData.homepage_wallpaper && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            <p className="mb-2">Current Preview:</p>
                            <img src={formData.homepage_wallpaper} className="w-full h-40 object-cover border border-border rounded-sm" alt="Wallpaper Preview" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'second' && (
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Second Section Title (EN)</label>
                        <input value={formData.second_title_en} onChange={e=>setFormData({...formData, second_title_en: e.target.value})} className="border p-3 outline-none" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Second Section Title (HE)</label>
                        <input dir="rtl" value={formData.second_title_he} onChange={e=>setFormData({...formData, second_title_he: e.target.value})} className="border p-3 outline-none text-right font-sans" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Second Section Text (EN)</label>
                        <textarea value={formData.second_text_en} onChange={e=>setFormData({...formData, second_text_en: e.target.value})} className="border p-3 outline-none min-h-[100px]" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Second Section Text (HE)</label>
                        <textarea dir="rtl" value={formData.second_text_he} onChange={e=>setFormData({...formData, second_text_he: e.target.value})} className="border p-3 outline-none text-right font-sans min-h-[100px]" />
                      </div>
                      <div className="flex flex-col gap-2 border-t border-border pt-4 mt-2">
                        <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Homepage Wallpaper 2 (Second Section)</label>
                        <div className="flex gap-2 items-center">
                          <input type="file" accept="image/*" onChange={handleWallpaper2Upload} disabled={uploadingWallpaper2} className="border p-3 outline-none flex-1" />
                          {formData.homepage_wallpaper_2 && (
                            <button type="button" onClick={() => setFormData({...formData, homepage_wallpaper_2: ''})} className="flex-shrink-0 bg-red-500 hover:bg-red-600 text-white p-3 rounded-sm transition-colors" title="Remove Photo">
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                        {uploadingWallpaper2 && <span className="text-xs text-muted-foreground animate-pulse">Uploading please wait...</span>}
                        {formData.homepage_wallpaper_2 && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            <p className="mb-2">Current Preview:</p>
                            <img src={formData.homepage_wallpaper_2} className="w-full h-40 object-cover border border-border rounded-sm" alt="Wallpaper 2 Preview" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'about' && (
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">About Title (EN)</label>
                        <input value={formData.about_title_en} onChange={e=>setFormData({...formData, about_title_en: e.target.value})} placeholder="e.g. ABOUT US" className="border p-3 outline-none" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">About Title (HE)</label>
                        <input dir="rtl" value={formData.about_title_he} onChange={e=>setFormData({...formData, about_title_he: e.target.value})} placeholder="e.g. אודות" className="border p-3 outline-none text-right font-sans" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">About Text (EN)</label>
                        <textarea value={formData.about_text_en} onChange={e=>setFormData({...formData, about_text_en: e.target.value})} className="border p-3 outline-none min-h-[150px]" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">About Text (HE)</label>
                        <textarea dir="rtl" value={formData.about_text_he} onChange={e=>setFormData({...formData, about_text_he: e.target.value})} className="border p-3 outline-none text-right font-sans min-h-[150px]" />
                      </div>
                      <div className="flex flex-col gap-2 border-t border-border pt-4 mt-2">
                        <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Homepage Wallpaper 3 (About Us Section)</label>
                        <div className="flex gap-2 items-center">
                          <input type="file" accept="image/*" onChange={handleWallpaper3Upload} disabled={uploadingWallpaper3} className="border p-3 outline-none flex-1" />
                          {formData.homepage_wallpaper_3 && (
                            <button type="button" onClick={() => setFormData({...formData, homepage_wallpaper_3: ''})} className="flex-shrink-0 bg-red-500 hover:bg-red-600 text-white p-3 rounded-sm transition-colors" title="Remove Photo">
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                        {uploadingWallpaper3 && <span className="text-xs text-muted-foreground animate-pulse">Uploading please wait...</span>}
                        {formData.homepage_wallpaper_3 && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            <p className="mb-2">Current Preview:</p>
                            <img src={formData.homepage_wallpaper_3} className="w-full h-40 object-cover border border-border rounded-sm" alt="Wallpaper 3 Preview" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'contact' && (
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Contact Us Wallpaper (Image)</label>
                        <div className="flex gap-2 items-center">
                          <input type="file" accept="image/*" onChange={handleContactWallpaperUpload} disabled={uploadingContactWallpaper} className="border p-3 outline-none flex-1" />
                          {formData.contact_wallpaper && (
                            <button type="button" onClick={() => setFormData({...formData, contact_wallpaper: ''})} className="flex-shrink-0 bg-red-500 hover:bg-red-600 text-white p-3 rounded-sm transition-colors" title="Remove Photo">
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                        {uploadingContactWallpaper && <span className="text-xs text-muted-foreground animate-pulse">Uploading please wait...</span>}
                        {formData.contact_wallpaper && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            <p className="mb-2">Current Preview:</p>
                            <img src={formData.contact_wallpaper} className="w-full h-40 object-cover border border-border rounded-sm" alt="Contact Wallpaper Preview" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'projects' && (
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Projects Title (EN)</label>
                        <input value={formData.projects_title_en} onChange={e=>setFormData({...formData, projects_title_en: e.target.value})} placeholder="e.g. Selected Projects" className="border p-3 outline-none" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Projects Title (HE)</label>
                        <input dir="rtl" value={formData.projects_title_he} onChange={e=>setFormData({...formData, projects_title_he: e.target.value})} placeholder="e.g. פרויקטים נבחרים" className="border p-3 outline-none text-right font-sans" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Projects Subtitle (EN)</label>
                        <textarea value={formData.projects_subtitle_en} onChange={e=>setFormData({...formData, projects_subtitle_en: e.target.value})} className="border p-3 outline-none min-h-[100px]" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Projects Subtitle (HE)</label>
                        <textarea dir="rtl" value={formData.projects_subtitle_he} onChange={e=>setFormData({...formData, projects_subtitle_he: e.target.value})} className="border p-3 outline-none text-right font-sans min-h-[100px]" />
                      </div>
                      <div className="flex flex-col gap-2 border-t border-border pt-4 mt-2">
                        <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Projects Wallpaper (Background Image)</label>
                        <div className="flex gap-2 items-center">
                          <input type="file" accept="image/*" onChange={handleProjectsWallpaperUpload} disabled={uploadingProjectsWallpaper} className="border p-3 outline-none flex-1" />
                          {formData.projects_wallpaper && (
                            <button type="button" onClick={() => setFormData({...formData, projects_wallpaper: ''})} className="flex-shrink-0 bg-red-500 hover:bg-red-600 text-white p-3 rounded-sm transition-colors" title="Remove Photo">
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                        {uploadingProjectsWallpaper && <span className="text-xs text-muted-foreground animate-pulse">Uploading please wait...</span>}
                        {formData.projects_wallpaper && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            <p className="mb-2">Current Preview:</p>
                            <img src={formData.projects_wallpaper} className="w-full h-40 object-cover border border-border rounded-sm" alt="Projects Wallpaper Preview" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 border-t border-border pt-4 mt-2">
                        <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground flex justify-between">
                          <span>Project View Title Size</span>
                          <span>{formData.project_title_size}px</span>
                        </label>
                        <input type="range" min="32" max="150" step="2" value={formData.project_title_size} onChange={e=>{setFormData({...formData, project_title_size: e.target.value}); setIsDirty(true);}} className="w-full accent-foreground cursor-pointer" />
                        <span className="text-[10px] text-muted-foreground uppercase mt-1 tracking-wider">Slide to dynamically scale the main title on individual project pages</span>
                      </div>
                    </div>
                  )}

                  {activeTab === 'visibility' && (
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-semibold uppercase tracking-widest border-b border-border pb-2">Under Construction Settings</h3>
                        <p className="text-xs text-muted-foreground mb-4">Toggle these switches to hide pages from the public while you prepare content.</p>

                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" checked={formData.construction_catalog === 'true'} onChange={e => {setFormData({...formData, construction_catalog: e.target.checked ? 'true' : 'false'}); setIsDirty(true);}} className="w-5 h-5 accent-foreground cursor-pointer" />
                          <span className="text-sm font-medium uppercase tracking-widest">Hide Catalog Page (Under Construction)</span>
                        </label>
                        
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" checked={formData.construction_brands === 'true'} onChange={e => {setFormData({...formData, construction_brands: e.target.checked ? 'true' : 'false'}); setIsDirty(true);}} className="w-5 h-5 accent-foreground cursor-pointer" />
                          <span className="text-sm font-medium uppercase tracking-widest">Hide Brands Page (Under Construction)</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" checked={formData.construction_architects === 'true'} onChange={e => {setFormData({...formData, construction_architects: e.target.checked ? 'true' : 'false'}); setIsDirty(true);}} className="w-5 h-5 accent-foreground cursor-pointer" />
                          <span className="text-sm font-medium uppercase tracking-widest">Hide Architects Page (Under Construction)</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" checked={formData.construction_projects === 'true'} onChange={e => {setFormData({...formData, construction_projects: e.target.checked ? 'true' : 'false'}); setIsDirty(true);}} className="w-5 h-5 accent-foreground cursor-pointer" />
                          <span className="text-sm font-medium uppercase tracking-widest">Hide Projects Page (Under Construction)</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-border mt-auto flex-shrink-0">
                  <button disabled={loading} type="submit" className="bg-accent text-accent-foreground p-4 text-sm font-medium tracking-widest uppercase font-sans w-full transition-opacity hover:opacity-90">
                    {loading ? "Processing..." : "Deploy Config"}
                  </button>
                </div>
              </form>
      </div>
    </div>
  );
}
