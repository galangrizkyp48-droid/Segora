```
"use client";

import { useState } from "react";
import { campuses } from "@/data/campuses";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import AlertDialog from "@/components/AlertDialog";

export default function SelectCampus() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCampusId, setSelectedCampusId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [alertDialog, setAlertDialog] = useState<{ show: boolean; title: string; message: string }>({ show: false, title: '', message: '' });

    const filteredCampuses = campuses.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleConfirm = async () => {
        if (!selectedCampusId) {
            setAlertDialog({ show: true, title: 'Pilih Kampus', message: 'Silakan pilih kampus Anda terlebih dahulu' });
            return;
        }
        setLoading(true);

        const selectedCampus = campuses.find(c => c.id === selectedCampusId);
        if (!selectedCampus) {
            setAlertDialog({ show: true, title: 'Error', message: 'Kampus yang dipilih tidak ditemukan.' });
            setLoading(false);
            return;
        }

        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const { error } = await supabase.auth.updateUser({
                data: { campus: selectedCampus.id, campus_name: selectedCampus.name }
            });

            if (error) {
                setAlertDialog({ show: true, title: 'Gagal Menyimpan', message: "Gagal menyimpan kampus: " + error.message });
            } else {
                router.replace("/");
            }
        } else {
            // If not logged in, maybe just save to local storage or force login? 
            // Requirement says "users have registered or login", so we assume they are auth'd.
            router.push("/login");
        }
        setLoading(false);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col max-w-md mx-auto p-6 font-display">
            <h1 className="text-2xl font-bold text-[#0d171b] dark:text-white mb-2">Pilih Kampus Kamu</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                Konten akan disesuaikan dengan kampus pilihanmu.
            </p>

            {/* Search Bar */}
            <div className="relative mb-4">
                <span className="material-symbols-outlined absolute left-4 top-3 text-slate-400">search</span>
                <input
                    type="text"
                    placeholder="Cari nama kampus..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary outline-none"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto space-y-2 mb-20">
                {filteredCampuses.map((campus) => (
                    <div
                        key={campus.id}
                        onClick={() => setSelectedCampus(campus)}
                        className={`p - 4 rounded - xl border cursor - pointer transition - all flex items - center justify - between ${ selectedCampus?.id === campus.id ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900' } `}
                    >
                        <div>
                            <p className="font-bold text-[#0d171b] dark:text-white text-sm">{campus.name}</p>
                            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded textxs font-medium mt-1 inline-block">
                                {campus.type}
                            </span>
                        </div>
                        {selectedCampus?.id === campus.id && (
                            <span className="material-symbols-outlined text-primary">check_circle</span>
                        )}
                    </div>
                ))}
                {filteredCampuses.length === 0 && (
                    <div className="text-center py-10 text-slate-400 text-sm">
                        Kampus tidak ditemukan. Coba kata kunci lain.
                    </div>
                )}
            </div>

            {/* Bottom Button */}
            <div className="fixed bottom-0 left-0 right-0 p-4 max-w-md mx-auto bg-background-light dark:bg-background-dark border-t border-slate-200 dark:border-slate-800">
                <button
                    onClick={handleConfirm}
                    disabled={!selectedCampus || loading}
                    className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                >
                    {loading ? "Menyimpan..." : "Lanjut ke Beranda"}
                </button>
            </div>

            <AlertDialog
                show={alertDialog.show}
                title={alertDialog.title}
                message={alertDialog.message}
                onClose={() => setAlertDialog({ show: false, title: '', message: '' })}
            />
        </div>
    );
}
