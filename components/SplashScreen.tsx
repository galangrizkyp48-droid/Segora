"use client";

import { useEffect, useState } from "react";

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onFinish, 500); // Allow exit animation
        }, 3000);

        return () => clearTimeout(timer);
    }, [onFinish]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background-light dark:bg-background-dark animate-fade-out">
            <div className="flex flex-col items-center gap-6 animate-fade-in-up">
                <div className="w-32 h-32 bg-primary rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/30">
                    <span className="material-symbols-outlined text-6xl text-white">school</span>
                </div>
                <h1 className="text-3xl font-extrabold text-primary tracking-tight">SEGORA</h1>

                <div className="absolute bottom-10 px-6 text-center">
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Aplikasi yang dibuat oleh</p>
                    <p className="text-[#0d171b] dark:text-white text-base font-bold mt-1">Galang Rizky Pratama</p>
                    <p className="text-primary text-sm font-bold">Mahasiswa Untirta</p>
                </div>
            </div>
        </div>
    );
}
