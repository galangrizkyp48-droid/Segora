"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import BottomNav from "@/components/BottomNav";

export default function Settings() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState({
        full_name: "",
        campus: "",
        major: "",
        bio: ""
    });

    useEffect(() => {
        async function loadProfile() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }

            setUser(user);

            // Fetch profile
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (data) {
                setProfile({
                    full_name: data.full_name || "",
                    campus: data.campus || "",
                    major: data.major || "",
                    bio: data.bio || ""
                });
            }
            setLoading(false);
        }
        loadProfile();
    }, [router]);

    const handleSave = async () => {
        if (!user) return;

        setSaving(true);

        const { error } = await supabase
            .from('profiles')
            .update(profile)
            .eq('id', user.id);

        setSaving(false);

        if (error) {
            alert('Gagal menyimpan perubahan.');
            console.error(error);
        } else {
            alert('Profil berhasil diperbaharui!');
            router.push('/profile');
        }
    };

    const toggleTheme = () => {
        const html = document.documentElement;
        if (html.classList.contains('dark')) {
            html.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            html.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-500">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24">
            {/* Header */}
            <header className="bg-white dark:bg-slate-900 shadow-sm p-4 sticky top-0 z-10 flex items-center gap-3">
                <button onClick={() => router.back()} className="text-[#0d171b] dark:text-white">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="text-xl font-bold flex-1">Pengaturan</h1>
            </header>

            <main className="p-4">
                {/* Profile Section */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-4 mb-4">
                    <h2 className="text-lg font-bold mb-4">Informasi Profil</h2>

                    <div className="space-y-4">
                        {/* Email (Read-only) */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={user?.email || ""}
                                disabled
                                className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed"
                            />
                            <p className="text-xs text-slate-400 mt-1">Email tidak dapat diubah</p>
                        </div>

                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Nama Lengkap
                            </label>
                            <input
                                type="text"
                                value={profile.full_name}
                                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                placeholder="Masukkan nama lengkap"
                                className="w-full p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        {/* Campus */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Kampus
                            </label>
                            <input
                                type="text"
                                value={profile.campus}
                                onChange={(e) => setProfile({ ...profile, campus: e.target.value })}
                                placeholder="Contoh: Universitas Indonesia"
                                className="w-full p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        {/* Major */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Jurusan
                            </label>
                            <input
                                type="text"
                                value={profile.major}
                                onChange={(e) => setProfile({ ...profile, major: e.target.value })}
                                placeholder="Contoh: Teknik Informatika"
                                className="w-full p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Bio
                            </label>
                            <textarea
                                value={profile.bio}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                placeholder="Ceritakan sedikit tentang kamu..."
                                rows={3}
                                className="w-full p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full mt-4 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </div>

                {/* Preferences Section */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                        <h2 className="text-lg font-bold">Preferensi</h2>
                    </div>

                    {/* Theme Toggle */}
                    <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" onClick={toggleTheme}>
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-gray-500">dark_mode</span>
                            <div>
                                <p className="font-semibold text-sm">Mode Gelap</p>
                                <p className="text-xs text-slate-400">Toggle tema gelap</p>
                            </div>
                        </div>
                        <div className="relative w-12 h-6 bg-slate-200 dark:bg-slate-700 rounded-full transition-colors">
                            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white dark:bg-primary rounded-full transition-transform ${document.documentElement.classList.contains('dark') ? 'translate-x-6' : ''}`}></div>
                        </div>
                    </div>

                    {/* Notifications (placeholder) */}
                    <div className="p-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-gray-500">notifications</span>
                            <div>
                                <p className="font-semibold text-sm">Notifikasi</p>
                                <p className="text-xs text-slate-400">Pengaturan pemberitahuan</p>
                            </div>
                        </div>
                        <span className="text-xs text-slate-400">Segera hadir</span>
                    </div>
                </div>
            </main>

            <BottomNav />
        </div>
    );
}
