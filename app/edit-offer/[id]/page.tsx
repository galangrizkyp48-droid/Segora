"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function EditOffer({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [offerType, setOfferType] = useState("Produk");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        category: "Elektronik",
        category_id: "",
        image_url: ""
    });

    useEffect(() => {
        const fetchItem = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/login");
                return;
            }

            // Fetch categories from DB
            const { data: catData } = await supabase.from('categories').select('*');
            if (catData) setCategories(catData);

            const { data, error } = await supabase
                .from('items')
                .select('*')
                .eq('id', params.id)
                .single();

            if (data) {
                // Optional: Check if user is the owner
                // if (data.seller_name !== session.user.email?.split('@')[0]) ...

                setFormData({
                    title: data.title,
                    description: data.description,
                    price: data.price.toString(),
                    category: data.category_name || "Elektronik",
                    category_id: data.category_id || "",
                    image_url: data.image_url
                });
                setOfferType(data.offer_type || "Produk");
            } else if (error) {
                alert("Error fetching item: " + error.message);
                router.push("/dashboard");
            }
            setLoading(false);
        };
        fetchItem();
    }, [params.id, router]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Ukuran file maksimal 5MB');
            return;
        }

        setUploading(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `item-images/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
            .from('items')
            .upload(filePath, file);

        if (uploadError) {
            alert('Gagal upload gambar: ' + uploadError.message);
            setUploading(false);
            return;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('items')
            .getPublicUrl(filePath);

        setFormData(prev => ({ ...prev, image_url: publicUrl }));
        setUploading(false);
    };

    const handleSubmit = async () => {
        setSaving(true);

        // Fetch category_id by name (matching create-offer pattern)
        let categoryId = formData.category_id;
        if (!categoryId && formData.category) {
            const { data: catData } = await supabase
                .from('categories')
                .select('id')
                .eq('name', formData.category)
                .single();

            if (catData) {
                categoryId = catData.id;
            }
        }

        const { error } = await supabase
            .from('items')
            .update({
                title: formData.title,
                description: formData.description,
                price: Number(formData.price),
                image_url: formData.image_url,
                category_id: categoryId,
                offer_type: offerType
            })
            .eq('id', params.id);

        if (!error) {
            router.push("/dashboard");
        } else {
            alert("Gagal memperbarui: " + error.message);
        }
        setSaving(false);
    };

    if (loading) return null;

    return (
        <>
            <div className="max-w-md mx-auto min-h-screen flex flex-col bg-background-light dark:bg-background-dark overflow-x-hidden">
                {/* TopAppBar */}
                <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                        <Link href="/dashboard" className="material-symbols-outlined text-primary text-2xl" data-icon="close">
                            close
                        </Link>
                    </div>
                    <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center">
                        Edit Tawaran
                    </h2>
                    <div className="flex w-12 items-center justify-end">
                        <Link href="/dashboard" className="text-primary text-base font-semibold leading-normal cursor-pointer">
                            Batal
                        </Link>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto pb-32">
                    {/* HeadlineText */}
                    <h3 className="text-slate-900 dark:text-white tracking-tight text-2xl font-bold leading-tight px-4 pb-2 pt-4">
                        Perbarui detail tawaran Anda
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
                            <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 cursor-pointer hover:bg-slate-100 transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    disabled={uploading}
                                />
                                {uploading ? (
                                    <>
                                        <span className="material-symbols-outlined text-primary text-3xl mb-1 animate-spin">progress_activity</span>
                                        <span className="text-[10px] font-bold text-slate-400">Upload...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-primary text-3xl mb-1">add_a_photo</span>
                                        <span className="text-[10px] font-bold text-slate-400">Ubah</span>
                                    </>
                                )}
                            </label>
                            <div
                                className="aspect-square rounded-xl bg-cover bg-center bg-slate-200 dark:bg-slate-800"
                                style={{
                                    backgroundImage: `url('${formData.image_url}')`,
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
                                {(categories.length > 0 ? categories : [{ id: '1', name: 'Elektronik' }, { id: '2', name: 'Akademik' }, { id: '3', name: 'Fashion' }, { id: '4', name: 'Makanan' }]).map((cat) => (
                                    <button
                                        key={typeof cat === 'object' ? cat.id : cat}
                                        onClick={() => setFormData({ ...formData, category: typeof cat === 'object' ? cat.name : cat, category_id: typeof cat === 'object' ? cat.id : '' })}
                                        className={`shrink-0 px-5 py-2 rounded-full text-xs font-bold transition-colors ${formData.category === (typeof cat === 'object' ? cat.name : cat) ? "bg-primary text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white"}`}
                                    >
                                        {typeof cat === 'object' ? cat.name : cat}
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
                    </div>
                </main>

                {/* Fixed Footer CTA */}
                <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-background-light dark:bg-background-dark border-t border-slate-200 dark:border-slate-800">
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-full shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        <span>{saving ? "Menyimpan..." : "Simpan Perubahan"}</span>
                        <span className="material-symbols-outlined text-lg">check_circle</span>
                    </button>
                </footer>
            </div>
        </>
    );
}
