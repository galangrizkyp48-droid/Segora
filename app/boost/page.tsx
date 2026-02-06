"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Item } from "@/utils/types";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function BoostPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const preSelectedId = searchParams.get('id');

    const [items, setItems] = useState<Item[]>([]);
    const [selectedItemId, setSelectedItemId] = useState<string | null>(preSelectedId);
    const [duration, setDuration] = useState<1 | 3 | 7>(1);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<'sundul' | 'plus'>('sundul');

    useEffect(() => {
        const fetchItems = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/login");
                return;
            }

            // Fetch user's items
            const sellerName = session.user.email?.split('@')[0] || "";
            const { data } = await supabase
                .from('items')
                .select('*')
                .ilike('seller_name', sellerName);

            if (data) {
                setItems(data);
                // If no pre-selected item, default to first one maybe? Or none.
                if (!preSelectedId && data.length > 0) {
                    setSelectedItemId(data[0].id);
                }
            }
            setLoading(false);
        };
        fetchItems();
    }, [router, preSelectedId]);

    const getPrice = () => {
        switch (duration) {
            case 1: return 5000;
            case 3: return 12000;
            case 7: return 25000;
            default: return 0;
        }
    };

    const handlePayment = () => {
        alert("Fitur sedang dikembangkan.");
        // router.push("/dashboard"); // Stay on page or redirect? User said "hanya menampilkan kalimat pop up"
    };

    if (loading) return null;

    return (
        <div className="bg-background-light dark:bg-background-dark text-[#0d171b] dark:text-slate-100 min-h-screen font-display">
            <div className="relative flex h-auto min-h-screen w-full max-w-md mx-auto flex-col bg-background-light dark:bg-background-dark overflow-x-hidden pb-24 shadow-xl">
                {/* TopAppBar */}
                <div className="sticky top-0 z-50 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 pb-2 justify-between">
                    <button onClick={() => router.back()} className="text-[#0d171b] dark:text-slate-100 flex size-12 shrink-0 items-center justify-start">
                        <span className="material-symbols-outlined cursor-pointer">arrow_back_ios</span>
                    </button>
                    <h2 className="text-[#0d171b] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Tingkatkan Jangkauan</h2>
                </div>
                <div className="px-4 py-2">
                    <p className="text-[#4c809a] dark:text-slate-400 text-sm">Dilihat lebih banyak orang, jualan makin laku di SEGORA.</p>
                </div>

                {/* SegmentedButtons */}
                <div className="flex px-4 py-3">
                    <div className="flex h-12 flex-1 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 p-1">
                        <label className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-full px-2 transition-all ${tab === 'sundul' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-[#4c809a] dark:text-slate-400'}`}>
                            <span className="truncate text-sm font-semibold">Sundul Post</span>
                            <input
                                checked={tab === 'sundul'}
                                onChange={() => setTab('sundul')}
                                className="invisible w-0 absolute"
                                name="tab-selection"
                                type="radio"
                                value="sundul"
                            />
                        </label>
                        <label className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-full px-2 transition-all ${tab === 'plus' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-[#4c809a] dark:text-slate-400'}`}>
                            <span className="truncate text-sm font-semibold">Segora Plus</span>
                            <input
                                checked={tab === 'plus'}
                                onChange={() => setTab('plus')}
                                className="invisible w-0 absolute"
                                name="tab-selection"
                                type="radio"
                                value="plus"
                            />
                        </label>
                    </div>
                </div>

                {tab === 'sundul' && (
                    <div id="sundul-section">
                        <div className="px-4 pt-5 pb-2">
                            <h2 className="text-[#0d171b] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">Pilih Tawaran untuk Disundul</h2>
                            <p className="text-[#4c809a] dark:text-slate-400 text-sm mt-1">Naikkan posisi produkmu ke paling atas feed pencarian.</p>
                        </div>

                        {/* List Items */}
                        <div className="space-y-1">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => setSelectedItemId(item.id)}
                                    className={`flex items-center gap-4 bg-white dark:bg-slate-900/50 mx-4 rounded-xl px-4 min-h-[80px] py-3 justify-between shadow-sm mb-3 border cursor-pointer transition-all ${selectedItemId === item.id ? 'border-primary ring-2 ring-primary/10' : 'border-slate-100 dark:border-slate-800'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-14 border border-slate-100 dark:border-slate-800"
                                            style={{ backgroundImage: `url("${item.image_url}")` }}
                                        ></div>
                                        <div className="flex flex-col justify-center">
                                            <p className="text-[#0d171b] dark:text-white text-base font-semibold leading-normal line-clamp-1">{item.title}</p>
                                            <p className="text-[#4c809a] dark:text-slate-400 text-xs font-normal leading-normal">
                                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.price)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="shrink-0">
                                        <div className={`size-6 rounded-full border-2 flex items-center justify-center ${selectedItemId === item.id ? 'border-primary bg-primary text-white' : 'border-slate-300'}`}>
                                            {selectedItemId === item.id && <span className="material-symbols-outlined text-sm">check</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Boost Pricing Options */}
                        <div className="px-4 pt-8">
                            <h3 className="text-[#0d171b] dark:text-white text-lg font-bold mb-4">Pilih Durasi Boost</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {[1, 3, 7].map((d) => (
                                    <div
                                        key={d}
                                        onClick={() => setDuration(d as 1 | 3 | 7)}
                                        className={`flex flex-col items-center justify-center p-4 rounded-xl bg-white dark:bg-slate-800 border cursor-pointer transition-all ${duration === d ? 'border-2 border-primary ring-2 ring-primary/10' : 'border-slate-200 dark:border-slate-700'}`}
                                    >
                                        <span className={`font-bold ${duration === d ? 'text-primary' : 'text-slate-700 dark:text-slate-200'}`}>{d} Hari</span>
                                        <span className="text-xs text-slate-500">
                                            {d === 1 ? 'Rp 5.000' : d === 3 ? 'Rp 12.000' : 'Rp 25.000'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sticky Footer Checkout */}
                        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 p-4 pb-8 flex items-center justify-between gap-4 z-50">
                            <div className="flex flex-col">
                                <p className="text-xs text-slate-500 dark:text-slate-400">Total Pembayaran</p>
                                <p className="text-lg font-bold text-primary">
                                    Rp {getPrice().toLocaleString('id-ID')}
                                </p>
                            </div>
                            <button
                                onClick={handlePayment}
                                disabled={!selectedItemId}
                                className="flex-1 bg-primary text-white font-bold py-4 rounded-full shadow-lg shadow-primary/20 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Bayar & Sundul Sekarang
                            </button>
                        </div>
                    </div>
                )}

                {/* Segora Plus Section */}
                {tab === 'plus' && (
                    <div className="px-4 pt-8 animate-fade-in">
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-primary to-blue-600 text-white shadow-lg relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 opacity-20">
                                <span className="material-symbols-outlined text-[120px]">workspace_premium</span>
                            </div>
                            <h3 className="text-xl font-bold mb-1">Berlangganan Segora Plus</h3>
                            <p className="text-white/80 text-sm mb-6">Nikmati fitur eksklusif untuk tingkatkan kredibilitasmu.</p>
                            <ul className="space-y-3 mb-6">
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-white size-5 flex items-center justify-center bg-white/20 rounded-full text-[16px]">verified</span>
                                    <span className="text-sm font-medium">Lencana Verifikasi Akun</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-white size-5 flex items-center justify-center bg-white/20 rounded-full text-[16px]">trending_up</span>
                                    <span className="text-sm font-medium">Prioritas di Hasil Pencarian</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-white size-5 flex items-center justify-center bg-white/20 rounded-full text-[16px]">add_circle</span>
                                    <span className="text-sm font-medium">Batas Postingan Lebih Banyak</span>
                                </li>
                            </ul>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex justify-between items-center border border-white/20">
                                <div>
                                    <p className="text-xs text-white/70">Mulai dari</p>
                                    <p className="text-lg font-bold">Rp 49.000<span className="text-xs font-normal">/bulan</span></p>
                                </div>
                                <button
                                    onClick={() => alert("Fitur sedang dikembangkan.")}
                                    className="bg-white text-primary px-4 py-2 rounded-full text-sm font-bold shadow-sm hover:scale-105 transition-transform"
                                >
                                    Cek Paket
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
