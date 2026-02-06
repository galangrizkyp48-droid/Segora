"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SetupShop() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [shopName, setShopName] = useState("");
    const [shopDesc, setShopDesc] = useState("");

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/login");
            }
        };
        checkUser();
    }, [router]);

    const handleSave = async () => {
        if (!shopName) return alert("Nama toko wajib diisi!");
        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Update profile to become a seller
        const { error } = await supabase
            .from('profiles')
            .update({
                is_seller: true,
                shop_name: shopName,
                shop_description: shopDesc,
                role: 'Penjual' // Optional, if we want to change role text too
            })
            .eq('id', user.id);

        if (error) {
            alert("Gagal menyimpan: " + error.message);
            setLoading(false);
        } else {
            // Success
            router.push("/dashboard"); // Redirect to Seller Dashboard as requested
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
            <header className="fixed top-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 z-50 flex items-center gap-3">
                <Link href="/profile" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <h1 className="text-lg font-bold">Buka Toko</h1>
            </header>

            <main className="flex-1 pt-20 px-6 pb-24 max-w-md mx-auto w-full">
                <div className="text-center mb-8">
                    <div className="inline-flex justify-center items-center size-20 rounded-full bg-blue-100 text-blue-600 mb-4">
                        <span className="material-symbols-outlined text-[40px]">storefront</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Atur Toko Anda</h2>
                    <p className="text-slate-500 text-sm">Lengkapi detail di bawah ini untuk mulai berjualan di Segora.</p>
                </div>

                <div className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nama Toko</label>
                        <input
                            type="text"
                            value={shopName}
                            onChange={(e) => setShopName(e.target.value)}
                            placeholder="Contoh: Kedai Mahasiswa, Jasa Ketik..."
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Deskripsi Singkat</label>
                        <textarea
                            value={shopDesc}
                            onChange={(e) => setShopDesc(e.target.value)}
                            placeholder="Jelaskan apa yang Anda jual..."
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                        />
                    </div>
                </div>
            </main>

            <footer className="fixed bottom-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4">
                <div className="max-w-md mx-auto">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-full shadow-lg shadow-primary/20 transition-all disabled:opacity-70 flex justify-center items-center gap-2"
                    >
                        {loading ? "Menyimpan..." : "Simpan & Buka Toko"}
                        {!loading && <span className="material-symbols-outlined">check_circle</span>}
                    </button>
                </div>
            </footer>
        </div>
    );
}
