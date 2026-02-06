"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";

export default function ChatDetail({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMessages = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            setUserId(user.id);

            const { data } = await supabase
                .from('messages')
                .select('*')
                .eq('chat_id', params.id)
                .order('created_at', { ascending: true });

            if (data) setMessages(data);
            setLoading(false);
        };
        fetchMessages();

        // Subscription for realtime could go here
    }, [params.id]);

    const handleSend = async () => {
        if (!newMessage.trim() || !userId) return;

        const { error } = await supabase.from('messages').insert({
            chat_id: params.id,
            sender_id: userId,
            content: newMessage
        });

        if (!error) {
            setNewMessage("");
            // Refresh messages (naive approach)
            const { data } = await supabase
                .from('messages')
                .select('*')
                .eq('chat_id', params.id)
                .order('created_at', { ascending: true });
            if (data) setMessages(data);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-[#0d171b] dark:text-white font-display min-h-screen flex flex-col">
            {/* TopAppBar */}
            <div className="flex items-center bg-white dark:bg-background-dark/80 backdrop-blur-md p-4 pb-2 justify-between border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()} className="material-symbols-outlined text-[#0d171b] dark:text-white">arrow_back_ios</button>
                    <div className="flex flex-col">
                        <h2 className="text-[#0d171b] dark:text-white text-base font-bold leading-tight tracking-tight">Percakapan</h2>
                    </div>
                </div>
            </div>

            {/* Chat Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                    <div className="text-center text-slate-400 mt-10">Loading messages...</div>
                ) : messages.length === 0 ? (
                    <div className="text-center text-slate-400 mt-10">Belum ada pesan. Sapa duluan!</div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className={`flex items-end gap-3 max-w-[85%] ${msg.sender_id === userId ? 'justify-end ml-auto' : ''}`}>
                            <div className={`flex flex-1 flex-col gap-1 ${msg.sender_id === userId ? 'items-end' : 'items-start'}`}>
                                <p className={`text-sm font-normal leading-relaxed rounded-2xl px-4 py-3 shadow-sm ${msg.sender_id === userId ? 'bg-primary text-white rounded-br-none' : 'bg-white dark:bg-slate-800 text-[#0d171b] dark:text-white rounded-bl-none'}`}>
                                    {msg.content}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-white dark:bg-background-dark border-t border-slate-100 dark:border-slate-800 flex items-center gap-3 pb-8">
                <div className="flex-1 relative">
                    <input
                        className="w-full h-11 bg-slate-100 dark:bg-slate-800 border-none rounded-full px-5 text-sm focus:ring-2 focus:ring-primary/50 placeholder:text-slate-400 text-[#0d171b] dark:text-white"
                        placeholder="Ketik pesan..."
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button
                        onClick={handleSend}
                        className="absolute right-2 top-1.5 h-8 w-8 flex items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">send</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
