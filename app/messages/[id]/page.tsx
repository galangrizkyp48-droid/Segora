"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ChatDetail({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [status, setStatus] = useState("Deal");
    const [message, setMessage] = useState("");

    return (
        <div className="bg-background-light dark:bg-background-dark text-[#0d171b] dark:text-white font-display min-h-screen flex flex-col">
            {/* TopAppBar */}
            <div className="flex items-center bg-white dark:bg-background-dark/80 backdrop-blur-md p-4 pb-2 justify-between border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()} className="material-symbols-outlined text-[#0d171b] dark:text-white">arrow_back_ios</button>
                    <div className="flex size-10 shrink-0 items-center">
                        <div
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBZcRbft6MP8WFHJVVJnreAUrd6nHzs6ZvZOm8vY6Y1dj8cpvYMId9BOwg5oz33WAhBgxlhjv8jD5_t-yzgBnJFiKzTGR9UL8nn1sZAUFIZ9Zx-NxIOqwVTCBP1KmyHc0qGdf5mPgXXhll4CmxC_oERUdh1qgbW5AGHJ0EEuyHswaIrA8B1QHk9iIlEhP-R-B7BvoymKjEvm2Iq-jfIncrWcQtMbpH9qdilQHc2Gd6wYxm2GjglTo1_B-fYeVceTSVZetSvwDaeruk")' }}
                        ></div>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-[#0d171b] dark:text-white text-base font-bold leading-tight tracking-tight">Dimas Prayoga</h2>
                        <span className="text-xs text-green-500 font-medium">Online</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center justify-center rounded-full h-10 w-10 bg-transparent text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <span className="material-symbols-outlined text-[24px]">report</span>
                    </button>
                </div>
            </div>

            {/* SegmentedButtons (Transaction Status) */}
            <div className="bg-white dark:bg-background-dark border-b border-slate-100 dark:border-slate-800">
                <div className="flex px-4 py-3">
                    <div className="flex h-10 flex-1 items-center justify-center rounded-full bg-[#e7eff3] dark:bg-slate-800 p-1">
                        {['Diskusi', 'Deal', 'Selesai'].map((s) => (
                            <label key={s} className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-full px-2 transition-all ${status === s ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-[#4c809a]'} text-xs font-semibold uppercase tracking-wider`}>
                                <span className="truncate">{s}</span>
                                <input
                                    className="invisible w-0 absolute"
                                    name="status"
                                    type="radio"
                                    value={s}
                                    checked={status === s}
                                    onChange={() => setStatus(s)}
                                />
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Chat Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="flex justify-center my-4">
                    <span className="text-[10px] bg-slate-200 dark:bg-slate-800 px-3 py-1 rounded-full text-slate-500 font-medium uppercase tracking-widest">Hari Ini</span>
                </div>

                {/* SingleMessage (Seller) */}
                <div className="flex items-end gap-3 max-w-[85%]">
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-8 shrink-0 mb-1" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuABhoEgEWdCUFOVcfrXrvGNsCuu6iIvGKSAcWpTdB3SAvB2gc844adiLZyLlQTZiAjzeMIY9ceIjS7ef0tngsSrajj2EsowejnrurH18W2QbUNXsxIvvR4GqJxAnJafRDPJiwLn_3V22CcvNrGEOUUZEkcNHEQ_Nb5QGDvKdWqnYMhxRMJ5ujouxHnK86EDCIOCRT7DDq3wTAd-9gAH-OrJpM5HPoGt9GYog02gkHjclaodYoxPD9Sr2as6SXfKLuBQwcu9jcbOCA4")' }}></div>
                    <div className="flex flex-1 flex-col gap-1 items-start">
                        <p className="text-xs font-normal leading-normal px-2 text-slate-500">Dimas</p>
                        <p className="text-sm font-normal leading-relaxed rounded-2xl rounded-bl-none px-4 py-3 bg-white dark:bg-slate-800 text-[#0d171b] dark:text-white shadow-sm">Halo kak, ada yang bisa saya bantu terkait jasa joki tugasnya?</p>
                    </div>
                </div>

                {/* SingleMessage (Buyer) */}
                <div className="flex items-end gap-3 justify-end ml-auto max-w-[85%]">
                    <div className="flex flex-1 flex-col gap-1 items-end">
                        <p className="text-xs font-normal leading-normal px-2 text-slate-500">Saya</p>
                        <p className="text-sm font-normal leading-relaxed rounded-2xl rounded-br-none px-4 py-3 bg-primary text-white shadow-sm">Bisa kurang dikit lagi nggak kak? Untuk deadline besok sore.</p>
                    </div>
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-8 shrink-0 mb-1" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAeVC7_j58oes7gBN_9PvO7cqvJa44bKi6-Ds2DRcl23IgSUMIpA4Mafw4JLhedObLwvhOHdnEaSXygjYwNjZTCjxJH2cAFEf0GZFqEsDbD0zXRDOaD-0rxiLqtYJi2hmjTO-KD0wleRvPwXXJvpXvMq7NCdpIoJb0D_6nt-Qy6xceGdZZKwh6vbEaNPckwaYCqLshAhCYGVFGJM4Q2MER9F98COD5U9oAzY25hr3ZZe3qOxaFN_fKo3YxLCrckEfsQ5PjykkUECp8")' }}></div>
                </div>

                {/* Offer Card (Kartu Penawaran) */}
                <div className="p-2">
                    <div className="flex items-stretch justify-between gap-4 rounded-2xl bg-white dark:bg-slate-800 p-4 shadow-md border border-slate-100 dark:border-slate-700">
                        <div className="flex flex-[2_2_0px] flex-col gap-3">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-primary text-sm">handshake</span>
                                    <p className="text-primary text-[10px] font-bold uppercase tracking-wider">Kartu Penawaran</p>
                                </div>
                                <p className="text-[#0d171b] dark:text-white text-base font-bold leading-tight">Joki Makalah Ekonomi</p>
                                <p className="text-[#4c809a] dark:text-primary/80 text-lg font-extrabold">Rp 45.000</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="flex flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-full h-9 bg-primary text-white gap-1 text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                    <span className="truncate">Terima</span>
                                </button>
                                <button className="flex flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-full h-9 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                                    <span className="truncate">Tolak</span>
                                </button>
                            </div>
                        </div>
                        <div className="w-24 h-24 bg-center bg-no-repeat bg-cover rounded-xl shrink-0" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCGOFbTqebyru63yXq7GxpPfL5ieoWaRRglH2Z5HD4affLX_ARtFfJEJ3ySPL3iOWyC8l7PgjRQHk5nwc9hVmXcd5FhafRABYWhYXJiDXcZGxy8X0RuOeHS-vsFVtjcOpcttL_KsneCr1edp0a7LvLgomGSmCrbls35yZhb3Ucrx42IGMvxw9PHGx-EvgbxH3JukXjR65WXAr46TwSSD8iFZabZ-qqY6OZi79c5aYjA2S5PNZGcq-9oZJaG9gdskY6Jz1dxXR5zH4Y")' }}></div>
                    </div>
                    <p className="text-[10px] text-center mt-2 text-slate-400">Jaga keamanan transaksimu dengan bayar via SEGORA</p>
                </div>

                {/* SingleMessage (Seller) */}
                <div className="flex items-end gap-3 max-w-[85%]">
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-8 shrink-0 mb-1" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC4-F9kSKitgcE5d-ASby5knNYqvL9rt4LAj3AqtrGtC-yt537Cjky68QGUlOAJNJb28mNH1N6uofYpDguqmcYNUyZjnpL9vMtKO5QQqeNnxKHZRA3zd_qyQ24zbKj6D7GDtZxUaWvT4_v8MKNYbVcpgYRsgJbb9bX4jpR7NAQWGdzMN78TvH2SAfHaslCi-PSeoHBx3dJbW_TctEYXdl7KTfTnxcRq6qcia2C-1YSCK0CEfRv5gFmlHO2b-oCsBV9m6tOmEfXXab0")' }}></div>
                    <div className="flex flex-1 flex-col gap-1 items-start">
                        <p className="text-xs font-normal leading-normal px-2 text-slate-500">Dimas</p>
                        <p className="text-sm font-normal leading-relaxed rounded-2xl rounded-bl-none px-4 py-3 bg-white dark:bg-slate-800 text-[#0d171b] dark:text-white shadow-sm">Oke deal ya kak. Langsung dikerjakan setelah konfirmasi.</p>
                    </div>
                </div>
            </div>

            {/* Quick Replies */}
            <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
                {['Bisa COD?', 'Ready kak?', 'Ada portofolio?'].map((reply) => (
                    <button key={reply} className="whitespace-nowrap px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        {reply}
                    </button>
                ))}
            </div>

            {/* Action Area (Konfirmasi Selesai) */}
            <div className="px-4 pb-2">
                <button className="w-full flex items-center justify-center gap-2 h-12 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors active:scale-95">
                    <span className="material-symbols-outlined">verified</span>
                    Konfirmasi Selesai
                </button>
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-white dark:bg-background-dark border-t border-slate-100 dark:border-slate-800 flex items-center gap-3 pb-8">
                <button className="material-symbols-outlined text-slate-400 hover:text-primary transition-colors">add_circle</button>
                <div className="flex-1 relative">
                    <input
                        className="w-full h-11 bg-slate-100 dark:bg-slate-800 border-none rounded-full px-5 text-sm focus:ring-2 focus:ring-primary/50 placeholder:text-slate-400 text-[#0d171b] dark:text-white"
                        placeholder="Ketik pesan..."
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button className="absolute right-2 top-1.5 h-8 w-8 flex items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90 transition-colors">
                        <span className="material-symbols-outlined text-sm">send</span>
                    </button>
                </div>
                <button className="material-symbols-outlined text-slate-400 hover:text-primary transition-colors">image</button>
            </div>
        </div>
    );
}
