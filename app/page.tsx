"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { campuses } from "@/data/campuses";
import CampusPopup from "@/components/CampusPopup";
import { Item } from "@/utils/types";
import BottomNav from "@/components/BottomNav";
import FilterModal from "@/components/FilterModal";
import { eventBus } from "@/utils/eventBus";

import { useRouter } from "next/navigation";

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [favorites, setFavorites] = useState<string[]>([]); // Store favorite item IDs

  // Refresh trigger for when campus is selected
  const [refresh, setRefresh] = useState(false);

  // Category filter
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter modal
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minRating: 0,
    location: '',
    sortBy: ''
  });

  useEffect(() => {
    async function fetchItems() {
      let query = supabase
        .from('items')
        .select(`*, category:categories(name)`);

      const { data: { user } } = await supabase.auth.getUser();

      // 1. Search filter
      if (search) {
        query = query.ilike('title', `%${search}%`);
      }

      // 2. Campus filtering
      let campus = user?.user_metadata?.campus;
      if (!campus) {
        campus = localStorage.getItem("selectedCampus");
      }
      if (campus) {
        query = query.eq('campus', campus);
      }

      // 3. Category filter (using category name from join)
      if (selectedCategory && selectedCategory !== 'Semua') {
        query = query.eq('category.name', selectedCategory);
      }

      // 4. Price range filter
      if (filters.minPrice) {
        query = query.gte('price', parseInt(filters.minPrice));
      }
      if (filters.maxPrice) {
        query = query.lte('price', parseInt(filters.maxPrice));
      }

      // 5. Sort by
      if (filters.sortBy === 'price_asc') {
        query = query.order('price', { ascending: true });
      } else if (filters.sortBy === 'price_desc') {
        query = query.order('price', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data } = await query;
      if (data) setItems(data);
    }
    const timeout = setTimeout(fetchItems, 500);
    return () => clearTimeout(timeout);
  }, [search, refresh, selectedCategory, filters]);

  //Fetch user favorites
  useEffect(() => {
    async function fetchFavorites() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('favorites')
        .select('item_id')
        .eq('user_id', user.id);

      if (data) {
        setFavorites(data.map(f => f.item_id));
      }
    }
    fetchFavorites();
  }, []);

  // Listen for item deletion events
  useEffect(() => {
    const handleItemDeleted = (itemId: string) => {
      setItems(prev => prev.filter(item => item.id !== itemId));
    };

    eventBus.on('item:deleted', handleItemDeleted);
    return () => eventBus.off('item:deleted', handleItemDeleted);
  }, []);

  const handleInteraction = async (action: () => void) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/login"); // Guard for guests
    } else {
      action();
    }
  };

  const handleChatSeller = async (item: Item) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/login');
      return;
    }

    // Prevent self-message
    if (item.seller_id === session.user.id) {
      alert('Anda tidak bisa mengirim pesan ke diri sendiri!');
      return;
    }

    // Find existing chat
    const { data: existingChat } = await supabase
      .from('chats')
      .select('id')
      .or(`and(user_a.eq.${session.user.id},user_b.eq.${item.seller_id}),and(user_a.eq.${item.seller_id},user_b.eq.${session.user.id})`)
      .eq('item_id', item.id)
      .single();

    if (existingChat) {
      router.push(`/messages/${existingChat.id}`);
      return;
    }

    // Create new chat
    const { data: newChat } = await supabase
      .from('chats')
      .insert({
        user_a: session.user.id,
        user_b: item.seller_id,
        item_id: item.id
      })
      .select('id')
      .single();

    if (newChat) {
      router.push(`/messages/${newChat.id}`);
    }
  };

  const toggleFavorite = async (itemId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/login');
      return;
    }

    const isFavorited = favorites.includes(itemId);

    if (isFavorited) {
      // Remove favorite
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', session.user.id)
        .eq('item_id', itemId);

      setFavorites(prev => prev.filter(id => id !== itemId));
    } else {
      // Add favorite
      await supabase
        .from('favorites')
        .insert({
          user_id: session.user.id,
          item_id: itemId
        });

      setFavorites(prev => [...prev, itemId]);
    }
  };

  // Category filter handler
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category === 'Semua' ? null : category);
  };

  // Count active filters
  const activeFilterCount = [
    filters.minPrice,
    filters.maxPrice,
    filters.sortBy
  ].filter(Boolean).length;

  return (
    <>
      <CampusPopup onSelect={() => setRefresh(prev => !prev)} />
      {/* ... Header ... */}
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md pb-2">
        {/* ... (Kept existing header code) ... */}
        {/* Top App Bar */}
        <div className="flex items-center p-4 pb-0 justify-between">
          <div className="flex items-center gap-2">
            <div className="text-primary flex items-center" data-icon="location_on">
              <span className="material-symbols-outlined text-[24px]">location_on</span>
            </div>
            <div>
              <p className="text-[10px] text-[#4c809a] font-medium leading-none uppercase tracking-wider">Lokasi Saya</p>
              <h2 className="text-[#0d171b] dark:text-white text-base font-bold leading-tight">
                {typeof window !== 'undefined' && localStorage.getItem('selectedCampus')
                  ? campuses.find(c => c.id === localStorage.getItem('selectedCampus'))?.name
                  : 'Pilih Kampus'}
              </h2>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
              <span className="material-symbols-outlined text-[22px] text-[#0d171b] dark:text-white">notifications</span>
            </button>
          </div>
        </div>
        {/* Search Bar */}
        <div className="px-4 py-3 flex gap-2 items-center">
          <label className="flex flex-col flex-1 h-11">
            <div className="flex w-full flex-1 items-stretch rounded-full h-full bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="text-[#4c809a] flex items-center justify-center pl-4 rounded-l-full" data-icon="search">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                className="form-input flex w-full min-w-0 flex-1 border-none bg-transparent focus:outline-0 focus:ring-0 text-[#0d171b] dark:text-white placeholder:text-[#4c809a] px-3 text-sm font-normal"
                placeholder="Cari apa hari ini?"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </label>
          <button
            onClick={() => setShowFilterModal(true)}
            className="flex size-11 items-center justify-center rounded-full bg-primary text-white shadow-md shadow-primary/20 relative"
          >
            <span className="material-symbols-outlined">tune</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
        {/* Chips / Categories */}
        <div className="flex gap-2 px-4 py-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => handleCategoryClick('Semua')}
            className={`flex h-9 shrink-0 items-center justify-center gap-x-1 rounded-full px-4 transition-colors ${selectedCategory === null
              ? 'bg-primary text-white'
              : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700'
              }`}
          >
            <p className={`text-xs font-semibold ${selectedCategory === null ? 'text-white' : 'text-[#0d171b] dark:text-white'}`}>Semua</p>
          </button>
          <button
            onClick={() => handleCategoryClick('1')}
            className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 transition-colors ${selectedCategory === '1'
              ? 'bg-primary'
              : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700'
              }`}
          >
            <span className={`material-symbols-outlined text-[18px] ${selectedCategory === '1' ? 'text-white' : ''}`}>print</span>
            <p className={`text-xs font-medium ${selectedCategory === '1' ? 'text-white' : 'text-[#0d171b] dark:text-white'}`}>Jasa</p>
          </button>
          <button
            onClick={() => handleCategoryClick('2')}
            className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 transition-colors ${selectedCategory === '2'
              ? 'bg-primary'
              : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700'
              }`}
          >
            <span className={`material-symbols-outlined text-[18px] ${selectedCategory === '2' ? 'text-white' : ''}`}>book</span>
            <p className={`text-xs font-medium ${selectedCategory === '2' ? 'text-white' : 'text-[#0d171b] dark:text-white'}`}>Buku</p>
          </button>
          <button
            onClick={() => handleCategoryClick('3')}
            className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 transition-colors ${selectedCategory === '3'
              ? 'bg-primary'
              : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700'
              }`}
          >
            <span className={`material-symbols-outlined text-[18px] ${selectedCategory === '3' ? 'text-white' : ''}`}>restaurant</span>
            <p className={`text-xs font-medium ${selectedCategory === '3' ? 'text-white' : 'text-[#0d171b] dark:text-white'}`}>Makanan</p>
          </button>
          <button
            onClick={() => handleCategoryClick('4')}
            className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 transition-colors ${selectedCategory === '4'
              ? 'bg-primary'
              : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700'
              }`}
          >
            <span className={`material-symbols-outlined text-[18px] ${selectedCategory === '4' ? 'text-white' : ''}`}>devices</span>
            <p className={`text-xs font-medium ${selectedCategory === '4' ? 'text-white' : 'text-[#0d171b] dark:text-white'}`}>Elektronik</p>
          </button>
        </div>
      </header>
      {/* Main Feed */}
      <main className="px-4 pb-24">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="mb-5 @container">
              <Link href={`/offer/${item.id}`}>
                <div className="flex flex-col items-stretch justify-start rounded-xl shadow-sm bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                        {item.seller_avatar ? (
                          <div
                            className="w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: `url("${item.seller_avatar}")` }}
                          ></div>
                        ) : (
                          <span className="material-symbols-outlined text-[18px] text-primary">person</span>
                        )}
                      </div>
                      <div>
                        <p className="text-[#0d171b] dark:text-white text-xs font-bold leading-none">{item.seller_name}</p>
                        <p className="text-[#4c809a] text-[10px] leading-none mt-0.5">
                          {item.location ? (
                            <span className="flex items-center gap-0.5">
                              <span className="material-symbols-outlined text-[10px] align-middle">location_on</span>
                              {item.location}
                            </span>
                          ) : (
                            `${item.seller_major || 'Umum'}`
                          )}
                        </p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#4c809a] text-[20px]">more_horiz</span>
                  </div>
                  <div className="px-3">
                    <div
                      className="w-full bg-center bg-no-repeat aspect-[16/9] bg-cover rounded-lg"
                      style={{ backgroundImage: `url("${item.image_url}")` }}
                    ></div>
                  </div>
                  <div className="flex w-full grow flex-col items-stretch justify-center gap-1 p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-[#0d171b] dark:text-white text-lg font-bold leading-tight">{item.title}</h3>
                      <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                        {(item as any).category?.name || 'UMUM'}
                      </span>
                    </div>
                    <div className="mt-1">
                      <p className="text-[#4c809a] dark:text-slate-400 text-sm font-normal leading-relaxed">{item.description}</p>
                      <p className="text-primary text-base font-bold mt-2">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-50 dark:border-slate-800">
                      <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleChatSeller(item); }}
                        className="flex-1 flex cursor-pointer items-center justify-center rounded-full h-10 px-4 bg-primary text-white text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary/90 transition-colors"
                      >
                        <span className="material-symbols-outlined mr-2 text-[20px]">chat</span>
                        <span className="truncate">Chat Penjual</span>
                      </button>
                      <button
                        onClick={(e) => toggleFavorite(item.id, e)}
                        className={`flex size-10 items-center justify-center rounded-full ${favorites.includes(item.id)
                          ? 'bg-red-50 dark:bg-red-900/20 text-red-500'
                          : 'bg-slate-50 dark:bg-slate-800 text-[#4c809a]'
                          } hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors`}
                      >
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: favorites.includes(item.id) ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-slate-400">
            <div className="material-symbols-outlined text-4xl mb-2">inventory_2</div>
            <p className="text-sm">Konten belum tersedia.</p>
          </div>
        )}
      </main>
      {/* Bottom Navigation Bar (iOS Style) */}
      <BottomNav />

      <FilterModal
        showModal={showFilterModal}
        setShowModal={setShowFilterModal}
        filters={filters}
        setFilters={setFilters}
      />
    </>
  );
}
