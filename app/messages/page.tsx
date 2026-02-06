"use client";

import BottomNav from "@/components/BottomNav";
import Link from "next/link";

export default function Messages() {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24">
            <header className="bg-white dark:bg-slate-900 shadow-sm p-4 sticky top-0 z-10">
                <h1 className="text-xl font-bold">Pesan</h1>
            </header>
            <main className="p-4">
                <div className="space-y-4">
                    <Link href="/messages/1">
                        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors cursor-pointer">
                            <div
                                className="size-12 rounded-full bg-cover bg-center border border-slate-200 dark:border-slate-700"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBZcRbft6MP8WFHJVVJnreAUrd6nHzs6ZvZOm8vY6Y1dj8cpvYMId9BOwg5oz33WAhBgxlhjv8jD5_t-yzgBnJFiKzTGR9UL8nn1sZAUFIZ9Zx-NxIOqwVTCBP1KmyHc0qGdf5mPgXXhll4CmxC_oERUdh1qgbW5AGHJ0EEuyHswaIrA8B1QHk9iIlEhP-R-B7BvoymKjEvm2Iq-jfIncrWcQtMbpH9qdilQHc2Gd6wYxm2GjglTo1_B-fYeVceTSVZetSvwDaeruk")' }}
                            ></div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-sm text-[#0d171b] dark:text-white truncate">Dimas Prayoga</h3>
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap">Baru saja</span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Oke deal ya kak. Langsung dikerjakan...</p>
                            </div>
                            <div className="size-2 rounded-full bg-green-500"></div>
                        </div>
                    </Link>

                    {/* Placeholder for empty state if needed later */}
                    {/* <div className="text-center py-20 text-slate-400 flex flex-col items-center gap-4">
                        <span className="material-symbols-outlined text-6xl text-slate-200">chat_bubble_outline</span>
                        <p>Belum ada pesan masuk.</p>
                    </div> */}
                </div>
            </main>
            <BottomNav />
        </div>
    );
}
