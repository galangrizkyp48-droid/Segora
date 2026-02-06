"use client";

import BottomNav from "@/components/BottomNav";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Profile() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        async function getUser() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login"); // Protect route
            } else {
                setUser(user);
            }
        }
        getUser();
    }, [router]);

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
                {user ? (
                    <>
                        <div className="px-4 py-3">
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg overflow-hidden relative">
                                <div className="absolute right-0 top-0 opacity-10">
                                    <span className="material-symbols-outlined text-[100px]">storefront</span>
                                </div>
                                <h3 className="text-lg font-bold relative z-10">Mau Jualan?</h3>
                                <p className="text-sm text-blue-50 mb-3 relative z-10">Buka tokomu sendiri dan mulai hasilkan uang di kampus.</p>
                                <Link href="/dashboard">
                                    <button className="bg-white text-blue-600 px-4 py-2 rounded-full text-sm font-bold shadow-sm hover:scale-105 transition-transform relative z-10">
                                        Buka Toko
                                    </button>
                                </Link>
                            </div>
                        </div>

                        <div className="flex flex-col p-4 gap-1">
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                                <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold">
                                    {user.email?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                </Link>
                                <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3">
                                    <span className="material-symbols-outlined text-gray-500">favorite</span>
                                    <span>Disukai</span>
                                </div>
                                <div className="p-4 flex items-center gap-3">
                                    <span className="material-symbols-outlined text-gray-500">settings</span>
                                    <span>Pengaturan</span>
                                </div>
                            </div>
                        </div>
                        ) : (
                        <div className="text-center py-20 text-slate-400">Loading profile...</div>
                )}
                    </main>
                <BottomNav />
        </div>
    );
}
