"use client";

import BottomNav from "@/components/BottomNav";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
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
                    <div className="flex flex-col gap-4">
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                            <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold">
                                {user.email?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h2 className="font-bold text-lg">{user.email}</h2>
                                <p className="text-slate-500 text-sm">Mahasiswa</p>
                            </div>
                        </div>
                        {/* Placeholder for menu items */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3">
                                <span className="material-symbols-outlined text-gray-500">list_alt</span>
                                <span>Tawaran Saya</span>
                            </div>
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
