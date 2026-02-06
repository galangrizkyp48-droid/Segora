"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Item } from "@/utils/types";

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    async function fetchItems() {
      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          category:categories(name)
        `)
        .order('created_at', { ascending: false });

      if (data) setItems(data);
    }
    fetchItems();
  }, []);

  return (
    <>
      {/* Header Section */}
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md pb-2">
        {/* Top App Bar */}
        <div className="flex items-center p-4 pb-0 justify-between">
          <div className="flex items-center gap-2">
            <div className="text-primary flex items-center" data-icon="location_on">
              <span className="material-symbols-outlined text-[24px]">location_on</span>
            </div>
            <div>
              <p className="text-[10px] text-[#4c809a] font-medium leading-none uppercase tracking-wider">Lokasi Saya</p>
              <h2 className="text-[#0d171b] dark:text-white text-base font-bold leading-tight">Kampus Pusat, UI</h2>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
              <span className="material-symbols-outlined text-[22px] text-[#0d171b] dark:text-white">notifications</span>
            </button>
          </div>
        </div>
        {/* Search Bar */}
        <div className="px-4 py-3 flex gap-2 items-center">
          <label className="flex flex-col flex-1 h-11">
            <div className="flex w-full flex-1 items-stretch rounded-full h-full bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="text-[#4c809a] flex items-center justify-center pl-4 rounded-l-full" data-icon="search">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                className="form-input flex w-full min-w-0 flex-1 border-none bg-transparent focus:outline-0 focus:ring-0 text-[#0d171b] dark:text-white placeholder:text-[#4c809a] px-3 text-sm font-normal"
                placeholder="Cari apa hari ini?"
                defaultValue=""
              />
            </div>
          </label>
          <button className="flex size-11 items-center justify-center rounded-full bg-primary text-white shadow-md shadow-primary/20">
            <span className="material-symbols-outlined">tune</span>
          </button>
        </div>
        {/* Chips / Categories */}
        <div className="flex gap-2 px-4 py-2 overflow-x-auto no-scrollbar">
          <button className="flex h-9 shrink-0 items-center justify-center gap-x-1 rounded-full bg-primary px-4">
            <p className="text-white text-xs font-semibold">Semua</p>
          </button>
          <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-slate-800 px-4 border border-slate-100 dark:border-slate-700">
            <span className="material-symbols-outlined text-[18px]">print</span>
            <p className="text-[#0d171b] dark:text-white text-xs font-medium">Jasa</p>
          </button>
          <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-slate-800 px-4 border border-slate-100 dark:border-slate-700">
            <span className="material-symbols-outlined text-[18px]">book</span>
            <p className="text-[#0d171b] dark:text-white text-xs font-medium">Buku</p>
          </button>
          <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-slate-800 px-4 border border-slate-100 dark:border-slate-700">
            <span className="material-symbols-outlined text-[18px]">restaurant</span>
            <p className="text-[#0d171b] dark:text-white text-xs font-medium">Makanan</p>
          </button>
          <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-slate-800 px-4 border border-slate-100 dark:border-slate-700">
            <span className="material-symbols-outlined text-[18px]">devices</span>
            <p className="text-[#0d171b] dark:text-white text-xs font-medium">Elektronik</p>
          </button>
        </div>
      </header>
      {/* Main Feed */}
      <main className="px-4 pb-24">
        {items.map((item) => (
          <div key={item.id} className="mb-5 @container">
            <div className="flex flex-col items-stretch justify-start rounded-xl shadow-sm bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 overflow-hidden">
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                    {item.seller_avatar ? (
                      <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url("${item.seller_avatar}")` }}
                      ></div>
                    ) : (
                      <span className="material-symbols-outlined text-[18px] text-primary">person</span>
                    )}
                  </div>
                  <div>
                    <p className="text-[#0d171b] dark:text-white text-xs font-bold leading-none">{item.seller_name}</p>
                    <p className="text-[#4c809a] text-[10px] leading-none mt-0.5">2 jam lalu • {item.seller_major || 'Umum'}</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#4c809a] text-[20px]">more_horiz</span>
              </div>
              <div className="px-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-[16/9] bg-cover rounded-lg"
                  style={{ backgroundImage: `url("${item.image_url}")` }}
                ></div>
              </div>
              <div className="flex w-full grow flex-col items-stretch justify-center gap-1 p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-[#0d171b] dark:text-white text-lg font-bold leading-tight">{item.title}</h3>
                  <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                    {(item as any).category?.name || 'UMUM'}
                  </span>
                </div>
                <div className="mt-1">
                  <p className="text-[#4c809a] dark:text-slate-400 text-sm font-normal leading-relaxed">{item.description}</p>
                  <p className="text-primary text-base font-bold mt-2">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.price)}
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-50 dark:border-slate-800">
                  <button className="flex-1 flex cursor-pointer items-center justify-center rounded-full h-10 px-4 bg-primary text-white text-sm font-bold shadow-md shadow-primary/20">
                    <span className="material-symbols-outlined mr-2 text-[20px]">chat</span>
                    <span className="truncate">Chat Penjual</span>
                  </button>
                  <button className="flex size-10 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 text-[#4c809a]">
                    <span className="material-symbols-outlined">favorite</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-10 text-slate-400">
            <p>Memuat data...</p>
          </div>
        )}
      </main>
      {/* Bottom Navigation Bar (iOS Style) */}
      <nav className="fixed bottom-0 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-100 dark:border-slate-800 px-6 py-2 pb-6 flex justify-between items-center">
        <div className="flex flex-col items-center gap-1 text-primary">
          <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
          <span className="text-[10px] font-bold">Beranda</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-[#4c809a]">
          <Link href="/explore" className="flex flex-col items-center gap-1 text-[#4c809a]">
            <span className="material-symbols-outlined text-[26px]">explore</span>
            <span className="text-[10px] font-medium">Jelajah</span>
          </Link>
        </div>
        <div className="flex flex-col items-center">
          <Link href="/create-offer">
            <div className="bg-primary size-12 rounded-full flex items-center justify-center text-white -mt-8 shadow-lg shadow-primary/30 border-4 border-background-light dark:border-background-dark">
              <span className="material-symbols-outlined text-[28px]">add</span>
            </div>
          </Link>
          <span className="text-[10px] font-medium text-[#4c809a] mt-1">Jual</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-[#4c809a]">
          <span className="material-symbols-outlined text-[26px]">chat_bubble</span>
          <span className="text-[10px] font-medium">Pesan</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-[#4c809a]">
          <span className="material-symbols-outlined text-[26px]">person</span>
          <span className="text-[10px] font-medium">Profil</span>
        </div>
      </nav>

    </>
  );
}
