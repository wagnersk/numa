import { Directory, File, Paths } from 'expo-file-system';

export function getLocalPhotoUri(fileName: string) {
  // 1. Diretório onde as fotos do Unsplash são salvas
  const localDir = new Directory(Paths.document, 'unsplash_photos');

  // 2. Cria o arquivo virtual para obter o URI
  const file = new File(localDir, fileName);

  // 3. Retorna o URI completo
  return file.uri;
}