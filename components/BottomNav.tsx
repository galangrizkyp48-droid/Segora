"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="fixed bottom-0 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-100 dark:border-slate-800 px-6 py-2 pb-6 flex justify-between items-center z-40">
            <Link href="/" className={`flex flex-col items-center gap-1 ${isActive("/") ? "text-primary" : "text-[#4c809a] dark:text-slate-400"}`}>
                <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: isActive("/") ? "'FILL' 1" : "'FILL' 0" }}>home</span>
                <span className={`text-[10px] ${isActive("/") ? "font-bold" : "font-medium"}`}>Beranda</span>
            </Link>

            <Link href="/explore" className={`flex flex-col items-center gap-1 ${isActive("/explore") ? "text-primary" : "text-[#4c809a] dark:text-slate-400"}`}>
                <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: isActive("/explore") ? "'FILL' 1" : "'FILL' 0" }}>explore</span>
                <span className={`text-[10px] ${isActive("/explore") ? "font-bold" : "font-medium"}`}>Jelajah</span>
            </Link>

            <div className="flex flex-col items-center">
                <Link href="/create-offer">
                    <div className="bg-primary size-12 rounded-full flex items-center justify-center text-white -mt-8 shadow-lg shadow-primary/30 border-4 border-background-light dark:border-background-dark">
                        <span className="material-symbols-outlined text-[28px]">add</span>
                    </div>
                </Link>
                <span className="text-[10px] font-medium text-[#4c809a] mt-1">Jual</span>
            </div>

            <Link href="/messages" className={`flex flex-col items-center gap-1 ${isActive("/messages") ? "text-primary" : "text-[#4c809a] dark:text-slate-400"}`}>
                <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: isActive("/messages") ? "'FILL' 1" : "'FILL' 0" }}>chat_bubble</span>
                <span className={`text-[10px] ${isActive("/messages") ? "font-bold" : "font-medium"}`}>Pesan</span>
            </Link>

            <Link href="/profile" className={`flex flex-col items-center gap-1 ${isActive("/profile") ? "text-primary" : "text-[#4c809a] dark:text-slate-400"}`}>
                <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: isActive("/profile") ? "'FILL' 1" : "'FILL' 0" }}>person</span>
                <span className={`text-[10px] ${isActive("/profile") ? "font-bold" : "font-medium"}`}>Profil</span>
            </Link>
        </nav>
    );
}
