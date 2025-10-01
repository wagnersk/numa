import { File, Directory, Paths } from 'expo-file-system';

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
    const { color, blur_hash } = photo;

    console.log("Photo ID:", photo.id);
    console.log("Download location URL:", photo.links.download_location);

    const registerRes = await fetch(`${photo.links.download_location}?client_id=${ACCESS_KEY}`);
    if (!registerRes.ok) throw new Error("Erro ao registrar download no Unsplash");

    const registerData = await registerRes.json();
    const direct_url = registerData.url;
    console.log("Direct download URL:", direct_url);

    if (!direct_url) {
      throw new Error("Direct URL está undefined!");
    }

    // 2. Criar diretório (idempotente para evitar erro se já existir)
    const localDir = new Directory(Paths.document, 'unsplash_photos');
    console.log("Local directory path:", localDir.uri);
    localDir.create({ idempotent: true });

    // 3. Criar arquivo com nome específico dentro do diretório
    const file_name = `${photo.id}.jpg`;
    const localFile = new File(localDir, file_name);
    console.log("Local file path:", localFile.uri);

    // 4. Baixar o arquivo para esse File
    const output = await File.downloadFileAsync(direct_url, localFile);
    console.log("Download finished. Exists?", output.exists);
    console.log("Downloaded file URI:", output.uri);

    return {
      file_name,
      color,
      blur_hash,
      direct_url,
      local_uri: localFile.uri,
      exists: output.exists, // true se o download foi bem-sucedido
    };
  },

  async deleteLocalPhoto(file_name: string | null) {
    if (!file_name) return;

    try {
      // 1. Aponta para o diretório onde estão as fotos
      const localDir = new Directory(Paths.document, 'unsplash_photos');
      const file = new File(localDir, file_name);

      // 2. Verifica se o arquivo existe
      if (file.exists) {
        file.delete(); // deleta o arquivo
        console.log(`Foto deletada: ${file_name}`);
      } else {
        console.log(`Arquivo não encontrado: ${file_name}`);
      }
    } catch (error) {
      console.log("Erro ao deletar foto local:", error);
    }
  }
  }