import { create } from "zustand";
import { Alert } from "react-native";
import { router } from "expo-router";
import { UnsplashPhoto, UnsplashService } from "@/services/UnsplashService";
import { useUserStore } from "@/store/useUserStore";
import { useTargetDatabase } from "@/database/useTargetDatabase";
import { useTransactionsDatabase } from "@/database/useTransactionsDatabase";
import { usePhotosDatabase } from "@/database/usePhotosDatabase";
import { getRandomUnusedColor } from "@/utils/getRandomColor";
import { numberToCurrency } from "@/utils/numberToCurrency";
import { colorsList } from "@/utils/colorList";
import { i18n } from "@/libs/i18n";

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

export type TargetsData= {
    id:number;
    name:string;

    target:string;
    currency:string;
    currencyType:string;
    color:string;
    
    start_date:number;
    end_date:number;

    photo_file_name:string;
    photo_color:string;
    photo_blur_hash:string;
    photo_direct_url:string;


    current:number;
    percentage:number;
}
/* fetchTargetsByPercentage */
export type TargetByPercentageProps = {
    id:number;
    name:string;

    target:string;
    currency:string;
    currencyType: string;
    color:string;
    
    start_date:number;
    end_date:number;

    photo_file_name:string;
    photo_color:string;
    photo_blur_hash:string;
    photo_direct_url:string;


    current:number;
    percentage:number;
}
 
export interface TargetFormData {
  id?: number;
  name: string;
  currency: string;
  current: number;
  target: number;
  start_date: number;
  end_date: number;
  color: string | null;
  photo: UnsplashPhoto | null;
  photo_file_name: string | null;
}


export interface TargetFormattedData {
    id: number;
    target: string;
    currency: string;
    currencyType: string;
    color: string;
    end_date: number;
    name: string;
    percentage: number;
    current: number;
    start_date: number;
    photo_color: string;
    photo_blur_hash: string;
    photo_direct_url: string;
    photo_file_name: string;
}

// Store State and Actions interface
interface TargetStoreState {
  tempTarget: TargetFormData;
  isLoading: boolean;
  isInitialized: boolean;

  setTempTarget: (target: Partial<TargetFormData>) => void;
  resetStore: () => Promise<void>;
  initializeNewTarget: (db: ReturnType<typeof useTargetDatabase>) => Promise<void>;

  fetchTarget: (id: string, db: ReturnType<typeof useTargetDatabase>) => Promise<TargetData | null>;
  fetchFormattedTarget: (id: string, db: ReturnType<typeof useTargetDatabase>) => Promise<TargetFormattedData | null>;
  fetchTargetsByPercentage: (db: ReturnType<typeof useTargetDatabase>) => Promise<TargetByPercentageProps[]>; 

  getAvailableColors: (db: ReturnType<typeof useTargetDatabase>) => Promise<string[]>;

  saveTransaction: (
    targetId: number,
    amount: number,
    type: 'deposit' | 'withdraw',
    observation: string | null,
    databases: {
      targetDatabase: ReturnType<typeof useTargetDatabase>;
      transactionsDatabase: ReturnType<typeof useTransactionsDatabase>;
    }
  ) => Promise<void>;

  handleSubmit: (
    databases: {
      targetDatabase: ReturnType<typeof useTargetDatabase>;
      transactionsDatabase: ReturnType<typeof useTransactionsDatabase>;
      photosDatabase: ReturnType<typeof usePhotosDatabase>;
    },
    editting: boolean
  ) => Promise<void>;
  deleteTarget: (databases: {
    targetDatabase: ReturnType<typeof useTargetDatabase>;
    transactionsDatabase: ReturnType<typeof useTransactionsDatabase>;
    photosDatabase: ReturnType<typeof usePhotosDatabase>;
  }) => Promise<void>;
}

const initialTempTarget: TargetFormData = {
  id: undefined,
  name: "",
  currency: "BRL",
  current: 0,
  target: 0,
  start_date: 0,
  end_date: 0,
  color: null,
  photo: null,
  photo_file_name: null,
};

// Helper function to get user ID and handle unauthenticated state
const getUserId = () => {
  // Note: This is a helper and not a hook, so it doesn't have access to the translation hook.
  // The alerts here will be in the default language.
  // For translated alerts, the call site (the action) should handle it.
  const { user } = useUserStore.getState();
  if (!user?.id) {
    router.replace("/auth/login");
    throw new Error("Usuário não autenticado. Redirecionando para o login.");
  }
  return user.id;
};

export const useTargetStore = create<TargetStoreState>((set, get) => ({
  // Initial state
  tempTarget: initialTempTarget,
  isLoading: false,
  isInitialized: false,

  // Actions
  setTempTarget: (newData: Partial<TargetFormData>) =>
    set((state) => ({
      tempTarget: { ...state.tempTarget, ...newData },
      isInitialized: true,
    })),

  resetStore: async () => {
    set({
      tempTarget: initialTempTarget,
      isLoading: false,
      isInitialized: false,
    });
  },

  initializeNewTarget: async (db) => {
    const userId = getUserId();
    const allTargets = await db.showAll(userId);
    const usedColors = allTargets.map((t) => t.color).filter(Boolean);
    const randomColor = getRandomUnusedColor(usedColors);
    set({
      tempTarget: { ...initialTempTarget, color: randomColor },
      isLoading: false,
      isInitialized: true,
    });
  },

  // Async Actions

  fetchTargetsByPercentage: async (db) => {
      try {
        const userId = getUserId();
        const response = await db.listByPercentage(userId);
        const mappedTargets: TargetByPercentageProps[] = response.map((item) => ({
          id: Number(item.id),
          target: numberToCurrency(item.amount),
          currency: numberToCurrency(item.current),
          currencyType: item.currency,
          color: item.color,
          end_date: item.end_date,
          name: item.name,
          percentage: Number(item.percentage.toFixed(2)),
          current: item.current,
          start_date: item.start_date,
          photo_file_name: item.photo_file_name,
          photo_color: item.photo_color,
          photo_blur_hash: item.photo_blur_hash,
          photo_direct_url: item.photo_direct_url,
        }));

        return mappedTargets;
      } catch (error) {
        // Se o erro for de usuário não autenticado, não mostre o alerta.
        // A função getUserId já cuida do redirecionamento.
        if (error instanceof Error && error.message.includes("Usuário não autenticado")) {
          console.log("Usuário não autenticado, redirecionando...");
        } else {
          Alert.alert(i18n['pt-br'].common.error, i18n['pt-br'].alerts.loadGoalsError); // Default lang
          console.log(error);
        }
        return []; // Retorna um array vazio em caso de erro para a UI não quebrar.
      }
    },

    fetchTarget: async (id, db) => {
      set({ isLoading: true });
      try {
        const userId = getUserId();
        const response = await db.show(id, userId);
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
        Alert.alert(i18n['pt-br'].common.error, i18n['pt-br'].alerts.loadGoalError); // Default lang
        console.log(error);
        return null;
      } finally {
        set({ isLoading: false });
      }
    },
    fetchFormattedTarget: async (id, db) => {
      set({ isLoading: true });
      try {
        const userId = getUserId();
        const response = await db.show(id, userId);
        if (!response) return null;

        return {
          id: Number(response.id),
          target: numberToCurrency(response.amount),
          currency: numberToCurrency(response.current),
          currencyType: response.currency,
          color: response.color,
          end_date: response.end_date,
          name: response.name,
          percentage: Number(response.percentage.toFixed(2)),
          current: response.current,
          start_date: response.start_date,
          photo_color: response.photo_color,
          photo_blur_hash: response.photo_blur_hash,
          photo_direct_url: response.photo_direct_url,
          photo_file_name: response.photo_file_name,
          
        };
      } catch (error) {
        Alert.alert(i18n['pt-br'].common.error, i18n['pt-br'].alerts.loadGoalError); // Default lang
        console.log(error);
        return null;
      } finally {
        set({ isLoading: false });
      }
    },
    getAvailableColors: async (db: ReturnType<typeof useTargetDatabase>) => {
    try {
      const userId = getUserId();
      const response = await db.showAll(userId);
      const usedColors = response.map((item) => item.color);
      const availableColors = colorsList.filter((c) => !usedColors.includes(c));
      return availableColors;
    } catch (error) {
      Alert.alert(i18n['pt-br'].common.error, i18n['pt-br'].alerts.loadColorsError); // Default lang
      console.log(error);
      return [];
    }
},

  saveTransaction: async (targetId, amount, type, observation, { targetDatabase, transactionsDatabase }) => {
    set({ isLoading: true });
    const lang = useUserStore.getState().user?.language || 'pt-br';
    const t = i18n[lang];

    try {
      const userId = getUserId();
      const target = await targetDatabase.show(String(targetId), userId);

      if (!target) {
        throw new Error("Target not found");
      }

      if (amount <= 0) {
        Alert.alert(t.common.attention, t.alerts.zeroValueError);
        set({ isLoading: false });
        return;
      }

      if (type === 'withdraw' && amount > target.current) {
        const formattedAmount = numberToCurrency(target.current, target.currency as any);
        Alert.alert(t.common.attention, t.alerts.withdrawAmountError.replace('{amount}', formattedAmount));
        set({ isLoading: false });
        return;
      }

      if (type === 'deposit' && (target.current + amount) > target.amount) {
        const formattedAmount = numberToCurrency(target.amount, target.currency as any);
        Alert.alert(t.common.attention, t.alerts.depositAmountError.replace('{amount}', formattedAmount));
        set({ isLoading: false });
        return;
      }

      const transactionAmount = type === 'deposit' ? amount : -amount;
      await transactionsDatabase.create({ user_id: userId, target_id: targetId, amount: transactionAmount, observation });

      Alert.alert(t.common.success, t.alerts.transactionSaved, [{ text: t.common.ok, onPress: () => router.back() }]);
    } catch (error) {
      if (!(error instanceof Error && error.message.includes("Usuário não autenticado"))) {
        console.log(error);
        Alert.alert(t.common.error, t.alerts.transactionSaveError);
      }
    } finally {
      set({ isLoading: false });
    }
  },

  handleSubmit: async (databases, editting) => {
    const { tempTarget: targetData } = get();
    const { photo } = targetData;
    const color = targetData.color;
    const lang = useUserStore.getState().user?.language || 'pt-br';
    const t = i18n[lang];


    if (!targetData.name.trim() || Number(targetData.target) <= 0) return Alert.alert(t.common.attention, t.alerts.fillNameAndValue);
    if (!color) return Alert.alert(t.common.attention, t.alerts.selectColor);
    if (!editting && !photo) return Alert.alert(t.common.attention, t.alerts.addImage);
    if (editting && !targetData.photo_file_name && !photo) return Alert.alert(t.common.attention, t.alerts.addImage);
    if (!targetData.start_date || !targetData.end_date) return Alert.alert(t.common.attention, t.alerts.selectValidDates);
    if (targetData.end_date <= targetData.start_date) return Alert.alert(t.common.attention, t.alerts.endDateAfterStart);
    if (targetData.current > targetData.target && targetData.current > 0 && targetData.target > 0) return Alert.alert(t.common.attention, t.alerts.invalidValues);

    set({ isLoading: true });
 
try {
  const userId = getUserId();
  let photoData = null;

  if (editting) {
    // Atualização de target existente
    if (photo && photo.id) {
      // Baixa a nova foto
      photoData = await UnsplashService.downloadPhoto(photo);

      // Deleta a foto antiga se existir
      if (targetData.photo_file_name) {
        await UnsplashService.deleteLocalPhoto(targetData.photo_file_name);
      }
    }

    // Atualiza os dados do target
    await databases.targetDatabase.update(
      {
        id: targetData.id!,
        name: targetData.name,
        amount: targetData.target,
        currency: targetData.currency,
        color: color,
        end_date: targetData.end_date,
      },
      userId
    );

    // Atualiza a foto no banco se houve download de nova foto
    if (photoData) {
      await databases.photosDatabase.update(
        {
          id: targetData.id!,
          file_name: photoData.file_name,
          color: photoData.color,
          blur_hash: photoData.blur_hash,
          direct_url: photoData.direct_url,
        },
        userId
      );
    }

    Alert.alert(t.common.success, t.alerts.targetUpdated, [
      {
        text: t.common.ok,
        onPress: () => {
          get().resetStore();
          router.push("/tabs");
        },
      },
    ]);

  } else {
    // Criação de novo target
    if (photo && photo.id) {
      photoData = await UnsplashService.downloadPhoto(photo);
    }

    const targetId = await databases.targetDatabase.create({
      user_id: userId,
      name: targetData.name,
      amount: targetData.target,
      currency: targetData.currency,
      color: color,
      start_date: targetData.start_date,
      end_date: targetData.end_date,
    });

    if (targetData.current > 0) {
      await databases.transactionsDatabase.create({
        user_id: userId,
        amount: targetData.current,
        target_id: targetId,
        observation: "Saldo inicial",
      });
    }

    // Salva a foto no banco apenas se houver photoData válido
    if (photoData) {
      await databases.photosDatabase.create({
        user_id: userId,
        target_id: targetId,
        file_name: photoData.file_name,
        color: photoData.color,
        blur_hash: photoData.blur_hash,
        direct_url: photoData.direct_url,
      });
    }

    Alert.alert(t.targetForm.newTitle, t.alerts.targetCreated, [
      {
        text: t.common.ok,
        onPress: () => {
          get().resetStore();
          router.push("/tabs");
        },
      },
    ]);
  }
} catch (error) {
  console.log(error);
  Alert.alert(
    t.common.error,
    editting ? t.alerts.targetUpdateError : t.alerts.targetCreateError
  );
} finally {
  set({ isLoading: false });
}

  },

  deleteTarget: async (databases) => {
    const lang = useUserStore.getState().user?.language || 'pt-br';
    const t = i18n[lang];

    Alert.alert(t.common.attention, t.alerts.confirmDelete, [
      { text: t.common.cancel, style: "cancel" },
      {
        text: t.common.delete, style: "destructive",
        onPress: async () => {
          set({ isLoading: true });
          const { tempTarget: targetData } = get();
          try {
            const userId = getUserId();
            await UnsplashService.deleteLocalPhoto(targetData.photo_file_name!);
            // ON DELETE CASCADE will handle photos and transactions deletion
            await databases.targetDatabase.remove(Number(targetData.id), userId);
            Alert.alert(t.alerts.targetDeleted);
            get().resetStore();
            router.push("/tabs");
          } catch (error) {
            console.log(error);
            Alert.alert(t.common.error, t.alerts.targetDeleteError);
          } finally {
            set({ isLoading: false });
          }
        },
      },
    ]);
  },
}));

 