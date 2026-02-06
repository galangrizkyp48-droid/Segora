"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReportPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState(0);
    const [reportReason, setReportReason] = useState("");
    const [reportText, setReportText] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0 && !reportReason) {
            alert("Mohon berikan ulasan atau pilih alasan pelaporan.");
            return;
        }

        setSubmitting(true);
        // Mock submission
        await new Promise(resolve => setTimeout(resolve, 1000));

        alert("Laporan dan ulasan Anda telah dikirim. Terima kasih telah membantu menjaga keamanan Segora.");
        router.back();
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-[#0d171b] dark:text-slate-100 min-h-screen font-display">
            <div className="max-w-[480px] mx-auto min-h-screen flex flex-col pb-10 shadow-xl bg-white dark:bg-background-dark">
                {/* TopAppBar */}
                <header className="sticky top-0 z-50 flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between border-b border-slate-200 dark:border-slate-800">
                    <button onClick={() => router.back()} className="text-[#0d171b] dark:text-slate-100 flex size-12 shrink-0 items-center justify-start">
                        <span className="material-symbols-outlined cursor-pointer">close</span>
                    </button>
                    <h2 className="text-[#0d171b] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Keamanan & Ulasan</h2>
                    <div className="flex w-12 items-center justify-end">
                        <button className="flex items-center justify-center rounded-full h-12 bg-transparent text-primary">
                            <span className="material-symbols-outlined">help</span>
                        </button>
                    </div>
                </header>

                <main className="flex flex-col gap-2">
                    {/* Safety Banner Card */}
                    <div className="p-4">
                        <div className="flex items-stretch justify-between gap-4 rounded-xl bg-primary/10 dark:bg-primary/5 p-4 border border-primary/20">
                            <div className="flex flex-col gap-1 flex-[2_2_0px]">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="material-symbols-outlined text-primary text-sm filled">gpp_maybe</span>
                                    <p className="text-primary text-xs font-bold leading-normal uppercase tracking-wider">PENTING</p>
                                </div>
                                <p className="text-[#0d171b] dark:text-white text-base font-bold leading-tight">Tips Aman Bertransaksi</p>
                                <p className="text-slate-600 dark:text-slate-400 text-sm font-normal leading-normal">Jangan pernah melakukan pembayaran di luar SEGORA untuk menghindari penipuan.</p>
                            </div>
                            <div
                                className="w-24 h-24 bg-center bg-no-repeat bg-cover rounded-xl shrink-0"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCLzgbkcsFHWygVUse76Qj4gLc2ZhgK3c-w9u8LgaOy6hFpPbtb8UP9y6MxSRyTIRED_KD1TdCj-YSe264aDm_W9brngFMNtdCNjNcOnAmwcjvjB0Ka1fbEy25eZa-fkPd-0VL48ULmRlWd2xjkW4l6Q-QCeFNJ238Ci7UduVxO99HoApdVb5BeMYKXP-G3I0PI6BKwmYNCouaYcW8li_jqZSh-lGqZxbdlBrrNhQ1A42A8SYR_8bKIH3gYh91fnxQa880XNwrdHWA")' }}
                            >
                            </div>
                        </div>
                    </div>

                    {/* Review Section */}
                    <section className="bg-white dark:bg-slate-900 mx-4 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
                        <h3 className="text-[#0d171b] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] mb-4">Ulasan Transaksi</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">Berikan penilaian untuk pengguna ini</p>
                        <div className="flex gap-2 mb-6 justify-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button key={star} onClick={() => setRating(star)}>
                                    <span className={`material-symbols-outlined text-4xl ${star <= rating ? 'text-primary' : 'text-slate-300 dark:text-slate-700'}`}>star</span>
                                </button>
                            ))}
                        </div>
                        <div className="flex flex-col gap-4">
                            <label className="flex flex-col w-full">
                                <p className="text-[#0d171b] dark:text-slate-200 text-base font-medium leading-normal pb-2">Bagaimana pengalamanmu?</p>
                                <textarea
                                    className="form-input flex w-full resize-none overflow-hidden rounded-xl text-[#0d171b] dark:text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-[#cfdfe7] dark:border-slate-700 bg-slate-50 dark:bg-slate-800 placeholder:text-slate-400 p-[15px] text-base font-normal min-h-[120px]"
                                    placeholder="Tulis ulasan singkat tentang kualitas layanan atau produk..."
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                ></textarea>
                            </label>
                            <button className="flex items-center gap-2 text-primary font-semibold text-sm">
                                <span className="material-symbols-outlined">add_a_photo</span>
                                Tambah Foto Bukti
                            </button>
                        </div>
                    </section>

                    <div className="h-4"></div>

                    {/* Report Section Header */}
                    <section>
                        <div className="px-4">
                            <h3 className="text-[#0d171b] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Laporkan Pengguna</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Jika ada kendala serius, beri tahu kami agar kami bisa bertindak.</p>
                        </div>

                        {/* RadioList */}
                        <div className="flex flex-col gap-3 p-4">
                            {["Penipuan / Phishing", "Barang/Jasa tidak sesuai deskripsi", "Perilaku tidak sopan / Pelecehan", "Akun Palsu / Spam"].map((reason) => (
                                <label key={reason} className={`flex items-center gap-4 rounded-xl border border-solid p-[15px] flex-row-reverse cursor-pointer transition-colors ${reportReason === reason ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-[#cfdfe7] dark:border-slate-700 bg-white dark:bg-slate-900'}`}>
                                    <input
                                        className="radio-custom h-5 w-5 border-2 border-[#cfdfe7] dark:border-slate-600 bg-transparent text-transparent checked:border-primary focus:outline-none focus:ring-0 focus:ring-offset-0 text-primary"
                                        name="report_reason"
                                        type="radio"
                                        checked={reportReason === reason}
                                        onChange={() => setReportReason(reason)}
                                    />
                                    <div className="flex grow flex-col">
                                        <p className="text-[#0d171b] dark:text-slate-200 text-sm font-medium leading-normal">{reason}</p>
                                    </div>
                                </label>
                            ))}
                        </div>

                        {/* TextField */}
                        <div className="px-4 py-3">
                            <label className="flex flex-col w-full">
                                <p className="text-[#0d171b] dark:text-slate-200 text-base font-medium leading-normal pb-2">Detail Tambahan Laporan</p>
                                <textarea
                                    className="form-input flex w-full resize-none overflow-hidden rounded-xl text-[#0d171b] dark:text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-[#cfdfe7] dark:border-slate-700 bg-white dark:bg-slate-900 placeholder:text-slate-400 p-[15px] text-base font-normal min-h-36"
                                    placeholder="Ceritakan lebih lanjut tentang kendala yang kamu alami agar tim kami dapat menginvestigasi..."
                                    value={reportText}
                                    onChange={(e) => setReportText(e.target.value)}
                                ></textarea>
                            </label>
                        </div>
                    </section>

                    {/* Sticky Bottom Button Area */}
                    <div className="p-4 mt-4 mb-8">
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-70"
                        >
                            {submitting ? "Mengirim..." : "Kirim Laporan & Ulasan"}
                        </button>
                        <button
                            onClick={() => router.back()}
                            className="w-full bg-transparent text-slate-500 dark:text-slate-400 py-3 mt-2 font-medium"
                        >
                            Batal
                        </button>
                    </div>
                </main>
                {/* Bottom Tab Space */}
                <div className="h-10"></div>
            </div>
        </div>
    );
}
