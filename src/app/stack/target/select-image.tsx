import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TextInput, ActivityIndicator, TouchableOpacity, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import { colors, fontFamily } from '../../../theme';
import { Feather } from '@expo/vector-icons';
import { UnsplashPhoto, UnsplashService } from '../../../services/UnsplashService';
import { useTargetStore } from '../../../store/useTargetStore';
import { useTranslations } from '../../../libs/i18n';

export default function GalleryScreen() {
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const photo = useTargetStore(state => state.tempTarget.photo);
  const router = useRouter();
  const t = useTranslations();

  async function loadRandomPhotos() {
    setLoading(true);
    try {
      const data = await UnsplashService.getRandomPhotos(12);
      setPhotos(data);
    } catch (err) {
      console.error('Erro ao carregar fotos aleatórias:', err);
    } finally {
      setLoading(false);
    }
  }

  async function searchByKeyword() {
    if (!keyword.trim()) return;
    setLoading(true);
    try {
      const data = await UnsplashService.searchPhotos(keyword, 12);
      setPhotos(data); 
    } catch (err) {
      console.error('Erro ao buscar fotos:', err);
    } finally {
      setLoading(false);
      Keyboard.dismiss();
    }
  }

  function handleConfirm(id:String) {
    router.push(`/stack/target/confirm-image/${id}`); // passa o id para a tela de confirmação
  }

  useEffect(() => {
    loadRandomPhotos();
  }, []);



  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.title}>{t.selectImage.title}</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <View style={styles.searchContainer}>
        <AntDesign name="search" size={20} color={colors.black} style={styles.icon} />
        <TextInput
          style={styles.searchInput}
          placeholder={t.common.search}
          value={keyword}
          onChangeText={setKeyword}
          returnKeyType="search"
          onSubmitEditing={searchByKeyword} 
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={photos}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.flatlistStyle}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
       <TouchableOpacity onPress={() => handleConfirm(item.id)}>
        <View style={{ borderRadius: 12, overflow: 'hidden', position: 'relative', marginBottom: 18 }}>
          <Image
            source={{ uri: item.urls.small }}
            style={[
              { width: 160, height: 160 },
              photo && photo.id === item.id && {
                borderWidth: 4,
                borderColor: colors.green[500],
                shadowColor: colors.black,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
              },
            ]}
          />

          {/* Overlay preto só na parte inferior da foto */}
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              minHeight: 32, // suficiente para o texto completo
              backgroundColor: 'rgba(0,0,0,0.4)',
              justifyContent: 'center',
              paddingHorizontal: 6,
              paddingVertical: 4,
            }}
          >
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 12,
              }}
              numberOfLines={2} // garante que todo texto apareça, quebrando linha se necessário
            >
              Photo by {item.user.name} on Unsplash
            </Text>
          </View>
        </View>
      </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container : {
    flex:1,
    backgroundColor: colors.gray[100],
    paddingHorizontal: 24,
    gap:16
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontFamily:fontFamily.regular,
    color: colors.black,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 20,
    marginVertical: 24
  },
  icon: {
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14
  },
  flatlistStyle: {
    gap:16,
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 12,
    marginBottom: 18
  }
});