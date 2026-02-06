export type Item = {
    id: string;
    title: string;
    description: string;
    price: number;
    image_url: string;
    category_id: string;
    category_name?: string; // For joined queries
    seller_id: string; // Add this
    seller_name: string;
    seller_avatar: string; // URL
    seller_major: string; // e.g., 'Teknik', 'MIPA'
    created_at: string;
    likes_count: number;
    rating?: number;
    reviews_count?: number;
};

export type Category = {
    id: string;
    name: string;
    icon: string; // Material symbol name
    color_bg: string; // Tailwind class
    color_text: string; // Tailwind class
};
