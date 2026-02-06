"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function CreateOffer() {
    const router = useRouter();
    const [offerType, setOfferType] = useState("Produk");
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        category: "Elektronik",
    });

    const handleSubmit = async () => {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            router.push("/login");
            return;
        }

        const { user } = session;
        const campusId = user.user_metadata?.campus || 'untirta'; // Fallback or strict check

        const { error } = await supabase.from('items').insert({
            title: formData.title,
            description: formData.description,
            price: Number(formData.price),
            category_id: 1, // Default to 1
            seller_name: session.user.email?.split('@')[0] || "User",
            rating: 5.0,
            image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAymC9c_OwO7PvXFaY-gQhUbdFNkGmB1_WNu8ETZsm2ybZYLx2k5UoAnJEIWv7hmFsR0EzUjVnp2YSFU2u6lkpQmF81-6hHETCZpTwmvgDzh-geNqTs7h4Ot2J6D4dvQjr8BRcKvp_L9bsPK_TN2OzwHjKKS6PuTZgh0BmSlHzf0gd_QDhlcX_CbvUhxyesNoHT2XmYKlYypMt_c0ILa-rC5VgMrF0WyWnm9mljDSPkj19ZlxYLUsfh3PHNo6KZBVLHHssp_S_87qY",
            offer_type: offerType,
            campus: campusId
        });

        if (!error) {
            router.push("/");
        } else {
            alert("Gagal: " + error.message);
        }
        setLoading(false);
    };

    return (
        <>
            <div className="max-w-md mx-auto min-h-screen flex flex-col bg-background-light dark:bg-background-dark overflow-x-hidden">
                {/* TopAppBar */}
                <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="material-symbols-outlined text-primary text-2xl" data-icon="close">
                            close
                        </Link>
                    </div>
                    <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center">
                        Buat Tawaran Baru
                    </h2>
                    <div className="flex w-12 items-center justify-end">
                        <Link href="/" className="text-primary text-base font-semibold leading-normal cursor-pointer">
                            Batal
                        </Link>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto pb-32">
                    {/* ProgressBar */}
                    <div className="flex flex-col gap-3 p-4">
                        <div className="flex gap-6 justify-between">
                            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                                Langkah 1 dari 3: Detail Produk
                            </p>
                        </div>
                        <div className="rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                            <div className="h-2 rounded-full bg-primary" style={{ width: "33%" }}></div>
                        </div>
                    </div>

                    {/* HeadlineText */}
                    <h3 className="text-slate-900 dark:text-white tracking-tight text-2xl font-bold leading-tight px-4 pb-2 pt-2">
                        Apa yang ingin Anda tawarkan?
                    </h3>

                    {/* SegmentedButtons */}
                    <div className="flex px-4 py-3">
                        <div className="flex h-12 flex-1 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 p-1">
                            {["Jasa", "Produk", "Request"].map((type) => (
                                <label
                                    key={type}
                                    className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-full px-2 text-sm font-semibold transition-all ${offerType === type
                                        ? "bg-white dark:bg-slate-700 shadow-sm text-primary"
                                        : "text-slate-500 dark:text-slate-400"
                                        }`}
                                >
                                    <span className="truncate">{type}</span>
                                    <input
                                        className="invisible w-0"
                                        name="offer_type"
                                        type="radio"
                                        value={type}
                                        checked={offerType === type}
                                        onChange={() => setOfferType(type)}
                                    />
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Image Upload Area */}
                    <div className="px-4 py-4">
                        <p className="text-slate-700 dark:text-slate-300 text-sm font-bold mb-3">Foto Barang/Ilustrasi</p>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 cursor-pointer hover:bg-slate-100 transition-colors">
                                <span className="material-symbols-outlined text-primary text-3xl mb-1">add_a_photo</span>
                                <span className="text-[10px] font-bold text-slate-400">Tambah</span>
                            </div>
                            <div
                                className="aspect-square rounded-xl bg-cover bg-center bg-slate-200 dark:bg-slate-800"
                                style={{
                                    backgroundImage:
                                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAymC9c_OwO7PvXFaY-gQhUbdFNkGmB1_WNu8ETZsm2ybZYLx2k5UoAnJEIWv7hmFsR0EzUjVnp2YSFU2u6lkpQmF81-6hHETCZpTwmvgDzh-geNqTs7h4Ot2J6D4dvQjr8BRcKvp_L9bsPK_TN2OzwHjKKS6PuTZgh0BmSlHzf0gd_QDhlcX_CbvUhxyesNoHT2XmYKlYypMt_c0ILa-rC5VgMrF0WyWnm9mljDSPkj19ZlxYLUsfh3PHNo6KZBVLHHssp_S_87qY')",
                                }}
                            ></div>
                            <div
                                className="aspect-square rounded-xl bg-cover bg-center bg-slate-200 dark:bg-slate-800"
                                style={{
                                    backgroundImage:
                                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDoeck0-jW1sTx4Dw7ZrCPMFGn04BAAnutJeyP2A4148VCUhzOXQ576KRNadJGt91qMAPOUl7EK6A6VsG0V54NzJBVf17mI2Kb5daDgCXqDk3wLhkqYlzuZt44EybeClbtAxFG6U3OXA-BcKU8P0giEqCKdzRMd6yaCI1h3gaLmwLZBqNG4zruqURuYGtSkEVrVjO327wqQq_PNOkGyN6b69mP2Nd3EQOx3rPDHUJsHcB4aRigSqDxf8XP4Qd-iTyLBIvTV60VPfGw')",
                                }}
                            ></div>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="px-4 py-2 space-y-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-slate-700 dark:text-slate-300 text-sm font-bold">Judul Tawaran</label>
                            <input
                                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-5 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="Contoh: Joki Tugas Kalkulus, Sepatu Compass..."
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-slate-700 dark:text-slate-300 text-sm font-bold">Kategori</label>
                            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                                {["Elektronik", "Akademik", "Fashion", "Makanan"].map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setFormData({ ...formData, category: cat })}
                                        className={`shrink-0 px-5 py-2 rounded-full text-xs font-bold transition-colors ${formData.category === cat ? "bg-primary text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white"}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-slate-700 dark:text-slate-300 text-sm font-bold">Deskripsi</label>
                            <textarea
                                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                                placeholder="Ceritakan detail tawaran Anda, kondisi barang, atau cakupan jasa..."
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            ></textarea>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-slate-700 dark:text-slate-300 text-sm font-bold">Harga (Rp)</label>
                            <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rp</span>
                                <input
                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full pl-12 pr-5 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-bold"
                                    placeholder="0"
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-slate-700 dark:text-slate-300 text-sm font-bold">Metode Transaksi</label>
                            <div className="space-y-2">
                                <label className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl cursor-pointer has-[:checked]:border-primary transition-all">
                                    <input
                                        defaultChecked
                                        className="w-5 h-5 text-primary focus:ring-primary border-slate-300"
                                        name="transaksi"
                                        type="radio"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold">COD (Ketemuan)</span>
                                        <span className="text-xs text-slate-500">Bayar di tempat sekitar kampus</span>
                                    </div>
                                </label>
                                <label className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl cursor-pointer has-[:checked]:border-primary transition-all">
                                    <input
                                        className="w-5 h-5 text-primary focus:ring-primary border-slate-300"
                                        name="transaksi"
                                        type="radio"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold">Transfer & Kirim</span>
                                        <span className="text-xs text-slate-500">Gunakan kurir atau ojek online</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Fixed Footer CTA */}
                <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-background-light dark:bg-background-dark border-t border-slate-200 dark:border-slate-800">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-full shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        <span>{loading ? "Menerbitkan..." : "Terbitkan Tawaran"}</span>
                        <span className="material-symbols-outlined text-lg">send</span>
                    </button>
                </footer>
            </div>
        </>
    );
}
