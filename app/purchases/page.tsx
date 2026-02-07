"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";
import BottomNav from "@/components/BottomNav";

interface Transaction {
    id: string;
    item_id: string;
    seller_id: string;
    status: string;
    total_price: number;
    created_at: string;
    item: {
        title: string;
        image_url: string;
    };
}

export default function Purchases() {
    const router = useRouter();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTransactions() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }

            const { data } = await supabase
                .from('transactions')
                .select(`
                    id,
                    item_id,
                    seller_id,
                    status,
                    total_price,
                    created_at,
                    item:items(title, image_url)
                `)
                .eq('buyer_id', user.id)
                .order('created_at', { ascending: false });

            if (data) {
                setTransactions(data as any);
            }
            setLoading(false);
        }
        fetchTransactions();
    }, [router]);

    const getStatusBadge = (status: string) => {
        const styles = {
            pending: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400',
            completed: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400',
            cancelled: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
        };
        const labels = {
            pending: 'Pending',
            completed: 'Selesai',
            cancelled: 'Dibatalkan'
        };

        return (
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${styles[status as keyof typeof styles]}`}>
                {labels[status as keyof typeof labels]}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24">
            {/* Header */}
            <header className="bg-white dark:bg-slate-900 shadow-sm p-4 sticky top-0 z-10 flex items-center gap-3">
                <button onClick={() => router.back()} className="text-[#0d171b] dark:text-white">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="text-xl font-bold flex-1">Riwayat Pembelian</h1>
            </header>

            <main className="p-4">
                {loading ? (
                    <div className="text-center py-20">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-500">Loading...</p>
                    </div>
                ) : transactions.length > 0 ? (
                    <div className="space-y-3">
                        {transactions.map((transaction) => (
                            <Link href={`/offer/${transaction.item_id}`} key={transaction.id}>
                                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-4 hover:shadow-md transition-shadow cursor-pointer">
                                    <div className="flex gap-3">
                                        <div
                                            className="w-20 h-20 rounded-lg bg-cover bg-center border border-slate-200 dark:border-slate-700 shrink-0"
                                            style={{ backgroundImage: `url("${transaction.item?.image_url}")` }}
                                        ></div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-bold text-sm text-[#0d171b] dark:text-white truncate">
                                                    {transaction.item?.title}
                                                </h3>
                                                {getStatusBadge(transaction.status)}
                                            </div>
                                            <p className="text-primary font-bold text-base mb-1">
                                                {new Intl.NumberFormat('id-ID', {
                                                    style: 'currency',
                                                    currency: 'IDR',
                                                    maximumFractionDigits: 0
                                                }).format(transaction.total_price)}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                {new Date(transaction.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-slate-400">
                        <span className="material-symbols-outlined text-6xl mb-4 block">shopping_bag</span>
                        <p className="text-lg font-semibold mb-1">Belum ada pembelian</p>
                        <p className="text-sm">Riwayat pembelian kamu akan muncul di sini</p>
                        <Link href="/explore">
                            <button className="mt-6 px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors">
                                Jelajahi Produk
                            </button>
                        </Link>
                    </div>
                )}
            </main>

            <BottomNav />
        </div>
    );
}
