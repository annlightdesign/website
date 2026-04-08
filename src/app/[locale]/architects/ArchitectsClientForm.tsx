"use client";

import { Send } from 'lucide-react';
import { useState } from 'react';

import { submitArchitectLead } from '@/app/actions/architects';

export default function ArchitectsClientForm({ t, locale }: { t: any, locale?: string }) {
  const [submitted, setSubmitted] = useState(false);

  const handleAction = async (formData: FormData) => {
    const res = await submitArchitectLead(formData);
    if(res.success) {
      setSubmitted(true);
    } else {
      alert("Something went wrong saving the details. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="w-full text-center lg:text-left pt-6 lg:pt-16">
        <h2 className="text-3xl font-light tracking-widest text-foreground uppercase">Thank You</h2>
        <p className="text-muted-foreground mt-4 font-light text-lg">Your information was received. We will be in touch.</p>
      </div>
    );
  }

  return (
    <form className="w-full flex flex-col gap-12 mt-4 lg:mt-6" action={handleAction}>
      
      <h2 className="text-2xl font-light tracking-[0.1em] text-foreground max-w-[420px] leading-relaxed mt-2 lg:mt-3">
        {t.formTitle}
      </h2>

      <div className="flex flex-col gap-10 w-full mb-4">
        
        <input 
          type="text" 
          name="name" 
          required 
          placeholder={t.namePlaceholder} 
          className={`w-full bg-transparent border-b border-muted-foreground/30 pb-3 outline-none text-foreground font-light text-lg focus:border-foreground transition-colors placeholder:text-muted-foreground/50 ${locale === 'he' ? 'text-right' : 'text-left'}`}
        />
        
        <input 
          type="tel" 
          name="phone" 
          required 
          placeholder={t.phonePlaceholder} 
          dir="auto"
          className={`w-full bg-transparent border-b border-muted-foreground/30 pb-3 outline-none text-foreground font-light text-lg focus:border-foreground transition-colors placeholder:text-muted-foreground/50 ${locale === 'he' ? 'text-right' : 'text-left'}`}
        />

        <input 
          type="email" 
          name="email" 
          required
          placeholder={t.emailPlaceholder} 
          className={`w-full bg-transparent border-b border-muted-foreground/30 pb-3 outline-none text-foreground font-light text-lg focus:border-foreground transition-colors placeholder:text-muted-foreground/50 ${locale === 'he' ? 'text-right' : 'text-left'}`}
        />

      </div>

      <div className="flex flex-col items-start gap-8 mt-4">
         <button 
            type="submit" 
            className="group flex items-center gap-4 text-sm font-light uppercase tracking-[0.25em] text-foreground hover:opacity-100 transition-all border-b border-transparent hover:border-foreground/40 pb-1 whitespace-nowrap"
          >
            {t.sendRequest} <span className={`transition-transform duration-500 font-normal ${locale === 'he' ? 'group-hover:-translate-x-2' : 'group-hover:translate-x-2'}`}>{locale === 'he' ? <>&larr;</> : <>&rarr;</>}</span>
         </button>
         
         <span className="text-[10px] uppercase opacity-30 text-foreground tracking-widest">
            {t.privacyPolicy}
         </span>
      </div>
    </form>
  );
}
