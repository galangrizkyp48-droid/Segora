"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Category, Item } from "@/utils/types";

export default function Explore() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [recommendations, setRecommendations] = useState<Item[]>([]);

    useEffect(() => {
        async function fetchData() {
            // Fetch Categories
            const { data: catData } = await supabase.from('categories').select('*');
            if (catData) setCategories(catData);

            // Fetch Items (Recommendations)
            const { data: itemData } = await supabase
                .from('items')
                .select('*')
                .order('rating', { ascending: false }) // Recommend highly rated
                .limit(4);
            if (itemData) setRecommendations(itemData);
        }
        fetchData();
    }, []);

    return (
        <>
            {/* Top App Bar */}
            <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 pt-6 pb-2">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-extrabold tracking-tight">Eksplorasi</h1>
                    <div className="flex gap-3">
                        <button className="p-2 rounded-full bg-slate-200/50 dark:bg-slate-800/50 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[24px]">shopping_cart</span>
                        </button>
                        <button className="p-2 rounded-full bg-slate-200/50 dark:bg-slate-800/50 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[24px]">notifications</span>
                        </button>
                    </div>
                </div>
                {/* Search Bar */}
                <div className="mb-4">
                    <label className="flex flex-col w-full">
                        <div className="flex w-full items-stretch rounded-full h-12 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700">
                            <div className="text-primary flex items-center justify-center pl-4">
                                <span className="material-symbols-outlined text-[22px]">search</span>
                            </div>
                            <input
                                className="form-input flex w-full min-w-0 flex-1 border-none bg-transparent focus:outline-0 focus:ring-0 h-full placeholder:text-slate-400 text-base font-medium px-3"
                                placeholder="Cari jasa atau produk..."
                            />
                            <button className="pr-4 flex items-center justify-center text-slate-400">
                                <span className="material-symbols-outlined text-[20px]">tune</span>
                            </button>
                        </div>
                    </label>
                </div>
                {/* Filter Chips */}
                <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
                    <button className="whitespace-nowrap px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold flex items-center gap-1">
                        <span>Harga</span>
                        <span className="material-symbols-outlined text-[16px]">keyboard_arrow_down</span>
                    </button>
                    <button className="whitespace-nowrap px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold flex items-center gap-1">
                        <span>Rating</span>
                        <span className="material-symbols-outlined text-[16px]">star</span>
                    </button>
                    <button className="whitespace-nowrap px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold flex items-center gap-1">
                        <span>Lokasi</span>
                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                    </button>
                    <button className="whitespace-nowrap px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold">
                        Terdekat
                    </button>
                </div>
            </header>
            <main className="px-4 pb-24">
                {/* Categories Grid */}
                <section className="mt-6">
                    <h3 className="text-lg font-bold mb-4">Kategori</h3>
                    <div className="grid grid-cols-4 gap-4">
                        {categories.length > 0 ? categories.map((cat) => (
                            <div key={cat.id} className="flex flex-col items-center gap-2">
                                <div className={`size-14 rounded-full flex items-center justify-center ${cat.color_bg} ${cat.color_text}`}>
                                    <span className="material-symbols-outlined text-[28px]">{cat.icon}</span>
                                </div>
                                <span className="text-[11px] font-bold text-center leading-tight">{cat.name}</span>
                            </div>
                        )) : (
                            <div className="col-span-4 text-center text-xs text-slate-400">Loading categories...</div>
                        )}
                    </div>
                </section>
                {/* Trending Section */}
                <section className="mt-8">
                    <h3 className="text-lg font-bold mb-4">Sedang Tren</h3>
                    <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                        <div className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center gap-1">
                            <span className="text-primary font-bold">#</span>
                            <span className="text-sm font-bold">TugasAkhir</span>
                        </div>
                        <div className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center gap-1">
                            <span className="text-primary font-bold">#</span>
                            <span className="text-sm font-bold">SewaKamera</span>
                        </div>
                        <div className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center gap-1">
                            <span className="text-primary font-bold">#</span>
                            <span className="text-sm font-bold">MateriUjian</span>
                        </div>
                        <div className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center gap-1">
                            <span className="text-primary font-bold">#</span>
                            <span className="text-sm font-bold">Wisuda</span>
                        </div>
                    </div>
                </section>
                {/* Feed / Discovery Section */}
                <section className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">Rekomendasi Untukmu</h3>
                        <button className="text-primary text-sm font-bold">Lihat Semua</button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {recommendations.length > 0 ? recommendations.map((item) => (
                            <div key={item.id} className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700">
                                <div className="aspect-square relative">
                                    <div
                                        className="w-full h-full bg-cover bg-center"
                                        style={{ backgroundImage: `url("${item.image_url}")` }}
                                    ></div>
                                    <button className="absolute top-2 right-2 size-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-full flex items-center justify-center shadow-sm">
                                        <span className="material-symbols-outlined text-[18px]">favorite</span>
                                    </button>
                                </div>
                                <div className="p-3">
                                    <h4 className="font-bold text-sm line-clamp-2 mb-1">{item.title}</h4>
                                    <div className="flex items-center gap-1 mb-2">
                                        <span className="material-symbols-outlined text-[14px] text-yellow-400 fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        <span className="text-[12px] font-bold">{item.rating || 0}</span>
                                        <span className="text-[12px] text-slate-400 font-medium">({item.reviews_count || 0})</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-primary font-extrabold text-sm">
                                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.price)}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-medium truncate max-w-[60px]">{item.seller_name}</span>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-2 text-center text-xs text-slate-400">Loading recommendations...</div>
                        )}
                    </div>
                </section>
            </main>
            {/* Bottom Navigation Bar */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-6 py-3 pb-8 z-50">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex flex-col items-center gap-1 text-slate-400">
                        <span className="material-symbols-outlined text-[24px]">home</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider">Home</span>
                    </Link>
                    <button className="flex flex-col items-center gap-1 text-primary">
                        <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider">Eksplor</span>
                    </button>
                    <div className="relative -top-6">
                        <button className="size-14 rounded-full bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[32px]">add</span>
                        </button>
                    </div>
                    <button className="flex flex-col items-center gap-1 text-slate-400">
                        <span className="material-symbols-outlined text-[24px]">forum</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider">Pesan</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 text-slate-400">
                        <span className="material-symbols-outlined text-[24px]">person</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider">Profil</span>
                    </button>
                </div>
            </nav>
        </>
    );
}
