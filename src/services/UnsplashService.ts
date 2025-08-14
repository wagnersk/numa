import * as FileSystem from 'expo-file-system';

const BASE_URL = 'https://api.unsplash.com';
const ACCESS_KEY = process.env.EXPO_PUBLIC_ACCESS_KEY;

if (!ACCESS_KEY) {
  throw new Error('A variável EXPO_PUBLIC_ACCESS_KEY não está definida no .env');
}

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
  current_user_collections: unknown[];
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
    download_location: string; // adicionei aqui
  };
}

export interface UnsplashSearchResponse {
  total: number;
  total_pages: number;
  results: UnsplashPhoto[];
}

export const UnsplashService = {

    async getPhotoById(id: string) {
    const res = await fetch(`${BASE_URL}/photos/${id}?client_id=${ACCESS_KEY}`);
    if (!res.ok) throw new Error('Erro ao buscar foto por ID');
    return res.json() as Promise<UnsplashPhoto>;
  },
  
  async getRandomPhotos(count = 10) {
    const res = await fetch(`${BASE_URL}/photos/random?count=${count}&client_id=${ACCESS_KEY}`);
    if (!res.ok) throw new Error('Erro ao buscar fotos aleatórias');
    return res.json() as Promise<UnsplashPhoto[]>;
  },

  async searchPhotos(query: string, count = 10) {
    const res = await fetch(`${BASE_URL}/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&client_id=${ACCESS_KEY}`);
    if (!res.ok) throw new Error('Erro ao buscar fotos pela palavra-chave');
    const data = await res.json() as UnsplashSearchResponse;
    return data.results;
  },

  async downloadPhoto(photo: UnsplashPhoto) {
    // 1. Registrar o download no Unsplash

    const { color , blur_hash} = photo;
    
    const registerRes = await fetch(
      `${photo.links.download_location}?client_id=${ACCESS_KEY}`
    );
    if (!registerRes.ok) throw new Error("Erro ao registrar download no Unsplash");
    const { url } = await registerRes.json();

    const direct_url = url
    
    const file_name = `${photo.id}.jpg`;
    
    const local_uri = `${FileSystem.documentDirectory}${file_name}`

    await FileSystem.downloadAsync(direct_url, local_uri);

    return {
      file_name: file_name,  
      color: color,
      blur_hash: blur_hash,
      direct_url: direct_url,
    }
  },

  async deleteLocalPhoto(file_name: string | null) {
  if (!file_name) return;

  try {
    const localUri = `${FileSystem.documentDirectory}${file_name}`;
    
    const fileInfo = await FileSystem.getInfoAsync(localUri);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(localUri, { idempotent: true });
      console.log(`Foto deletada: ${file_name}`);
    }
  } catch (error) {
    console.log("Erro ao deletar foto local:", error);
  }
}
  
  
  }