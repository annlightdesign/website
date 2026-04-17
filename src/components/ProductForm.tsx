"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';

import SortableImageList from '@/components/SortableImageList';
import ConfirmModal from '@/components/ConfirmModal';

export default function ProductForm({ existingProduct }: { existingProduct?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [mounted, setMounted] = useState(false);
  const defaultSpecs = existingProduct?.specifications || {};
  const [specifications, setSpecifications] = useState<{key: string, value: string}[]>(
    Object.entries(defaultSpecs).map(([key, value]) => ({ key, value: String(value) }))
  );
  const [showJson, setShowJson] = useState(false);
  const [rawJson, setRawJson] = useState(JSON.stringify(defaultSpecs, null, 2));
  
  const [formData, setFormData] = useState<{
    title: string;
    titleHe: string;
    description: string;
    categoryIds: string[];
    images: string[];
  }>({
    title: existingProduct?.title || '',
    titleHe: existingProduct?.titleHe || '',
    description: existingProduct?.description || '',
    categoryIds: existingProduct?.categories?.map((c: any) => c.id.toString()) || [],
    images: (existingProduct?.images as string[]) || []
  });

  const [categories, setCategories] = useState<{id: number, name: string}[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Handle automatic opening via URL parameter, useful immediately after duplicating a product
  useEffect(() => {
    if (existingProduct?.id && searchParams?.get('edit') === existingProduct.id.toString()) {
      setIsOpen(true);
      // Clean up the URL parameter without a hard refresh
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('edit');
      router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
    }
  }, [searchParams, existingProduct, pathname, router]);

  // Track global unsaved state
  useEffect(() => {
    setMounted(true);
    (window as any).hasUnsavedAdminChanges = isDirty;
    return () => { (window as any).hasUnsavedAdminChanges = false; };
  }, [isDirty]);

  useEffect(() => {
    fetch('/api/categories').then(res => res.json()).then(data => {
      if (data.success) {
         setCategories(data.categories);
         if (!existingProduct?.categories?.length && data.categories.length > 0 && formData.categoryIds.length === 0) {
            // Auto-select the first category if none is selected
            setFormData(prev => ({ ...prev, categoryIds: [data.categories[0].id.toString()] }));
         }
      }
    }).catch(() => {});
  }, [existingProduct]);

  // Lock background scrolling while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const processFiles = async (filesArray: File[]) => {
    if (filesArray.length === 0) return;
    setLoading(true);
    
    try {
      const uploadPromises = filesArray.map(async (file) => {
        const data = new FormData();
        data.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: data });
        if (!res.ok) {
           const errText = await res.text();
           throw new Error(errText || res.statusText);
        }
        const { url } = await res.json();
        return url;
      });
      
      const results = await Promise.all(uploadPromises);
      const validUrls = results.filter(url => typeof url === 'string');
      
      if (validUrls.length > 0) {
        setFormData(prev => ({ ...prev, images: [...prev.images, ...validUrls] }));
        setIsDirty(true);
      }
    } catch (err: any) {
      toast.error("Upload failed.", { description: err.message || "Ensure Cloudinary is configured." });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Prepare specs
    let specs = {};
    if (showJson) {
      try {
        specs = JSON.parse(rawJson);
      } catch (e) {
        toast.error("Invalid JSON format in specifications.");
        setLoading(false);
        return;
      }
    } else {
      specs = specifications.reduce((acc, curr) => {
        const k = curr.key.trim();
        if (k) acc[k] = curr.value;
        return acc;
      }, {} as Record<string, string>);
    }

    const isEdit = !!existingProduct;
    const url = isEdit ? `/api/products/${existingProduct.id}` : '/api/products';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        specifications: specs
      })
    });

    if (res.ok) {
      toast.success("Product published!");
      setIsDirty(false);
      setIsOpen(false);
      window.location.reload();
    } else {
      const errText = await res.text();
      toast.error("Publish failed", { description: errText });
    }
    setLoading(false);
  }

  const handleClose = () => {
    if (isDirty) {
      setIsConfirmOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const confirmExit = () => {
    setIsConfirmOpen(false);
    setIsDirty(false);
    setIsOpen(false);
  };

  return (
    <>
      {existingProduct ? (
        <button onClick={() => setIsOpen(true)} className="text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground">
          Edit
        </button>
      ) : (
        <button onClick={() => setIsOpen(true)} className="bg-transparent border border-border text-foreground px-6 py-3 uppercase text-sm font-medium tracking-widest font-sans hover:bg-muted transition flex items-center gap-2">
          + Compile Product
        </button>
      )}

      {mounted && isOpen && createPortal(
        <div className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-border p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
              <h2 className="text-xl font-medium uppercase tracking-widest font-sans">New Product</h2>
              <button onClick={handleClose}><X className="w-6 h-6 hover:text-muted-foreground" /></button>
            </div>

            <form onSubmit={submit} className="flex flex-col gap-5 text-sm">
              <input required placeholder="Title" value={formData.title} onChange={e=>{setFormData({...formData, title: e.target.value}); setIsDirty(true);}} className="border border-border bg-background p-3 outline-none" />
              <input placeholder="Hebrew Title (Optional)" value={formData.titleHe} onChange={e=>{setFormData({...formData, titleHe: e.target.value}); setIsDirty(true);}} className="border border-border bg-background p-3 outline-none text-right" dir="auto" />
              <textarea placeholder="Description" value={formData.description} onChange={e=>{setFormData({...formData, description: e.target.value}); setIsDirty(true);}} className="border border-border bg-background p-3 outline-none min-h-[100px]" />
              
              <label 
                className={`border p-6 min-h-[180px] flex flex-col items-center justify-center border-dashed transition-all duration-200 gap-4 cursor-pointer hover:bg-muted/5 ${isDragging ? 'border-foreground bg-muted/10' : 'border-border'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className={`w-8 h-8 ${isDragging ? 'text-foreground' : 'text-muted-foreground'}`} />
                <span className="text-muted-foreground font-semibold uppercase tracking-widest text-xs text-center border-b border-transparent hover:border-muted-foreground transition-colors pb-1">
                  {isDragging ? 'Drop Photos Now' : 'Drag & Drop or Click to Browse'}
                </span>
                <input type="file" multiple onChange={handleImageUpload} disabled={loading} className="hidden" />
              </label>
              
              <div className="my-2">
                <SortableImageList 
                  images={formData.images} 
                  onChange={(newImages) => { setFormData(prev => ({ ...prev, images: newImages })); setIsDirty(true); }} 
                />
              </div>

              <div className="flex flex-col gap-3 border-t border-border pt-4">
                <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Catalogs</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => {
                    const isSelected = formData.categoryIds.includes(cat.id.toString());
                    return (
                      <label 
                        key={cat.id} 
                        className={`cursor-pointer border px-3 py-2 text-xs font-medium uppercase tracking-wider transition-colors ${isSelected ? 'border-foreground bg-foreground text-background' : 'border-border bg-background text-muted-foreground hover:border-muted-foreground'}`}
                      >
                        <input 
                          type="checkbox" 
                          className="hidden"
                          checked={isSelected}
                          onChange={(e) => {
                            let newIds = [...formData.categoryIds];
                            if (e.target.checked) {
                              newIds.push(cat.id.toString());
                            } else {
                              newIds = newIds.filter(id => id !== cat.id.toString());
                            }
                            setFormData({ ...formData, categoryIds: newIds });
                            setIsDirty(true);
                          }} 
                        />
                        {cat.name}
                      </label>
                    );
                  })}
                </div>
                {formData.categoryIds.length === 0 && (
                  <span className="text-xs text-red-500 mt-1">Please select at least one catalog.</span>
                )}
              </div>

              <div className="flex flex-col gap-4 border-t border-border pt-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Specifications</label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                    <input type="checkbox" checked={showJson} onChange={(e) => {
                      if (e.target.checked) {
                        // Switching to JSON mode: build JSON from inputs
                        const specsObj = specifications.reduce((acc, curr) => {
                          const k = curr.key.trim();
                          if (k) acc[k] = curr.value;
                          return acc;
                        }, {} as Record<string, string>);
                        setRawJson(JSON.stringify(specsObj, null, 2));
                      } else {
                        // Switching to Builder mode: parse JSON to inputs
                        try {
                          const parsed = JSON.parse(rawJson);
                          setSpecifications(Object.entries(parsed).map(([k, v]) => ({ key: k, value: String(v) })));
                        } catch (err) {}
                      }
                      setShowJson(e.target.checked);
                    }} className="accent-foreground" />
                    Advanced: Edit Raw JSON
                  </label>
                </div>
                
                {showJson ? (
                  <textarea 
                    value={rawJson}
                    onChange={(e) => { setRawJson(e.target.value); setIsDirty(true); }}
                    className="border border-border bg-background p-4 outline-none font-mono text-xs min-h-[200px]"
                    dir="ltr"
                    placeholder='{
  "קוטר": "68 מ\"מ",
  "זווית הארה": "24°"
}'
                  />
                ) : (
                  <div className="flex flex-col gap-2">
                    {specifications.map((spec, index) => (
                      <div key={index} className="flex gap-2 relative group">
                        <input 
                          list="spec-keys"
                          placeholder="Key (e.g. קוטר)"
                          value={spec.key}
                          onChange={e => {
                            const newSpecs = [...specifications];
                            newSpecs[index].key = e.target.value;
                            setSpecifications(newSpecs);
                            setIsDirty(true);
                          }}
                          className="border p-3 outline-none flex-1 font-mono text-xs text-right"
                          dir="rtl"
                        />
                        <input 
                          placeholder="Value (e.g. 68 מ''מ)"
                          value={spec.value}
                          onChange={e => {
                            const newSpecs = [...specifications];
                            newSpecs[index].value = e.target.value;
                            setSpecifications(newSpecs);
                            setIsDirty(true);
                          }}
                          className="border p-3 outline-none flex-1 font-mono text-xs text-right"
                          dir="rtl"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newSpecs = specifications.filter((_, i) => i !== index);
                            setSpecifications(newSpecs);
                            setIsDirty(true);
                          }}
                          className="opacity-0 group-hover:opacity-100 flex items-center justify-center px-3 hover:bg-muted text-muted-foreground transition-opacity"
                          aria-label="Remove specification"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={() => {
                        setSpecifications([...specifications, { key: '', value: '' }]);
                        setIsDirty(true);
                      }}
                      className="mt-2 text-xs uppercase tracking-widest border border-dashed border-border p-3 hover:bg-muted/50 transition-colors text-muted-foreground"
                    >
                      + Add Specification
                    </button>

                    <datalist id="spec-keys">
                      <option value="צבע" />
                      <option value="גוון אור" />
                      <option value="הספק" />
                      <option value="קוטר" />
                      <option value="עומק" />
                      <option value="קדח" />
                      <option value="חומר" />
                      <option value="מתח" />
                      <option value="ערך IP" />
                      <option value="ערך Lumen" />
                      <option value="ערך CRI" />
                      <option value="זווית הארה" />
                      <option value="סוג לד" />
                      <option value="סוג דרייבר" />
                      <option value="בית נורה" />
                      <option value="ניתן לעמעום" />
                    </datalist>
                  </div>
                )}
              </div>

              <button disabled={loading || formData.categoryIds.length === 0} type="submit" className="bg-accent text-accent-foreground p-4 mt-2 uppercase font-medium tracking-widest w-full font-sans transition-opacity hover:opacity-90 disabled:opacity-50">
                {loading ? "Processing..." : "Publish to Database"}
              </button>
            </form>
          </div>
        </div>
      , document.body)}

      {mounted && createPortal(
        <ConfirmModal 
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={confirmExit}
          title="Discard Changes?"
          message="You have unsaved selections in your product configuration. Are you sure you want to discard them and exit?"
          confirmText="Discard"
          confirmStyle="neutral"
        />,
        document.body
      )}
    </>
  );
}
