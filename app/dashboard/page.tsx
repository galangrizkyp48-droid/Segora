"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Item } from "@/utils/types";
import BottomNav from "@/components/BottomNav";

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        const checkUserAndFetchItems = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/login");
                return;
            }
            setUser(session.user);

            // Check if user is a seller
            const { data: profile } = await supabase
                .from('profiles')
                .select('is_seller, shop_name')
                .eq('id', session.user.id)
                .single();

            setProfile(profile);

            if (!profile?.is_seller) {
                router.replace("/profile");
                return;
            }

            // Fetch items using consistent logic (or better, use seller_id if column exists)
            // For now, continue matching by seller_name derived from email to keep sync with CreateOffer
            const sellerName = session.user.email?.split('@')[0] || "";

            const { data } = await supabase
                .from('items')
                .select('*')
                .ilike('seller_name', sellerName); // Case insensitive match

            if (data) {
                setItems(data);
            }
            setLoading(false);
        };
        checkUserAndFetchItems();
    }, [router]);

    if (loading) return null; // Or a loading spinner

    return (
        <div className="bg-background-light dark:bg-background-dark text-[#0d171b] dark:text-slate-100 min-h-screen font-display">
            <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden max-w-md mx-auto bg-white dark:bg-background-dark shadow-xl">
                {/* TopAppBar */}
                <div className="flex items-center bg-white dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-50 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                        <button onClick={() => router.push('/')} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <span className="material-symbols-outlined text-[#0d171b] dark:text-white">arrow_back</span>
                        </button>
                        <div className="flex size-10 shrink-0 items-center">
                            <div
                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 border border-slate-200"
                                style={{ backgroundImage: user?.user_metadata?.avatar_url ? `url("${user.user_metadata.avatar_url}")` : 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCvk-6Jvm93jiMeEljFbaOwYBHYDHWReM0g6LcylWJUXVUU-_BB-Nir7f_QYT4J7fwuZP7VB6hlv3l648L_eeGk9xoMcY3kq7jF77b02lKXO2Gq7H3l4v26A2IDjkdNGXb511uVvhVGyta84xn7nV73LB7EuqMVYEs6zUgrWsbPYgWcxSLvTJwI7D-sOJDep30BhpxcZLNo3W6FEZQxSje_qb7iBvZy61p-VMzRwi_uQ0N4TM9eTXS89cmi_YP-hKnsD8CdC84E-JI")' }}
                            >
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 px-3">
                        <p className="text-xs text-slate-500 font-medium">Halo, {profile?.shop_name || user?.email?.split('@')[0]}!</p>
                        <h2 className="text-[#0d171b] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Dashboard Penjual</h2>
                    </div>
                    <div className="flex w-12 items-center justify-end">
                        <button onClick={() => router.push('/profile')} className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 shadow-sm text-[#0d171b] dark:text-white hover:bg-slate-200 transition-colors" title="Kembali ke Mode Pembeli">
                            <span className="material-symbols-outlined">person</span>
                        </button>
                    </div>
                </div>

                {/* Ringkasan Performa Section */}
                <h2 className="text-[#0d171b] dark:text-white text-[20px] font-bold leading-tight tracking-[-0.015em] px-4 pt-4">Ringkasan Performa</h2>
                <div className="flex flex-wrap gap-3 p-4">
                    <div className="flex min-w-[110px] flex-1 flex-col gap-1 rounded-xl p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                        <p className="text-slate-500 text-xs font-medium leading-normal uppercase tracking-wider">Dilihat</p>
                        <p className="text-[#0d171b] dark:text-white tracking-light text-2xl font-bold leading-tight">0</p>
                        <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm text-slate-300">remove</span>
                            <p className="text-slate-400 text-xs font-semibold">-</p>
                        </div>
                    </div>
                    <div className="flex min-w-[110px] flex-1 flex-col gap-1 rounded-xl p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                        <p className="text-slate-500 text-xs font-medium leading-normal uppercase tracking-wider">Prospek</p>
                        <p className="text-[#0d171b] dark:text-white tracking-light text-2xl font-bold leading-tight">0</p>
                        <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm text-slate-300">remove</span>
                            <p className="text-slate-400 text-xs font-semibold">-</p>
                        </div>
                    </div>
                    <div className="flex min-w-[110px] flex-1 flex-col gap-1 rounded-xl p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                        <p className="text-slate-500 text-xs font-medium leading-normal uppercase tracking-wider">Penjualan</p>
                        <p className="text-[#0d171b] dark:text-white tracking-light text-2xl font-bold leading-tight">0</p>
                        <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm text-slate-300">remove</span>
                            <p className="text-slate-400 text-xs font-semibold">-</p>
                        </div>
                    </div>
                </div>

                {/* Segora Plus Banner Card */}
                <div className="px-4 @container">
                    <div className="flex flex-col items-stretch justify-start rounded-xl shadow-md bg-gradient-to-br from-[#2badee] to-[#1a8bc4] text-white p-5 relative overflow-hidden">
                        <div className="absolute -right-10 -top-10 size-40 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="material-symbols-outlined">stars</span>
                                <p className="text-lg font-bold leading-tight tracking-[-0.015em]">Segora Plus</p>
                            </div>
                            <p className="text-white/90 text-sm font-normal leading-snug mb-4">Tingkatkan visibilitas jualanmu hingga 5x lipat dengan fitur premium untuk mahasiswa.</p>
                            <Link href="/boost">
                                <button
                                    className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-white text-primary text-sm font-bold leading-normal transition-transform active:scale-95 shadow-lg"
                                >
                                    <span className="truncate">Langganan Sekarang</span>
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Menu Cepat Section */}
                <h2 className="text-[#0d171b] dark:text-white text-[20px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-6">Menu Cepat</h2>
                <div className="grid grid-cols-2 gap-3 px-4 pb-4">
                    <div className="flex flex-1 gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-4 items-center shadow-sm opacity-60 cursor-not-allowed relative group">
                        <div className="bg-primary/10 p-2 rounded-lg text-primary">
                            <span className="material-symbols-outlined">analytics</span>
                        </div>
                        <h2 className="text-[#0d171b] dark:text-white text-sm font-bold leading-tight">Analitik</h2>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/5 dark:bg-black/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-xs text-white bg-black/70 px-2 py-1 rounded">Segera Hadir</span>
                        </div>
                    </div>
                    <div className="flex flex-1 gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-4 items-center shadow-sm opacity-60 cursor-not-allowed relative group">
                        <div className="bg-primary/10 p-2 rounded-lg text-primary">
                            <span className="material-symbols-outlined">reviews</span>
                        </div>
                        <h2 className="text-[#0d171b] dark:text-white text-sm font-bold leading-tight">Ulasan</h2>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/5 dark:bg-black/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-xs text-white bg-black/70 px-2 py-1 rounded">Segera Hadir</span>
                        </div>
                    </div>
                    <Link href="/messages" className="flex flex-1 gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 items-center shadow-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <div className="bg-primary/10 p-2 rounded-lg text-primary">
                            <span className="material-symbols-outlined">forum</span>
                        </div>
                        <h2 className="text-[#0d171b] dark:text-white text-sm font-bold leading-tight">Pesan</h2>
                    </Link>
                    <div onClick={() => router.push(`/seller/${user?.id}`)} className="flex flex-1 gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 items-center shadow-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <div className="bg-primary/10 p-2 rounded-lg text-primary">
                            <span className="material-symbols-outlined">storefront</span>
                        </div>
                        <h2 className="text-[#0d171b] dark:text-white text-sm font-bold leading-tight">Toko Saya</h2>
                    </div>
                </div>

                {/* Active Listings Section */}
                <div className="flex items-center justify-between px-4 pt-4 pb-2">
                    <h2 className="text-[#0d171b] dark:text-white text-[20px] font-bold leading-tight tracking-[-0.015em]">Jualan Aktif ({items.length})</h2>
                    <button className="text-primary text-sm font-bold">Lihat Semua</button>
                </div>
                <div className="px-4 space-y-3 pb-24">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-sm">
                            <div
                                className="size-20 shrink-0 bg-center bg-no-repeat bg-cover rounded-lg"
                                style={{ backgroundImage: `url("${item.image_url}")` }}
                            >
                            </div>
                            <div className="flex flex-col flex-1 justify-between">
                                <div>
                                    <h3 className="text-[#0d171b] dark:text-white text-sm font-bold leading-tight line-clamp-1">{item.title}</h3>
                                    <p className="text-primary text-sm font-bold">
                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.price)}
                                    </p>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button
                                        onClick={() => router.push(`/edit-offer/${item.id}`)}
                                        className="flex-1 h-8 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => router.push(`/boost?id=${item.id}`)}
                                        className="flex-1 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center gap-1 hover:bg-primary/90 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[14px]">rocket_launch</span>
                                        Boost
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <div className="text-center py-8 text-slate-400">
                            <p>Belum ada jualan aktif.</p>
                            <Link href="/create-offer" className="text-primary text-sm font-bold mt-2 block">Mulai Jualan</Link>
                        </div>
                    )}
                </div>

                {/* FAB for New Listing */}
                <Link href="/create-offer">
                    <button className="fixed bottom-6 right-6 size-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-transform z-50 hover:bg-primary/90">
                        <span className="material-symbols-outlined text-[32px]">add</span>
                    </button>
                </Link>

                {/* Bottom Navigation Spacer */}
                <div className="h-20"></div>
            </div>
            <BottomNav />
        </div>
    );
}
