"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Item } from "@/utils/types";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OfferDetail({ params }: { params: { id: string } }) {
    const [item, setItem] = useState<Item | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchItem() {
            const { data } = await supabase
                .from('items')
                .select(`*, category:categories(name)`)
                .eq('id', params.id)
                .single();

            if (data) {
                setItem(data);
            }
            setLoading(false);
        }
        fetchItem();
    }, [params.id]);

    const handleInteraction = async (action: () => void) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            router.push("/login");
        } else {
            action();
        }
    };

    const handleContactSeller = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            router.push("/login");
            return;
        }

        if (!item) return;

        // Check if user is trying to message themselves
        if (item.seller_id === session.user.id) {
            alert('Anda tidak bisa mengirim pesan ke diri sendiri!');
            return;
        }

        // Find or create chat
        const { data: existingChat } = await supabase
            .from('chats')
            .select('id')
            .or(`and(user_a.eq.${session.user.id},user_b.eq.${item.seller_id}),and(user_a.eq.${item.seller_id},user_b.eq.${session.user.id})`)
            .eq('item_id', item.id)
            .single();

        if (existingChat) {
            // Chat already exists, redirect to it
            router.push(`/messages/${existingChat.id}`);
        } else {
            // Create new chat
            const { data: newChat, error } = await supabase
                .from('chats')
                .insert({
                    user_a: session.user.id,
                    user_b: item.seller_id,
                    item_id: item.id,
                    item_title: item.title,
                    item_image: item.image_url
                })
                .select('id')
                .single();

            if (error) {
                console.error('Error creating chat:', error);
                alert('Gagal membuat chat. Silakan coba lagi.');
                return;
            }

            if (newChat) {
                router.push(`/messages/${newChat.id}`);
            }
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Memuat...</div>;
    if (!item) return <div className="min-h-screen flex items-center justify-center text-slate-500">Tawaran tidak ditemukan</div>;

    return (
        <div className="bg-background-light dark:bg-background-dark text-[#0d171b] dark:text-white font-display min-h-screen pb-24">
            {/* Top Navigation Bar */}
            <div className="fixed top-0 left-0 right-0 z-50 flex items-center bg-white/80 dark:bg-background-dark/80 backdrop-blur-md p-4 justify-between border-b border-gray-100 dark:border-gray-800">
                <button onClick={() => router.back()} className="text-[#0d171b] dark:text-white flex size-10 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm transition-transform active:scale-95">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div className="text-lg font-bold">Detail Tawaran</div>
                <div className="flex gap-2">
                    <button className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm text-[#0d171b] dark:text-white transition-transform active:scale-95">
                        <span className="material-symbols-outlined">share</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <main className="pt-20">
                {/* Image Gallery */}
                <div className="@container">
                    <div className="px-0 @[480px]:px-4">
                        <div
                            className="relative bg-cover bg-center flex flex-col justify-end overflow-hidden bg-slate-200 dark:bg-slate-800 @[480px]:rounded-xl min-h-[350px]"
                            style={{ backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 40%), url("${item.image_url}")` }}
                        >
                            <div className="flex justify-center gap-2 p-5">
                                <div className="size-2 rounded-full bg-white"></div>
                                <div className="size-2 rounded-full bg-white opacity-40"></div>
                                <div className="size-2 rounded-full bg-white opacity-40"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Section */}
                <div className="px-4 pt-6">
                    <div className="flex justify-between items-start">
                        <h1 className="text-[#0d171b] dark:text-white tracking-tight text-3xl font-bold leading-tight">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.price)}
                        </h1>
                        <div className="flex h-8 items-center justify-center gap-x-2 rounded-full bg-green-100 dark:bg-green-900/30 px-4">
                            <div className="size-2 rounded-full bg-green-500"></div>
                            <p className="text-green-700 dark:text-green-400 text-xs font-bold leading-normal uppercase tracking-wider">Tersedia</p>
                        </div>
                    </div>
                    <h2 className="text-[#0d171b] dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] pt-2">{item.title}</h2>
                    <div className="flex gap-2 mt-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Kategori:</span>
                        <span className="text-sm font-semibold text-primary">{(item as any).category?.name || 'Umum'}</span>
                    </div>
                </div>

                {/* Seller Card */}
                <div className="px-4 pt-8">
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="size-14 rounded-full overflow-hidden bg-slate-200">
                                    {item.seller_avatar ? (
                                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url("${item.seller_avatar}")` }}></div>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                                            <span className="material-symbols-outlined text-2xl">person</span>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-1">
                                        <h3 className="font-bold text-base">{item.seller_name}</h3>
                                        <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="material-symbols-outlined text-yellow-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        <span className="font-bold text-gray-800 dark:text-gray-200">{item.rating}</span>
                                        <span>(128 Penjualan)</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => router.push(`/seller/${item.seller_id}`)}
                                className="bg-primary/10 text-primary font-bold px-4 py-2 rounded-full text-sm hover:bg-primary/20 transition-colors"
                            >
                                Profil
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="px-4 pt-8">
                    <div className="flex border-b border-gray-200 dark:border-gray-800">
                        <button className="px-4 py-3 border-b-2 border-primary text-primary font-bold text-sm">Deskripsi</button>
                        <button className="px-4 py-3 text-gray-500 dark:text-gray-400 font-medium text-sm hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Ulasan (45)</button>
                    </div>
                    <div className="py-4">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm whitespace-pre-wrap">
                            {item.description}
                        </p>
                    </div>
                </div>

                {/* Reviews Teaser */}
                <div className="px-4 pt-4 pb-8">
                    <h4 className="font-bold mb-4">Ulasan Terbaru</h4>
                    <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-xl">
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="size-8 rounded-full bg-slate-300 overflow-hidden">
                                        <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-500">
                                            <span className="material-symbols-outlined text-sm">person</span>
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold">Siti Aminah</span>
                                </div>
                                <div className="flex text-yellow-500">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span key={star} className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    ))}
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 italic">"Hasilnya keren banget! Responsif dan ngerti apa yang dimau. Makasih kak!"</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Floating Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-background-dark/90 backdrop-blur-lg border-t border-gray-100 dark:border-gray-800 flex gap-3 items-center max-w-md mx-auto">
                <button
                    onClick={() => handleInteraction(() => alert('Fitur favorit akan segera hadir!'))}
                    className="flex size-14 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800 text-[#0d171b] dark:text-white shrink-0 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                >
                    <span className="material-symbols-outlined">favorite_border</span>
                </button>
                <button
                    onClick={handleContactSeller}
                    className="flex-1 bg-primary text-white font-bold h-14 rounded-full flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
                >
                    <span className="material-symbols-outlined">chat</span>
                    <span>Hubungi Penjual</span>
                </button>
            </div>
        </div>
    );
}
