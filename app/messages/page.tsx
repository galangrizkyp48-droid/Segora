"use client";

import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function Messages() {
    const [chats, setChats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChats = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Simple fetch for now. In a real app, we'd broaden this to include profiles.
            // Since we just added the tables, it will likely be empty.
            const { data } = await supabase
                .from('chats')
                .select(`
                    id,
                    created_at,
                    item:items!item_id (title, image_url)
                `)
                .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
                .order('created_at', { ascending: false });

            if (data) {
                // Fetch unread counts
                const { data: unreadData } = await supabase
                    .from('messages')
                    .select('chat_id')
                    .eq('is_read', false)
                    .neq('sender_id', user.id);

                const unreadCounts = (unreadData || []).reduce((acc: any, msg: any) => {
                    acc[msg.chat_id] = (acc[msg.chat_id] || 0) + 1;
                    return acc;
                }, {});

                // Combine data
                const chatsWithUnread = data.map(chat => ({
                    ...chat,
                    unread_count: unreadCounts[chat.id] || 0
                }));

                setChats(chatsWithUnread);
            }
            setLoading(false);
        };
        fetchChats();
    }, []);

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24">
            <header className="bg-white dark:bg-slate-900 shadow-sm p-4 sticky top-0 z-10">
                <h1 className="text-xl font-bold">Pesan</h1>
            </header>
            <main className="p-4">
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-10 text-slate-400">Loading...</div>
                    ) : chats.length > 0 ? (
                        chats.map((chat) => (
                            <Link href={`/messages/${chat.id}`} key={chat.id}>
                                <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors cursor-pointer">
                                    <div
                                        className="size-12 rounded-full bg-cover bg-center border border-slate-200 dark:border-slate-700"
                                        style={{ backgroundImage: `url("${chat.item?.image_url || 'https://via.placeholder.com/150'}")` }}
                                    ></div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-bold text-sm text-[#0d171b] dark:text-white truncate">{chat.item?.title || 'Percakapan'}</h3>
                                            <div className="flex flex-col items-end">
                                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap">
                                                    {new Date(chat.created_at).toLocaleDateString()}
                                                </span>
                                                {chat.unread_count > 0 && (
                                                    <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full mt-1">
                                                        {chat.unread_count}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Ketuk untuk melihat pesan</p>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center py-20 text-slate-400 flex flex-col items-center gap-4">
                            <span className="material-symbols-outlined text-6xl text-slate-200">chat_bubble_outline</span>
                            <p>Belum ada pesan masuk.</p>
                            <Link href="/explore" className="text-primary text-sm font-bold">Mulai Jualan / Belanja</Link>
                        </div>
                    )}
                </div>
            </main>
            <BottomNav />
        </div>
    );
}
