// services/UnsplashService.ts
const BASE_URL = 'https://api.unsplash.com';
const ACCESS_KEY = process.env.EXPO_PUBLIC_ACCESS_KEY;

if (!ACCESS_KEY) {
  throw new Error('A variável EXPO_PUBLIC_ACCESS_KEY não está definida no .env');
}

/**
 * Tipos do Unsplash
 */
export interface UnsplashUser {
  id: string;
  username: string;
  name: string;
  first_name: string;
  last_name: string;
  instagram_username?: string | null;
  twitter_username?: string | null;
  portfolio_url?: string | null;
  profile_image: {
    small: string;
    medium: string;
    large: string;
  };
  links: {
    self: string;
    html: string;
    photos: string;
    likes: string;
  };
}

export interface UnsplashPhoto {
  id: string;
  created_at: string;
  width: number;
  height: number;
  color: string;
  blur_hash: string;
  likes: number;
  liked_by_user: boolean;
  description?: string | null;
  alt_description?: string | null;
  user: UnsplashUser;
  current_user_collections: unknown[]; // pode refinar caso precise
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  links: {
    self: string;
    html: string;
    download: string;
  };
}

export interface UnsplashSearchResponse {
  total: number;
  total_pages: number;
  results: UnsplashPhoto[];
}

 
export const UnsplashService = {

  async getRandomPhotos(count = 10) {
    const res = await fetch(`${BASE_URL}/photos/random?count=${count}&client_id=${ACCESS_KEY}`);
    if (!res.ok) throw new Error('Erro ao buscar fotos aleatórias');
    return res.json() as Promise<UnsplashPhoto[]>;
  },

  async searchPhotos(query, count = 10) {
    const res = await fetch(`${BASE_URL}/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&client_id=${ACCESS_KEY}`);
    if (!res.ok) throw new Error('Erro ao buscar fotos pela palavra-chave');
    const data = await res.json() as UnsplashSearchResponse;
    return data.results;

  }
};