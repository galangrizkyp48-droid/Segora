"use client";

import { useEffect, useState } from "react";
import { campuses } from "@/data/campuses";
import { supabase } from "@/utils/supabase/client";

export default function CampusPopup({ onSelect }: { onSelect: (campusId: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<typeof campuses[0] | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkCampus = async () => {
            // Priority 1: Check Local Storage (e.g. for guests or previous sessions)
            const localCampus = localStorage.getItem("selectedCampus");
            if (localCampus) {
                return; // Already selected
            }

            // Priority 2: Check Authenticated User Profile
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.user_metadata?.campus) {
                // Determine if we should sync local storage or just perform callback?
                // Let's ensure local storage matches for consistency
                localStorage.setItem("selectedCampus", user.user_metadata.campus);
                return;
            }

            // If neither, show popup
            setIsOpen(true);
        };
        checkCampus();
    }, []);

    const handleConfirm = async () => {
        if (!selected) return;
        setLoading(true);

        // Always save to local storage
        localStorage.setItem("selectedCampus", selected.id);

        // If authenticated, update profile
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            await supabase.auth.updateUser({
                data: { campus: selected.id, campus_name: selected.name }
            });
        }

        setLoading(false);
        setIsOpen(false);
        onSelect(selected.id);
    };

    if (!isOpen) return null;

    const filteredCampuses = campuses.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 flex flex-col max-h-[85vh] shadow-2xl animate-in slide-in-from-bottom-10 duration-500">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-[#0d171b] dark:text-white">Pilih Kampus Kamu</h2>
                    <p className="text-slate-500 text-sm mt-1">Konten akan disesuaikan dengan kampusmu</p>
                </div>

                {/* Search */}
                <div className="relative mb-4 shrink-0">
                    <span className="material-symbols-outlined absolute left-4 top-3 text-slate-400">search</span>
                    <input
                        type="text"
                        placeholder="Cari kampus..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary outline-none text-[#0d171b] dark:text-white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
                    {filteredCampuses.map((campus) => (
                        <div
                            key={campus.id}
                            onClick={() => setSelected(campus)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${selected?.id === campus.id ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                        >
                            <div>
                                <p className="font-bold text-[#0d171b] dark:text-white text-sm">{campus.name}</p>
                                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded font-medium mt-1 inline-block">
                                    {campus.type}
                                </span>
                            </div>
                            {selected?.id === campus.id && (
                                <span className="material-symbols-outlined text-primary">check_circle</span>
                            )}
                        </div>
                    ))}
                    {filteredCampuses.length === 0 && (
                        <div className="text-center py-8 text-slate-400 text-sm">
                            Tidak ditemukan.
                        </div>
                    )}
                </div>

                {/* Button */}
                <div className="mt-6 shrink-0">
                    <button
                        onClick={handleConfirm}
                        disabled={!selected || loading}
                        className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                    >
                        {loading ? "Menyimpan..." : "Lanjut Jelajahi"}
                    </button>
                </div>
            </div>
        </div>
    );
}
