"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Category, Item } from "@/utils/types";
import BottomNav from "@/components/BottomNav";
import FilterModal from "@/components/FilterModal";
import { useRouter } from "next/navigation";

export default function Explore() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [recommendations, setRecommendations] = useState<Item[]>([]);
    const [search, setSearch] = useState("");

    // Filter & Sort State
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filters, setFilters] = useState({
        minPrice: '',
        maxPrice: '',
        minRating: 0,
        location: '',
        sortBy: '' // 'price_asc', 'price_desc', 'rating', 'nearest'
    });

    useEffect(() => {
        async function fetchData() {
            // Fetch Categories
            const { data: catData } = await supabase.from('categories').select('*');
            if (catData) setCategories(catData);

            // Fetch Items with Filters
            const { data: { user } } = await supabase.auth.getUser();

            let query = supabase
                .from('items')
                .select('*');

            // Apply search filter
            if (search) {
                query = query.ilike('title', `%${search}%`);
            }

            // Apply price filters
            if (filters.minPrice) {
                query = query.gte('price', Number(filters.minPrice));
            }
            if (filters.maxPrice) {
                query = query.lte('price', Number(filters.maxPrice));
            }

            // Apply rating filter
            if (filters.minRating > 0) {
                query = query.gte('rating', filters.minRating);
            }

            // Apply location filter
            if (filters.location) {
                query = query.eq('location', filters.location);
            }

            // Apply sorting
            if (filters.sortBy === 'price_asc') {
                query = query.order('price', { ascending: true });
            } else if (filters.sortBy === 'price_desc') {
                query = query.order('price', { ascending: false });
            } else if (filters.sortBy === 'rating') {
                query = query.order('rating', { ascending: false });
            } else {
                query = query.order('created_at', { ascending: false }); // Default: newest first
            }

            query = query.limit(20); // Increase limit for better results

            const { data: itemData } = await query;
            if (itemData) setRecommendations(itemData);
        }
        const timeout = setTimeout(fetchData, 500);
        return () => clearTimeout(timeout);
    }, [search, filters]);

    const handleInteraction = async (action: () => void) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            router.push("/login");
        } else {
            action();
        }
    };

    return (
        <>
            {/* Top App Bar */}
            <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 pt-6 pb-2">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-extrabold tracking-tight">Eksplorasi</h1>
                    <div className="flex gap-3">
                        <button
                            onClick={() => handleInteraction(() => alert('Fitur Cart akan segera hadir!'))}
                            className="p-2 rounded-full bg-slate-200/50 dark:bg-slate-800/50 flex items-center justify-center cursor-pointer hover:bg-slate-300/50 dark:hover:bg-slate-700/50 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[24px]">shopping_cart</span>
                        </button>
                        <button
                            onClick={() => handleInteraction(() => router.push('/profile'))}
                            className="p-2 rounded-full bg-slate-200/50 dark:bg-slate-800/50 flex items-center justify-center cursor-pointer hover:bg-slate-300/50 dark:hover:bg-slate-700/50 transition-colors"
                        >
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
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button
                                onClick={() => setShowFilterModal(true)}
                                className="pr-4 flex items-center justify-center text-slate-400 hover:text-primary transition-colors cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[20px]">tune</span>
                            </button>
                        </div>
                    </label>
                </div>
                {/* Filter Chips */}
                <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
                    <button
                        onClick={() => setShowFilterModal(true)}
                        className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1 ${(filters.minPrice || filters.maxPrice) ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}
                    >
                        <span>Harga</span>
                        <span className="material-symbols-outlined text-[16px]">keyboard_arrow_down</span>
                    </button>
                    <button
                        onClick={() => setShowFilterModal(true)}
                        className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1 ${filters.minRating > 0 ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}
                    >
                        <span>Rating</span>
                        <span className="material-symbols-outlined text-[16px]">star</span>
                    </button>
                    <button
                        onClick={() => setShowFilterModal(true)}
                        className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1 ${filters.location ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}
                    >
                        <span>Lokasi</span>
                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                    </button>
                    <button
                        onClick={() => setFilters(prev => ({ ...prev, sortBy: 'nearest' }))}
                        className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold ${filters.sortBy === 'nearest' ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}
                    >
                        Terdekat
                    </button>
                </div>
            </header>
            <main className="px-4 pb-24">
                {/* Categories Grid */}
                <section className="mt-6">
                    <h3 className="text-lg font-bold mb-4">Kategori</h3>
                    <div className="flex overflow-x-auto gap-4 pb-4 px-1 -mx-1 snap-x no-scrollbar">
                        {categories.length > 0 ? (
                            categories.map((cat) => (
                                <div key={cat.id} className="flex-none w-[70px] flex flex-col items-center gap-2 snap-center">
                                    <div className={`size-14 rounded-full flex items-center justify-center ${cat.color_bg} ${cat.color_text}`}>
                                        <span className="material-symbols-outlined text-[28px]">{cat.icon}</span>
                                    </div>
                                    <span className="text-[11px] font-bold text-center leading-tight">{cat.name}</span>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-4 text-center text-xs text-slate-400 py-4">Kategori belum tersedia.</div>
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
                        {recommendations.length > 0 ? (
                            recommendations.map((item) => (
                                <Link href={`/offer/${item.id}`} key={item.id} className="block">
                                    <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 h-full">
                                        <div className="aspect-square relative">
                                            <div
                                                className="w-full h-full bg-cover bg-center"
                                                style={{ backgroundImage: `url("${item.image_url}")` }}
                                            ></div>
                                            <button
                                                onClick={(e) => { e.preventDefault(); handleInteraction(() => console.log('Fav')); }}
                                                className="absolute top-2 right-2 size-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-full flex items-center justify-center shadow-sm"
                                            >
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
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[10px] text-slate-400 font-medium truncate max-w-[60px]">{item.seller_name}</span>
                                                    {item.location && <span className="text-[8px] text-slate-300 truncate max-w-[80px]">{item.location}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-2 text-center py-10 text-slate-400">
                                <p className="text-xs">Konten belum tersedia.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
            {/* Bottom Navigation Bar */}
            <BottomNav />
            <FilterModal
                showModal={showFilterModal}
                setShowModal={setShowFilterModal}
                filters={filters}
                setFilters={setFilters}
            />
        </>
    );
}
