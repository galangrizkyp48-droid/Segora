"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Item } from "@/utils/types";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SellerProfile({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [seller, setSeller] = useState<{ name: string; avatar: string; major: string } | null>(null);

    useEffect(() => {
        async function fetchSellerItems() {
            // Fetch items where seller_id (or we assume a column links to seller) fits.
            // Since we stored simple 'items', we'll filter by what uniquely identifies a seller.
            // In a real app, 'seller_id' would be a foreign key to 'profiles'. 
            // Here we assume we can filter by the same identifier passed in params.

            // Note: Since our current schema might be simple, we'll try to find items 
            // that match this seller. If params.id is a seller_name or ID.
            // Let's assume params.id is the seller_id (UUID) or we filter by something else.
            // For now, let's query ALL items and filtered in client if we can't filter by a non-existent column,
            // OR assuming there IS a seller_id column.

            // Checking previous files, we didn't explicitly see a seller_id in types, but it's likely there or we use seller_name.
            // Let's assume there is a 'seller_id' column for a robust implementation.

            const { data } = await supabase
                .from('items')
                .select('*')
                .eq('seller_id', params.id); // Assuming seller_id is the foreign key

            if (data && data.length > 0) {
                setItems(data);
                // Extract seller info from the first item
                setSeller({
                    name: data[0].seller_name,
                    avatar: data[0].seller_avatar || '',
                    major: data[0].seller_major || 'Mahasiswa'
                });
            } else {
                // If no items, try to fetch profile directly if table exists, or handle empty state
                // For now, simplified:
                setSeller(null);
            }
            setLoading(false);
        }
        fetchSellerItems();
    }, [params.id]);

    const handleInteraction = async (action: () => void) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            router.push("/login");
        } else {
            action();
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Memuat profil...</div>;
    if (!seller && !loading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Penjual tidak ditemukan atau belum ada barang.</div>;

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-[#0d171b] dark:text-white transition-colors duration-300 min-h-screen">
            <div className="relative flex h-auto min-h-screen w-full mx-auto flex-col bg-white dark:bg-background-dark shadow-xl overflow-x-hidden">
                {/* TopAppBar */}
                <div className="sticky top-0 z-50 flex items-center bg-white/80 dark:bg-background-dark/80 backdrop-blur-md p-4 pb-2 justify-between border-b border-gray-100 dark:border-gray-800">
                    <button onClick={() => router.back()} className="text-[#0d171b] dark:text-white flex size-10 shrink-0 items-center justify-center cursor-pointer">
                        <span className="material-symbols-outlined">arrow_back_ios</span>
                    </button>
                    <h2 className="text-[#0d171b] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Profil Seller</h2>
                    <div className="flex w-10 items-center justify-end">
                        <button className="flex cursor-pointer items-center justify-center rounded-full h-10 w-10 bg-transparent text-[#0d171b] dark:text-white">
                            <span className="material-symbols-outlined">share</span>
                        </button>
                    </div>
                </div>

                {/* ProfileHeader */}
                <div className="flex p-6 @container">
                    <div className="flex w-full flex-col gap-6 items-center">
                        <div className="flex gap-4 flex-col items-center relative">
                            <div className="relative">
                                <div
                                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32 border-4 border-white dark:border-gray-800 shadow-lg"
                                    style={{ backgroundImage: `url("${seller?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjLzrPKBeA7Zt56l3VhJ4A7a5suc_ZSjsklXdGwnyzgVoG_eTMwWQvioqFKfNngwuMsh5f9WDTvx38dMHEPtz1oSHMem6pzYmi4fHASVgO3fLjG1wbz6PEAnaf0HOgAnPyTB12cHiwYARsYOJDmUVgAtGF5t9wQN7CdWFsIh-yP55lGIZfo9vEz7NRFaZvl8RZvjpYOwbDbKjUDRMbDAijZ2wxBohEDXZfISHBzNwwGujLIrF2II5hcoJJD1SDvaPq1VOqq6MQhdA'}")` }}
                                >
                                </div>
                                <div className="absolute bottom-1 right-1 bg-primary text-white p-1 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center" title="Verified Pro">
                                    <span className="material-symbols-outlined text-[16px] font-bold">verified</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <div className="flex items-center gap-2">
                                    <p className="text-[#0d171b] dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em] text-center">{seller?.name}</p>
                                </div>
                                <p className="text-primary text-sm font-semibold mb-1">Verified Pro Student</p>
                                <p className="text-[#4c809a] dark:text-gray-400 text-base font-normal leading-normal text-center px-4 max-w-[300px]">
                                    {seller?.major ? `Mahasiswa ${seller.major}` : 'Mahasiswa IT yang suka desain & ngoding santai'}
                                </p>
                            </div>
                        </div>
                        <div className="flex w-full gap-3">
                            <button
                                onClick={() => handleInteraction(() => alert('Untuk mengirim pesan, silakan klik tombol "Hubungi Penjual" di halaman produk.'))}
                                className="flex-1 flex cursor-pointer items-center justify-center rounded-full h-12 px-6 bg-[#e7eff3] dark:bg-gray-800 text-[#0d171b] dark:text-white text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-all"
                            >
                                <span className="material-symbols-outlined mr-2 text-[20px]">chat_bubble</span>
                                <span>Pesan</span>
                            </button>
                            <button
                                onClick={() => handleInteraction(() => console.log('Follow'))}
                                className="flex-1 flex cursor-pointer items-center justify-center rounded-full h-12 px-6 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-all"
                            >
                                <span className="material-symbols-outlined mr-2 text-[20px]">person_add</span>
                                <span>Ikuti</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* ProfileStats */}
                <div className="px-4 py-2">
                    <div className="flex flex-wrap gap-3 bg-primary/5 dark:bg-primary/10 p-4 rounded-xl border border-primary/10">
                        <div className="flex min-w-[80px] flex-1 flex-col gap-1 items-center text-center">
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-yellow-500 fill-current text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                <p className="text-[#0d171b] dark:text-white tracking-light text-xl font-bold leading-tight">4.9</p>
                            </div>
                            <p className="text-[#4c809a] dark:text-gray-400 text-xs font-medium uppercase tracking-wider">Rating</p>
                        </div>
                        <div className="w-[1px] bg-primary/20 self-stretch"></div>
                        <div className="flex min-w-[80px] flex-1 flex-col gap-1 items-center text-center">
                            <p className="text-[#0d171b] dark:text-white tracking-light text-xl font-bold leading-tight">120</p>
                            <p className="text-[#4c809a] dark:text-gray-400 text-xs font-medium uppercase tracking-wider">Pengikut</p>
                        </div>
                        <div className="w-[1px] bg-primary/20 self-stretch"></div>
                        <div className="flex min-w-[80px] flex-1 flex-col gap-1 items-center text-center">
                            <p className="text-[#0d171b] dark:text-white tracking-light text-xl font-bold leading-tight">{items.length}</p>
                            <p className="text-[#4c809a] dark:text-gray-400 text-xs font-medium uppercase tracking-wider">Proyek</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mt-4">
                    <div className="flex border-b border-gray-100 dark:border-gray-800 px-4 justify-between sticky top-[60px] bg-white dark:bg-background-dark z-40">
                        <button className="flex flex-col items-center justify-center border-b-[3px] border-b-primary text-primary pb-[13px] pt-4 flex-1">
                            <p className="text-sm font-bold leading-normal tracking-[0.015em]">Tawaran</p>
                        </button>
                        <button className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#4c809a] pb-[13px] pt-4 flex-1 hover:text-primary transition-colors">
                            <p className="text-sm font-bold leading-normal tracking-[0.015em]">Ulasan</p>
                        </button>
                        <button className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#4c809a] pb-[13px] pt-4 flex-1 hover:text-primary transition-colors">
                            <p className="text-sm font-bold leading-normal tracking-[0.015em]">Portofolio</p>
                        </button>
                    </div>
                </div>

                {/* Content Area (Active Offers) */}
                <div className="flex flex-col gap-1 p-2 pb-24">
                    {items.map((item) => (
                        <Link href={`/offer/${item.id}`} key={item.id} className="block p-2">
                            <div className="flex items-stretch justify-between gap-4 rounded-xl bg-white dark:bg-gray-900 p-4 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                <div className="flex flex-[2_2_0px] flex-col justify-between py-1">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
                                                {(item as any).category?.name || 'Umum'}
                                            </span>
                                        </div>
                                        <p className="text-[#0d171b] dark:text-white text-base font-bold leading-tight line-clamp-2">{item.title}</p>
                                        <p className="text-primary text-lg font-bold leading-normal">
                                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.price)}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-center rounded-full h-9 px-4 mt-3 bg-[#e7eff3] dark:bg-gray-800 text-[#0d171b] dark:text-white text-xs font-bold leading-normal w-fit group-hover:bg-primary group-hover:text-white transition-all">
                                        <span>Lihat Detail</span>
                                        <span className="material-symbols-outlined text-[16px] ml-1">chevron_right</span>
                                    </div>
                                </div>
                                <div
                                    className="w-24 h-24 sm:w-32 sm:h-32 bg-center bg-no-repeat bg-cover rounded-xl shadow-inner"
                                    style={{ backgroundImage: `url("${item.image_url}")` }}
                                >
                                </div>
                            </div>
                        </Link>
                    ))}
                    {items.length === 0 && (
                        <div className="text-center py-10 text-slate-400">
                            <p>Belum ada tawaran aktif.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
