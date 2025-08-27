// Exemplo de uso em: src/components/StartGrid/index.tsx (ou similar)

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { UnsplashService, UnsplashPhoto } from '@/services/UnsplashService';
import { useTargetStore } from '@/store/useTargetStore';
import { router } from 'expo-router';
import { Card } from './card';
import { useTranslations } from '@/libs/i18n';

export function StartGrid() {
  const [photos, setPhotos] = useState<(UnsplashPhoto | undefined)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setTempTarget } = useTargetStore();
  const t = useTranslations();

  const cardThemes = [
    { name: "Mountain landscape", label: t.startGrid.experiences },
    { name: "red sport car", label: t.startGrid.buyCar },
    { name: "wedding dress", label: t.startGrid.planEvent },
    { name: "statue", label: t.startGrid.seeWorld },
  ];

  useEffect(() => {
    async function fetchPhotos() {
      try {
        // Busca a primeira foto para cada tema
        const photoPromises = cardThemes.map(theme => 
          // Usa theme.name para a busca na API
          UnsplashService.searchPhotos(theme.name, 1)
        );
        const photoResults = await Promise.all(photoPromises);
        
        // Pega a primeira foto de cada resultado (ou undefined se não houver)
        const fetchedPhotos = photoResults.map(result => result[0]);
        setPhotos(fetchedPhotos);
      } catch (error) {
        console.error("Erro ao buscar imagens:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPhotos();
  }, []);

  function handleCreateTarget(photo: UnsplashPhoto, name: string) {
    // Define a foto, a cor e o nome no zustand para a tela de criação de meta
    setTempTarget({ photo, color: photo.color, name });
    // Navega para a tela de criação de meta
    router.push("/tabs/target");
  }

  if (isLoading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.gridContainer}>

      {/* Passa o theme.label para o nome da meta e para o label do card */}
      <TouchableOpacity onPress={() => photos[0] && handleCreateTarget(photos[0], cardThemes[0].label)} activeOpacity={0.8} disabled={!photos[0]}>
          {photos[0] && <Card
            style={styles.topCard}
            imageUri={photos[0].urls.regular}
            label={cardThemes[0].label}
          />}
      </TouchableOpacity>

      <View style={styles.bottomRow}>

        <View style={styles.leftColumn}>
          <TouchableOpacity onPress={() => photos[1] && handleCreateTarget(photos[1], cardThemes[1].label)} activeOpacity={0.8} style={{flex: 1}} disabled={!photos[1]}>
            {photos[1] && <Card style={styles.smallCard} imageUri={photos[1].urls.regular} label={cardThemes[1].label} />}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => photos[2] && handleCreateTarget(photos[2], cardThemes[2].label)} activeOpacity={0.8} style={{flex: 1}} disabled={!photos[2]}>
            {photos[2] && <Card style={styles.smallCard} imageUri={photos[2].urls.regular} label={cardThemes[2].label} />}
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => photos[3] && handleCreateTarget(photos[3], cardThemes[3].label)} activeOpacity={0.8} style={{flex: 1}} disabled={!photos[3]}>
          {photos[3] && <Card style={styles.rightCard} imageUri={photos[3].urls.regular} label={cardThemes[3].label} />}
        </TouchableOpacity>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    flex: 1,
    flexDirection: 'column',
    gap: 18,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 150,
  },
  topCard: {
    height: 160,
  },
  bottomRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  leftColumn: {
    flex: 1,
    gap: 18,
  },
  smallCard: {
    flex: 1,
  },
  rightCard: {
    flex: 1,
  },
});