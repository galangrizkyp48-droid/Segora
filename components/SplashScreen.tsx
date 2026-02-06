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
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-blue-400 animate-fade-out">
            <div className="flex flex-col items-center gap-6 animate-fade-in-up">
                <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-700">
                    <div className="shadow-2xl rounded-full p-1 bg-white/20 backdrop-blur-sm">
                        <img src="/logo.png" alt="Segora Logo" className="w-32 h-32 object-contain" />
                    </div>
                    <div className="text-center text-white">
                        <p className="text-sm font-medium opacity-90">Aplikasi yang dibuat oleh</p>
                        <h1 className="text-xl font-bold mt-1">Galang Rizky Pratama</h1>
                        <p className="text-xs opacity-75 mt-1">Mahasiswa Untirta</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
