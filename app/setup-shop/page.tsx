```javascript
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AlertDialog from "@/components/AlertDialog";

export default function SetupShop() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [shopName, setShopName] = useState("");
    const [shopDescription, setShopDescription] = useState(""); // Renamed from shopDesc
    const [shopImage, setShopImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [alertDialog, setAlertDialog] = useState<{ show: boolean; title: string; message: string }>({ show: false, title: '', message: '' });


    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/login");
            }
        };
        checkUser();
    }, [router]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        setShopImage(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleSave = async () => {
        if (!shopName) {
            setAlertDialog({ show: true, title: "Peringatan", message: "Nama toko wajib diisi!" });
            return;
        }
        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setAlertDialog({ show: true, title: "Error", message: "Pengguna tidak ditemukan." });
            setLoading(false);
            return;
        }

        let uploadedImageUrl = null;

        // Upload Image if selected
        if (shopImage) {
            const fileExt = shopImage.name.split('.').pop();
            const fileName = `${ user.id } -${ Math.random() }.${ fileExt } `;
            const filePath = `shops / ${ fileName } `;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, shopImage);

            if (uploadError) {
                console.error("Upload error:", uploadError);
                setAlertDialog({ show: true, title: "Gagal Upload", message: `Gagal upload foto: ${ uploadError.message } ` });
                setLoading(false);
                return;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            uploadedImageUrl = publicUrl;
        }

        // Update profile to become a seller
        const updateData: any = {
            is_seller: true,
            shop_name: shopName,
            shop_description: shopDescription, // Using renamed state
        };

        if (uploadedImageUrl) {
            updateData.avatar_url = uploadedImageUrl; // Using avatar_url for shop logo for now
        }

        const { error } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', user.id);

        if (error) {
            console.error('Error updating profile:', error);
            setAlertDialog({ show: true, title: 'Gagal', message: `Gagal membuat toko: ${ error.message } ` });
        } else {
            setAlertDialog({ show: true, title: 'Berhasil', message: 'Toko berhasil dibuat!' });
            setTimeout(() => router.push("/profile"), 1500); // Redirect to profile after success
        }
        setLoading(false);
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
                    <div className="inline-flex justify-center items-center size-24 rounded-full bg-slate-100 dark:bg-slate-800 mb-4 overflow-hidden border-2 border-dashed border-primary relative cursor-pointer group">
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <span className="material-symbols-outlined text-[40px] text-primary">add_a_photo</span>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-xs font-bold">Ubah</span>
                        </div>
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

            <AlertDialog
                show={alertDialog.show}
                title={alertDialog.title}
                message={alertDialog.message}
                onClose={() => setAlertDialog({ show: false, title: '', message: '' })}
            />
        </div>
    );
}
```
