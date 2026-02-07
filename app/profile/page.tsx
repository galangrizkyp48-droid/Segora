"use client";

import BottomNav from "@/components/BottomNav";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Item } from "@/utils/types";
import { eventBus } from "@/utils/eventBus";
import ConfirmDialog from "@/components/ConfirmDialog";
import AlertDialog from "@/components/AlertDialog";

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
    const [sellerItems, setSellerItems] = useState<Item[]>([]);
    const [loadingItems, setLoadingItems] = useState(false);

    // Modal states
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertConfig, setAlertConfig] = useState<{ type: 'error' | 'success', message: string }>({ type: 'error', message: '' });

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

    // Fetch seller items
    useEffect(() => {
        async function fetchSellerItems() {
            if (!profile?.is_seller || !user || mode !== 'seller') return;

            setLoadingItems(true);
            const { data } = await supabase
                .from('items')
                .select('*, category:categories(name)')
                .eq('seller_id', user.id)
                .order('created_at', { ascending: false });

            if (data) {
                setSellerItems(data as any);
            }
            setLoadingItems(false);
        }
        fetchSellerItems();
    }, [profile, user, mode]);

    const handleDeleteItem = async (itemId: string) => {
        setItemToDelete(itemId);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete || !user) return;

        const { error } = await supabase
            .from('items')
            .delete()
            .eq('id', itemToDelete)
            .eq('seller_id', user.id);

        if (error) {
            console.error('Delete error:', error);
            setAlertConfig({ type: 'error', message: 'Gagal menghapus item' });
            setShowAlert(true);
            setShowDeleteConfirm(false);
            return;
        }

        // Update local state
        setSellerItems(prev => prev.filter(item => item.id !== itemToDelete));

        // Emit event for homepage to sync
        eventBus.emit('item:deleted', itemToDelete);

        // Recalculate stats
        setSellerStats(prev => ({
            ...prev,
            activeOffers: Math.max(0, prev.activeOffers - 1)
        }));

        // Close modal and show success
        setShowDeleteConfirm(false);
        setShowDeleteSuccess(true);
        setItemToDelete(null);
    };

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
                                {/* Seller Profile Card */}
                                <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-700">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="text-2xl font-bold text-primary">
                                                {profile.shop_name?.[0]?.toUpperCase() || 'T'}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="font-bold text-lg text-[#0d171b] dark:text-white">{profile.shop_name || 'Toko Saya'}</h2>
                                            <p className="text-sm text-slate-400">{profile.full_name || user?.email?.split('@')[0]}</p>
                                        </div>
                                        <Link href="/setup-shop">
                                            <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                                <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">edit</span>
                                            </button>
                                        </Link>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-center border border-slate-100 dark:border-slate-700">
                                            <p className="text-2xl font-bold text-primary">{sellerStats.activeOffers}</p>
                                            <p className="text-xs text-slate-500 mt-1">Tawaran Aktif</p>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-center border border-slate-100 dark:border-slate-700">
                                            <p className="text-2xl font-bold text-primary">{sellerStats.totalViews}</p>
                                            <p className="text-xs text-slate-500 mt-1">Total Views</p>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-center border border-slate-100 dark:border-slate-700">
                                            <p className="text-2xl font-bold text-primary">{sellerStats.avgRating}</p>
                                            <p className="text-xs text-slate-500 mt-1">Rating</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="grid grid-cols-2 gap-3">
                                    <Link href="/create-offer">
                                        <div className="bg-primary text-white p-4 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-primary/90 transition-colors shadow-sm">
                                            <span className="material-symbols-outlined">add_circle</span>
                                            <span className="font-bold text-sm">Buat Tawaran</span>
                                        </div>
                                    </Link>

                                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 p-4 rounded-xl flex items-center gap-3">
                                        <span className="material-symbols-outlined text-primary">inventory</span>
                                        <div>
                                            <p className="font-bold text-sm text-[#0d171b] dark:text-white">Produk</p>
                                            <p className="text-xs text-slate-400">{sellerItems.length} item</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Items Grid */}
                                <div>
                                    <h3 className="font-bold text-lg mb-3 text-[#0d171b] dark:text-white">Produk Saya</h3>
                                    {loadingItems ? (
                                        <div className="text-center py-10">
                                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                                        </div>
                                    ) : sellerItems.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-3">
                                            {sellerItems.map(item => (
                                                <div key={item.id} className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                                                    <Link href={`/offer/${item.id}`}>
                                                        <div
                                                            className="aspect-square bg-cover bg-center cursor-pointer"
                                                            style={{ backgroundImage: `url("${item.image_url}")` }}
                                                        />
                                                    </Link>
                                                    <div className="p-3">
                                                        <h4 className="font-bold text-sm truncate text-[#0d171b] dark:text-white mb-1">{item.title}</h4>
                                                        <p className="text-primary font-bold text-sm mb-2">
                                                            {new Intl.NumberFormat('id-ID', {
                                                                style: 'currency',
                                                                currency: 'IDR',
                                                                maximumFractionDigits: 0
                                                            }).format(item.price)}
                                                        </p>
                                                        <div className="flex gap-2">
                                                            <Link href={`/edit-offer/${item.id}`} className="flex-1">
                                                                <button className="w-full text-xs py-2 bg-slate-100 dark:bg-slate-800 text-[#0d171b] dark:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium">
                                                                    Edit
                                                                </button>
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDeleteItem(item.id)}
                                                                className="flex-1 text-xs py-2 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-medium"
                                                            >
                                                                Hapus
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-10 text-slate-400">
                                            <span className="material-symbols-outlined text-6xl block mb-2">inventory_2</span>
                                            <p className="text-sm font-semibold mb-1">Belum ada produk</p>
                                            <p className="text-xs mb-4">Mulai jual produk atau jasa kamu</p>
                                            <Link href="/create-offer">
                                                <button className="px-6 py-2 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors">
                                                    Buat Tawaran Pertama
                                                </button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20 text-slate-400">Loading profile...</div>
                )}
                )}
            </main>
            <BottomNav />

            {/* Delete Confirmation Modal */}
            <ConfirmDialog
                isOpen={showDeleteConfirm}
                title="Hapus Item?"
                message="Item yang dihapus tidak dapat dikembalikan. Yakin ingin melanjutkan?"
                confirmText="Hapus"
                cancelText="Batal"
                confirmColor="danger"
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteConfirm(false)}
            />

            {/* Delete Success Alert */}
            <AlertDialog
                isOpen={showDeleteSuccess}
                type="success"
                message="Item berhasil dihapus!"
                onClose={() => setShowDeleteSuccess(false)}
                autoClose={2000}
            />

            {/* Error Alert */}
            <AlertDialog
                isOpen={showAlert}
                type={alertConfig.type}
                message={alertConfig.message}
                onClose={() => setShowAlert(false)}
            />
        </div>
    );
}
