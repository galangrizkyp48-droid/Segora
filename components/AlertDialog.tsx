"use client";

import { useEffect } from "react";

interface Props {
    isOpen: boolean;
    title?: string;
    message: string;
    type?: 'success' | 'error' | 'info' | 'warning';
    onClose: () => void;
    autoClose?: number; // Auto close after milliseconds
}

export default function AlertDialog({
    isOpen,
    title,
    message,
    type = 'info',
    onClose,
    autoClose
}: Props) {
    // Auto close
    useEffect(() => {
        if (isOpen && autoClose) {
            const timer = setTimeout(onClose, autoClose);
            return () => clearTimeout(timer);
        }
    }, [isOpen, autoClose, onClose]);

    // Prevent body scroll
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

    const config = {
        success: {
            icon: 'check_circle',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
            iconColor: 'text-green-500',
            defaultTitle: 'Berhasil!'
        },
        error: {
            icon: 'error',
            bgColor: 'bg-red-50 dark:bg-red-900/20',
            iconColor: 'text-red-500',
            defaultTitle: 'Gagal!'
        },
        warning: {
            icon: 'warning',
            bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
            iconColor: 'text-yellow-500',
            defaultTitle: 'Peringatan'
        },
        info: {
            icon: 'info',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            iconColor: 'text-blue-500',
            defaultTitle: 'Informasi'
        }
    };

    const styles = config[type];

    return (
        <div
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm transform transition-all animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Icon */}
                <div className="flex justify-center pt-6">
                    <div className={`size-16 rounded-full flex items-center justify-center ${styles.bgColor}`}>
                        <span className={`material-symbols-outlined text-3xl ${styles.iconColor}`}>
                            {styles.icon}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 text-center">
                    {title && <h3 className="text-lg font-bold text-[#0d171b] dark:text-white mb-2">{title}</h3>}
                    {!title && <h3 className="text-lg font-bold text-[#0d171b] dark:text-white mb-2">{styles.defaultTitle}</h3>}
                    <p className="text-sm text-slate-600 dark:text-slate-400">{message}</p>
                </div>

                {/* Action */}
                <div className="p-4 pt-0">
                    <button
                        onClick={onClose}
                        className="w-full py-3 rounded-xl font-semibold text-sm bg-primary text-white hover:bg-primary/90 transition-colors"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
}
