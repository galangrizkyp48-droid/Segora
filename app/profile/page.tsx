"use client";

import BottomNav from "@/components/BottomNav";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Profile() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [mode, setMode] = useState<'buyer' | 'seller'>('buyer');
    const [sellerStats, setSellerStats] = useState({
        activeOffers: 0,
        totalViews: 0,
        avgRating: 5.0
    });

    useEffect(() => {
        async function getUser() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
            } else {
                setUser(user);
                // Fetch profile for is_seller status
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                if (profileData) {
                    setProfile(profileData);
                }
            }
        }
        getUser();
    }, [router]);

    // Fetch seller statistics
    useEffect(() => {
        async function fetchSellerStats() {
            if (!profile?.is_seller || !user) return;

            // Count active offers
            const { count } = await supabase
                .from('items')
                .select('*', { count: 'exact', head: true })
                .eq('seller_id', user.id);

            // Sum total views
            const { data: items } = await supabase
                .from('items')
                .select('views')
                .eq('seller_id', user.id);

            const totalViews = items?.reduce((sum, item) => sum + (item.views || 0), 0) || 0;

            // Calculate average rating from reports
            const { data: ratings } = await supabase
                .from('reports')
                .select('rating')
                .eq('reported_user_id', user.id)
                .not('rating', 'is', null);

            const avgRating = ratings && ratings.length > 0
                ? ratings.reduce((sum, r) => sum + (r.rating || 0), 0) / ratings.length
                : 5.0;

            setSellerStats({
                activeOffers: count || 0,
                totalViews,
                avgRating: Math.round(avgRating * 10) / 10
            });
        }
        fetchSellerStats();
    }, [profile, user]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24">
            <header className="bg-white dark:bg-slate-900 shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
                <h1 className="text-xl font-bold">Profil Saya</h1>
                <button onClick={handleLogout} className="text-red-500 font-bold text-sm">Keluar</button>
            </header>

            <main className="p-4">
                {user && profile ? (
                    <>
                        {/* Profile Header */}
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4 mb-4">
                            <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold">
                                {user.email?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <h2 className="font-bold text-lg">{profile.full_name || user.email}</h2>
                                <p className="text-slate-500 text-sm">{profile.campus || 'Mahasiswa'}</p>
                            </div>
                        </div>

                        {/* Buka Toko CTA (if not seller) */}
                        {!profile.is_seller && (
                            <div className="mb-4">
                                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg overflow-hidden relative">
                                    <div className="absolute right-0 top-0 opacity-10">
                                        <span className="material-symbols-outlined text-[100px]">storefront</span>
                                    </div>
                                    <h3 className="text-lg font-bold relative z-10">Mau Jualan?</h3>
                                    <p className="text-sm text-blue-50 mb-3 relative z-10">Buka tokomu sendiri dan mulai hasilkan uang di kampus.</p>
                                    <Link href="/setup-shop">
                                        <button className="bg-white text-blue-600 px-4 py-2 rounded-full text-sm font-bold shadow-sm hover:scale-105 transition-transform relative z-10">
                                            Buka Toko
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Mode Tabs (if seller) */}
                        {profile.is_seller && (
                            <div className="flex gap-2 mb-4 bg-slate-100 dark:bg-slate-800 p-1 rounded-full">
                                <button
                                    onClick={() => setMode('buyer')}
                                    className={`flex-1 py-2 px-4 rounded-full text-sm font-bold transition-all ${mode === 'buyer'
                                        ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                                        : 'text-slate-500'
                                        }`}
                                >
                                    Pembeli
                                </button>
                                <button
                                    onClick={() => setMode('seller')}
                                    className={`flex-1 py-2 px-4 rounded-full text-sm font-bold transition-all ${mode === 'seller'
                                        ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                                        : 'text-slate-500'
                                        }`}
                                >
                                    Penjual
                                </button>
                            </div>
                        )}

                        {/* Buyer Mode Content */}
                        {mode === 'buyer' && (
                            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                                <Link
                                    href="/purchases"
                                    className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-gray-500">shopping_bag</span>
                                    <div>
                                        <p className="font-semibold text-sm">Riwayat Pembelian</p>
                                        <p className="text-xs text-slate-400">Lihat pesanan kamu</p>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-400 ml-auto">chevron_right</span>
                                </Link>
                                <Link
                                    href="/favorites"
                                    className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-gray-500">favorite</span>
                                    <div>
                                        <p className="font-semibold text-sm">Disukai</p>
                                        <p className="text-xs text-slate-400">Item favorit kamu</p>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-400 ml-auto">chevron_right</span>
                                </Link>
                                <Link
                                    href="/settings"
                                    className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-gray-500">settings</span>
                                    <div>
                                        <p className="font-semibold text-sm">Pengaturan</p>
                                        <p className="text-xs text-slate-400">Kelola akun kamu</p>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-400 ml-auto">chevron_right</span>
                                </Link>
                                <Link
                                    href="https://wa.me/6281315138168?text=Halo%20Tim%20Support%20Segora,%20saya%20ingin%20melaporkan%20masalah%20atau%20memberikan%20saran..."
                                    target="_blank"
                                    className="p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-green-500">support_agent</span>
                                    <div>
                                        <p className="font-semibold text-sm">Hubungi Support</p>
                                        <p className="text-xs text-slate-400">Lapor bug atau saran</p>
                                    </div>
                                </Link>
                            </div>
                        )}

                        {/* Seller Mode Content */}
                        {mode === 'seller' && profile.is_seller && (
                            <div className="space-y-4">
                                {/* Quick Stats */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
                                        <p className="text-2xl font-bold text-primary">{sellerStats.activeOffers}</p>
                                        <p className="text-xs text-slate-500 mt-1">Tawaran Aktif</p>
                                    </div>
                                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
                                        <p className="text-2xl font-bold text-primary">{sellerStats.totalViews}</p>
                                        <p className="text-xs text-slate-500 mt-1">Total Views</p>
                                    </div>
                                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
                                        <p className="text-2xl font-bold text-primary">{sellerStats.avgRating}</p>
                                        <p className="text-xs text-slate-500 mt-1">Rating</p>
                                    </div>
                                </div>

                                {/* Seller Actions */}
                                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                                    <Link href="/dashboard" className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        <span className="material-symbols-outlined text-primary">dashboard</span>
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm">Dashboard Lengkap</p>
                                            <p className="text-xs text-slate-400">Kelola semua tawaran</p>
                                        </div>
                                        <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                                    </Link>
                                    <Link href="/create-offer" className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        <span className="material-symbols-outlined text-green-500">add_circle</span>
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm">Buat Tawaran Baru</p>
                                            <p className="text-xs text-slate-400">Jual produk atau jasa</p>
                                        </div>
                                        <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                                    </Link>
                                    <div
                                        className="p-4 flex items-center gap-3 opacity-60 cursor-not-allowed relative group"
                                    >
                                        <span className="material-symbols-outlined text-blue-500">bar_chart</span>
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm">Statistik Penjualan</p>
                                            <p className="text-xs text-slate-400">Lihat performa toko</p>
                                        </div>
                                        <span className="text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded-full">Segera</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20 text-slate-400">Loading profile...</div>
                )}
            </main>
            <BottomNav />
        </div>
    );
}
