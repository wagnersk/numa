import * as FileSystem from 'expo-file-system';

export function getLocalPhotoUri(fileName: string) {
  return `${FileSystem.documentDirectory}${fileName}`;
}
