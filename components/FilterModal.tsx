"use client";

import { Dispatch, SetStateAction } from "react";

interface FilterModalProps {
    showModal: boolean;
    setShowModal: Dispatch<SetStateAction<boolean>>;
    filters: {
        minPrice: string;
        maxPrice: string;
        minRating: number;
        location: string;
        sortBy: string;
    };
    setFilters: Dispatch<SetStateAction<{
        minPrice: string;
        maxPrice: string;
        minRating: number;
        location: string;
        sortBy: string;
    }>>;
}

export default function FilterModal({ showModal, setShowModal, filters, setFilters }: FilterModalProps) {
    if (!showModal) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 z-[100] flex items-end sm:items-center sm:justify-center"
            onClick={() => setShowModal(false)}
        >
            <div
                className="bg-white dark:bg-slate-900 w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Filter & Urutkan</h2>
                    <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-bold mb-3">Rentang Harga</label>
                    <div className="flex gap-3">
                        <input
                            type="number"
                            placeholder="Min"
                            value={filters.minPrice}
                            onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                            className="flex-1 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary bg-white dark:bg-slate-800"
                        />
                        <span className="self-center">-</span>
                        <input
                            type="number"
                            placeholder="Max"
                            value={filters.maxPrice}
                            onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                            className="flex-1 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary bg-white dark:bg-slate-800"
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-bold mb-3">Rating Minimum</label>
                    <div className="flex gap-2">
                        {[0, 3, 4, 5].map((rating) => (
                            <button
                                key={rating}
                                onClick={() => setFilters(prev => ({ ...prev, minRating: rating }))}
                                className={`flex-1 py-2 rounded-lg text-sm font-semibold ${filters.minRating === rating ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
                            >
                                {rating === 0 ? 'Semua' : `${rating}+`}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-bold mb-3">Urutkan</label>
                    <div className="grid grid-cols-2 gap-3">
                        {[['', 'Terbaru'], ['price_asc', 'Harga Terendah'], ['price_desc', 'Harga Tertinggi'], ['rating', 'Rating Tertinggi']].map(([value, label]) => (
                            <button
                                key={value}
                                onClick={() => setFilters(prev => ({ ...prev, sortBy: value }))}
                                className={`py-2 rounded-lg text-sm font-semibold ${filters.sortBy === value ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-3 mt-8">
                    <button
                        onClick={() => {
                            setFilters({ minPrice: '', maxPrice: '', minRating: 0, location: '', sortBy: '' });
                            setShowModal(false);
                        }}
                        className="flex-1 py-3 rounded-lg border border-slate-300 dark:border-slate-700 font-semibold"
                    >
                        Reset
                    </button>
                    <button
                        onClick={() => setShowModal(false)}
                        className="flex-1 py-3 rounded-lg bg-primary text-white font-semibold"
                    >
                        Terapkan
                    </button>
                </div>
            </div>
        </div>
    );
}