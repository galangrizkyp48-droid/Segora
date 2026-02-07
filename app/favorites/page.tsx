"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";
import BottomNav from "@/components/BottomNav";

interface FavoriteItem {
    id: string;
    item_id: string;
    item: {
        id: string;
        title: string;
        description: string;
        price: number;
        image_url: string;
        seller_name: string;
    };
}

export default function Favorites() {
    const router = useRouter();
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFavorites() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }

            const { data } = await supabase
                .from('favorites')
                .select(`
                    id,
                    item_id,
                    item:items(
                        id,
                        title,
                        description,
                        price,
                        image_url,
                        seller_name
                    )
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (data) {
                setFavorites(data as any);
            }
            setLoading(false);
        }
        fetchFavorites();
    }, [router]);

    const removeFavorite = async (favoriteId: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        await supabase
            .from('favorites')
            .delete()
            .eq('id', favoriteId)
            .eq('user_id', user.id);

        setFavorites(prev => prev.filter(f => f.id !== favoriteId));
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24">
            {/* Header */}
            <header className="bg-white dark:bg-slate-900 shadow-sm p-4 sticky top-0 z-10 flex items-center gap-3">
                <button onClick={() => router.back()} className="text-[#0d171b] dark:text-white">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="text-xl font-bold flex-1">Disukai</h1>
            </header>

            <main className="p-4">
                {loading ? (
                    <div className="text-center py-20">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-500">Loading...</p>
                    </div>
                ) : favorites.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                        {favorites.map((favorite) => (
                            <Link href={`/offer/${favorite.item?.id}`} key={favorite.id}>
                                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-md transition-shadow cursor-pointer relative">
                                    {/* Remove button */}
                                    <button
                                        onClick={(e) => removeFavorite(favorite.id, e)}
                                        className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
                                    >
                                        <span className="material-symbols-outlined text-red-500 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                            favorite
                                        </span>
                                    </button>

                                    <div
                                        className="w-full aspect-square bg-cover bg-center"
                                        style={{ backgroundImage: `url("${favorite.item?.image_url}")` }}
                                    ></div>
                                    <div className="p-3">
                                        <h3 className="font-bold text-sm text-[#0d171b] dark:text-white truncate mb-1">
                                            {favorite.item?.title}
                                        </h3>
                                        <p className="text-primary font-bold text-base">
                                            {new Intl.NumberFormat('id-ID', {
                                                style: 'currency',
                                                currency: 'IDR',
                                                maximumFractionDigits: 0
                                            }).format(favorite.item?.price || 0)}
                                        </p>
                                        <p className="text-xs text-slate-400 truncate mt-1">
                                            {favorite.item?.seller_name}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-slate-400">
                        <span className="material-symbols-outlined text-6xl mb-4 block">favorite</span>
                        <p className="text-lg font-semibold mb-1">Belum ada favorit</p>
                        <p className="text-sm">Klik ikon hati pada item untuk menambahkan ke favorit</p>
                        <Link href="/explore">
                            <button className="mt-6 px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors">
                                Jelajahi Produk
                            </button>
                        </Link>
                    </div>
                )}
            </main>

            <BottomNav />
        </div>
    );
}
