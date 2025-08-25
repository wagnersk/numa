import { create } from "zustand";
import { Alert } from "react-native";
import { router } from "expo-router";
import { UnsplashPhoto, UnsplashService } from "@/services/UnsplashService";
import { useTargetDatabase } from "@/database/useTargetDatabase";
import { useTransactionsDatabase } from "@/database/useTransactionsDatabase";
import { usePhotosDatabase } from "@/database/usePhotosDatabase";
import { getRandomUnusedColor } from "@/utils/getRandomColor";
import { colors } from "@/theme";

// Type definitions
export type TargetData = {
  id?: number;
  name: string;
  currency: string;
  photo_file_name: string | null;
  color: string;
  current: number;
  target: number;
  start_date: number;
  end_date: number;
};

export interface TempTargetData {
  photo: UnsplashPhoto | null;
  color: string | null;
}

// Store State and Actions interface
interface TargetStoreState {
  tempTarget: TempTargetData;
  isLoading: boolean;

  setTempTarget: (target: Partial<TempTargetData>) => void;
  resetStore: () => Promise<void>;
  initializeNewTarget: (db: ReturnType<typeof useTargetDatabase>) => Promise<void>;

  fetchTarget: (id: string, db: ReturnType<typeof useTargetDatabase>) => Promise<TargetData | null>;
  handleSubmit: (
    databases: {
      targetDatabase: ReturnType<typeof useTargetDatabase>;
      transactionsDatabase: ReturnType<typeof useTransactionsDatabase>;
      photosDatabase: ReturnType<typeof usePhotosDatabase>;
    },
    editting: boolean,
    targetData: TargetData
  ) => Promise<void>;
  deleteTarget: (databases: {
    targetDatabase: ReturnType<typeof useTargetDatabase>;
    transactionsDatabase: ReturnType<typeof useTransactionsDatabase>;
    photosDatabase: ReturnType<typeof usePhotosDatabase>;
  },
  targetData: TargetData
  ) => Promise<void>;
}

const initialTempTarget: TempTargetData = {
  photo: null,
  color: null,
};

export const useTargetStore = create<TargetStoreState>((set, get) => ({
  // Initial state
  tempTarget: initialTempTarget,
  isLoading: false,

  // Actions
  setTempTarget: (newData: Partial<TempTargetData>) =>
    set((state) => ({
      tempTarget: { ...state.tempTarget, ...newData },
    })),

  resetStore: async () => {
    set({
      tempTarget: initialTempTarget,
      isLoading: false,
    });
  },

  initializeNewTarget: async (db) => {
    const allTargets = await db.showAll();
    const usedColors = allTargets.map((t) => t.color).filter(Boolean);
    const randomColor = getRandomUnusedColor(usedColors);
    set({
      tempTarget: { color: randomColor, photo: null },
      isLoading: false,
    });
  },

  // Async Actions
  fetchTarget: async (id, db) => {
    set({ isLoading: true });
    try {
      const response = await db.show(id);
      if (!response) return null;

      return {
        id: Number(response.id),
        name: response.name,
        currency: response.currency,
        current: response.current,
        target: response.amount,
        start_date: response.start_date,
        end_date: response.end_date,
        color: response.color,
        photo_file_name: response.photo_file_name,
      };
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar a meta.");
      console.log(error);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  handleSubmit: async (databases, editting, targetData) => {
    const { tempTarget } = get();
    const { photo } = tempTarget;
    const color = tempTarget.color || targetData.color;

    if (!targetData.name.trim() || Number(targetData.target) <= 0) return Alert.alert("Atenção", "Preencha nome e valor da meta.");
    if (!editting && !photo) return Alert.alert("Atenção", "Adicione uma imagem para continuar.");
    if (editting && !targetData.photo_file_name && !photo) return Alert.alert("Atenção", "Adicione uma imagem para continuar.");
    if (!targetData.start_date || !targetData.end_date) return Alert.alert("Atenção", "Selecione datas válidas para a meta.");
    if (targetData.end_date <= targetData.start_date) return Alert.alert("Atenção", "A data de término deve ser maior que a data de início.");
    if (targetData.current > targetData.target && targetData.current > 0 && targetData.target > 0) return Alert.alert("Atenção", "Valores inválidos para saldo ou objetivo.");

    set({ isLoading: true });
    try {
      if (editting) {
        let photoData = null;
        if (photo) {
          photoData = await UnsplashService.downloadPhoto(photo);
          await UnsplashService.deleteLocalPhoto(targetData.photo_file_name!);
        }
        await databases.targetDatabase.update({ id: targetData.id!, name: targetData.name, amount: targetData.target, currency: targetData.currency, color: color, end_date: targetData.end_date });
        if (photoData) await databases.photosDatabase.update({ id: targetData.id!, file_name: photoData.file_name, color: photoData.color, blur_hash: photoData.blur_hash, direct_url: photoData.direct_url });
        Alert.alert("Meta Atualizada", "A meta foi atualizada com sucesso!", [{ text: "Ok", onPress: () => { get().resetStore(); router.push("/tabs"); } }]);
      } else {
        const photoData = await UnsplashService.downloadPhoto(photo!);
        const targetId = await databases.targetDatabase.create({ name: targetData.name, amount: targetData.target, currency: targetData.currency, color: color, start_date: targetData.start_date, end_date: targetData.end_date });
        await databases.transactionsDatabase.create({ amount: targetData.current, target_id: targetId, observation: "Saldo inicial" });
        await databases.photosDatabase.create({ target_id: targetId, file_name: photoData.file_name, color: photoData.color, blur_hash: photoData.blur_hash, direct_url: photoData.direct_url });
        Alert.alert("Nova Meta", "Meta criada com sucesso!", [{ text: "Ok", onPress: () => { get().resetStore(); router.push("/tabs"); } }]);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", `Não foi possível ${editting ? 'atualizar' : 'criar'} a meta.`);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTarget: async (databases, targetData) => {
    Alert.alert("Atenção", "Deseja realmente deletar essa meta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Deletar", style: "destructive",
        onPress: async () => {
          set({ isLoading: true });
          try {
            await UnsplashService.deleteLocalPhoto(targetData.photo_file_name!);
            await databases.photosDatabase.remove(Number(targetData.id));
            await databases.transactionsDatabase.remove(Number(targetData.id));
            await databases.targetDatabase.remove(Number(targetData.id));
            Alert.alert("Meta deletada com sucesso!");
            get().resetStore();
            router.push("/tabs");
          } catch (error) {
            console.log(error);
            Alert.alert("Erro", "Não foi possível deletar a meta.");
          } finally {
            set({ isLoading: false });
          }
        },
      },
    ]);
  },
}));

 