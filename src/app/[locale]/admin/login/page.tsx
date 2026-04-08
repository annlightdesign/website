"use client";
import { useState } from 'react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      window.location.href = '/he/admin';
    } else {
      alert("Invalid credentials / שגיאה בפרטים");
    }
  }

  return (
    <div className="h-[70vh] flex items-center justify-center">
      <form onSubmit={submit} className="bg-background border border-border p-10 shadow-sm w-96 flex flex-col gap-6">
        <h1 className="text-2xl font-medium font-sans text-center uppercase tracking-widest border-b border-border pb-4">Admin Portal</h1>
        {/*        <p className="text-xs text-muted-foreground text-center">First time Setup active. Use:<br />admin@annlights.com / AnnLight2026</p>*/}
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="border-b border-border p-3 outline-none focus:border-accent text-sm bg-transparent" />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="border-b border-border p-3 outline-none focus:border-accent text-sm bg-transparent" />
        <button type="submit" className="bg-accent text-accent-foreground p-3 mt-4 uppercase font-semibold tracking-wider text-xs hover:opacity-90 transition">Login Securely</button>
      </form>
    </div>
  )
}
