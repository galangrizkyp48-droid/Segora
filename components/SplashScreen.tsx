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
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white animate-fade-out">
            <div className="flex flex-col items-center gap-6 animate-fade-in-up">
                <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-700">
                    <div className="shadow-xl rounded-full p-2 bg-slate-50 border border-slate-100">
                        <img src="/logo.png" alt="Segora Logo" className="w-28 h-28 object-contain" />
                    </div>
                    <div className="text-center text-slate-800">
                        <p className="text-sm font-medium opacity-60">Aplikasi yang dibuat oleh</p>
                        <h1 className="text-xl font-bold mt-1 text-primary">Galang Rizky Pratama</h1>
                        <p className="text-xs opacity-50 mt-1">Mahasiswa Untirta</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
