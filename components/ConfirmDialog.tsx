"use client";

import { useEffect } from "react";

interface Props {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmColor?: 'primary' | 'danger';
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmText = "Ya",
    cancelText = "Batal",
    confirmColor = "primary",
    onConfirm,
    onCancel
}: Props) {
    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={onCancel}
        >
            <div
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm transform transition-all animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Icon */}
                <div className="flex justify-center pt-6">
                    <div className={`size-16 rounded-full flex items-center justify-center ${confirmColor === 'danger' ? 'bg-red-50 dark:bg-red-900/20' : 'bg-primary/10'
                        }`}>
                        <span className={`material-symbols-outlined text-3xl ${confirmColor === 'danger' ? 'text-red-500' : 'text-primary'
                            }`}>
                            {confirmColor === 'danger' ? 'warning' : 'help'}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 text-center">
                    <h3 className="text-lg font-bold text-[#0d171b] dark:text-white mb-2">{title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{message}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 p-4 pt-0">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 rounded-xl font-semibold text-sm border border-slate-200 dark:border-slate-700 text-[#0d171b] dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onCancel();
                        }}
                        className={`flex-1 py-3 rounded-xl font-semibold text-sm text-white transition-colors ${confirmColor === 'danger'
                                ? 'bg-red-500 hover:bg-red-600'
                                : 'bg-primary hover:bg-primary/90'
                            }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
