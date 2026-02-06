"use client";

import BottomNav from "@/components/BottomNav";

export default function Messages() {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24">
            <header className="bg-white dark:bg-slate-900 shadow-sm p-4 sticky top-0 z-10">
                <h1 className="text-xl font-bold">Pesan</h1>
            </header>
            <main className="p-4">
                <div className="text-center py-20 text-slate-400 flex flex-col items-center gap-4">
                    <span className="material-symbols-outlined text-6xl text-slate-200">chat_bubble_outline</span>
                    <p>Belum ada pesan masuk.</p>
                </div>
            </main>
            <BottomNav />
        </div>
    );
}
