"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAuth = async () => {
        setLoading(true);
        setError(null);
        try {
            if (isRegister) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        }
                    }
                });
                if (error) throw error;
                alert("Registrasi berhasil! Silakan cek email Anda untuk verifikasi.");
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.push("/");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
    };

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col max-w-[480px] mx-auto overflow-x-hidden">
            {/* Top App Bar */}
            <div className="flex items-center bg-transparent p-4 pb-2 justify-between">
                <Link href="/" className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                    <span className="material-symbols-outlined text-[#0d171b] dark:text-white">
                        arrow_back_ios_new
                    </span>
                </Link>
                <h2 className="text-[#0d171b] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">
                    Masuk
                </h2>
            </div>

            <div className="flex-1 flex flex-col px-4">
                {/* Headline Section */}
                <div className="pt-10 pb-6">
                    <h1 className="text-[#0d171b] dark:text-white tracking-tight text-[32px] font-bold leading-tight text-center">
                        Selamat Datang di Segora
                    </h1>
                    <p className="text-[#4c809a] dark:text-slate-400 text-base font-normal leading-normal pt-2 text-center">
                        Jual beli jasa & produk dengan mudah.
                    </p>
                </div>

                {/* Form Section */}
                <div className="space-y-4 pt-4">
                    {error && (
                        <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}
                    {isRegister && (
                        <div className="flex flex-wrap items-end gap-4">
                            <label className="flex flex-col min-w-40 flex-1">
                                <p className="text-[#0d171b] dark:text-white text-base font-medium leading-normal pb-2 ml-1">
                                    Nama Lengkap
                                </p>
                                <input
                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-full text-[#0d171b] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-[#cfdfe7] dark:border-slate-700 bg-white dark:bg-slate-900 h-14 placeholder:text-[#4c809a] px-6 text-base font-normal leading-normal transition-all"
                                    placeholder="Nama Lengkap"
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </label>
                        </div>
                    )}

                    {/* Email Field */}
                    <div className="flex flex-wrap items-end gap-4">
                        <label className="flex flex-col min-w-40 flex-1">
                            <p className="text-[#0d171b] dark:text-white text-base font-medium leading-normal pb-2 ml-1">
                                Email
                            </p>
                            <input
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-full text-[#0d171b] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-[#cfdfe7] dark:border-slate-700 bg-white dark:bg-slate-900 h-14 placeholder:text-[#4c809a] px-6 text-base font-normal leading-normal transition-all"
                                placeholder="Alamat Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </label>
                    </div>

                    {/* Password Field */}
                    <div className="flex flex-wrap items-end gap-4">
                        <label className="flex flex-col min-w-40 flex-1">
                            <p className="text-[#0d171b] dark:text-white text-base font-medium leading-normal pb-2 ml-1">
                                Kata Sandi
                            </p>
                            <div className="relative flex w-full flex-1 items-stretch">
                                <input
                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-full text-[#0d171b] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-[#cfdfe7] dark:border-slate-700 bg-white dark:bg-slate-900 h-14 placeholder:text-[#4c809a] px-6 pr-14 text-base font-normal leading-normal transition-all"
                                    placeholder="Masukkan kata sandi"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <div
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-[#4c809a] cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <span className="material-symbols-outlined">
                                        {showPassword ? "visibility_off" : "visibility"}
                                    </span>
                                </div>
                            </div>
                        </label>
                    </div>

                    {/* Forgot Password (only in Login) */}
                    {!isRegister && (
                        <div className="flex justify-end px-1">
                            <Link
                                className="text-primary text-sm font-semibold hover:underline"
                                href="#"
                            >
                                Lupa Kata Sandi?
                            </Link>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="mt-8 space-y-4">
                    <button
                        onClick={handleAuth}
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-full text-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? "Memuat..." : (isRegister ? "Daftar" : "Masuk")}
                    </button>

                    <div className="flex items-center gap-4 py-2">
                        <div className="h-[1px] flex-1 bg-[#cfdfe7] dark:bg-slate-700"></div>
                        <span className="text-[#4c809a] text-sm font-medium">Atau</span>
                        <div className="h-[1px] flex-1 bg-[#cfdfe7] dark:bg-slate-700"></div>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-900 border border-[#cfdfe7] dark:border-slate-700 py-4 rounded-full text-[#0d171b] dark:text-white font-semibold transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                        <Image
                            alt="Google Logo"
                            className="w-6 h-6"
                            width={24}
                            height={24}
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzkfkID_e6uIKr3-S0X4us-UAmc_3kKXZOYlrJvkciWlsqy5meNm6EEUmbB-R8eggOluIFk98aFzaHweXnE-jikVJBOaXeeJWNt_SG-N5tWtU_8dpbYylJXPOAtwmmJ2DY5rFfOInCqYWgnLu_uJJt3_IFkHzt7I9dM8tgdUNOqq58qwrwuQzao2xK8Uq5C2pX_em7x79NNvu7GmIAKt1PgUBFssgXe9gtfXF_FCW1duti_3xRjZfmvZcZdYQm6g8R8z732r855pM"
                        />
                        Lanjutkan dengan Google
                    </button>
                </div>

                {/* Footer Link */}
                <div className="mt-auto pb-10 pt-8 text-center">
                    <p className="text-[#4c809a] dark:text-slate-400 text-sm">
                        {isRegister ? "Sudah punya akun?" : "Belum punya akun?"}
                        <button
                            onClick={() => setIsRegister(!isRegister)}
                            className="text-primary font-bold hover:underline ml-1"
                        >
                            {isRegister ? "Masuk Sekarang" : "Daftar Sekarang"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
