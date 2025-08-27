import { create } from "zustand";
import { Alert } from "react-native";
import { useTargetDatabase } from "@/database/useTargetDatabase";
import { useTransactionsDatabase } from "@/database/useTransactionsDatabase";
import { numberToCurrency } from "@/utils/numberToCurrency";
import { TransactionTypes } from "@/utils/TransactionTypes";
import { colors } from "@/theme";
import dayjs from "dayjs";
import { CurrencyProps } from "@/utils/currencyList";
import { useUserStore } from "./useUserStore";
import { router } from "expo-router";

// Type definitions
export type TargetProps = {
  id: number;
  value: number;
  color: string;
  text: string;
  pillName: string;
  target: string;
};
export type TargetAllDataProps = {
    id: number;
    value: number;
    color: string;
    text: string;
    pillName: string;
    target: string;
    photo: string;
    photo_file_name: string;
    photo_color: string;
    photo_blur_hash: string;
    photo_direct_url: string;
    start_date: number;
    end_date: number;
    current: number;
    percentage: number;
    currency: CurrencyProps;
};
export type TargetByIdProps =  {
    id: number;
    name: string;
    target: string;
    currency: string;
    color: string;
    end_date: number;
    percentage: number;
    current: number;
    start_date: number;
    photo_color: string;
    photo_blur_hash: string;
    photo_direct_url: string;
    photo_file_name: string;
}
 
export type TransactionProps = {
  color: string;
  text: string;
  pillName: string;
  value: string;
  id: string;
  target_id: number;
  date: string;
  description?: string;
  type: TransactionTypes;
};
export type TransactionAllDataProps = {
  color: string;
  text: string;
  pillName: string;
  value: string;
  id: string;
  target_id: number;
  date: string;
  description?: string;
  type: TransactionTypes;
  photo: {
    fileName: string;
    color: string;
    blurHash: string;
    directUrl: string;
  }
}

export type TransactionFilter = 'all' | 'income' | 'expense';

// Store State and Actions interface
interface AnalysisState {
  currencyType: CurrencyProps;
  selectedPill: number;
  transactionFilter: TransactionFilter;
  setSelectedPill: (index: number) => void;
  setCurrencyType: (currency: CurrencyProps) => void;
  setTransactionFilter: (filter: TransactionFilter) => void;
  fetchTargets: (db: ReturnType<typeof useTargetDatabase>) => Promise<TargetProps[]>;
  fetchTargetsByCurrency: (db: ReturnType<typeof useTargetDatabase>,currencyType:CurrencyProps) => Promise<TargetProps[]>;
  fetchTransactions: (db: ReturnType<typeof useTransactionsDatabase>, targets: TargetProps[]) => Promise<TransactionProps[]>;
  fetchTransactionsByTargetsAllData: (db: ReturnType<typeof useTransactionsDatabase>, targets: TargetProps[],target_ids:number[],currencyType:CurrencyProps) => Promise<TransactionAllDataProps[]>;

  fetchTargetById: (id: string, db: ReturnType<typeof useTargetDatabase>) => Promise<TargetByIdProps | null>;
}

// Helper function to get user ID and handle unauthenticated state
const getUserId = () => {
  const { user } = useUserStore.getState();
  if (!user?.id) {
    router.replace("/auth/login");
    throw new Error("Usuário não autenticado. Redirecionando para o login.");
  }
  return user.id;
}

// Store implementation
export const useAnalysisStore = create<AnalysisState>((set) => ({
  // Initial state
  targets: [],
  transactions: [],
  selectedPill: 0,
  currencyType: 'BRL',
  transactionFilter: 'all',
  customTabBarHeight: 0, // Initial value

  // Actions
  setSelectedPill: (index) => set({ selectedPill: index }),
  setCurrencyType: (currency) => set({ currencyType: currency }),
  setTransactionFilter: (filter) => set({ transactionFilter: filter }),

  fetchTargets: async (db) => {
    try {
      const userId = getUserId();
      const response = await db.showAll(userId);
      const mappedTargets = response.map((item) => ({
        id: item.id,
        value: item.current,
        color: item.color,
        text: String(item.current),
        pillName: item.name,
        target: numberToCurrency(item.amount),
      }));
      /* set({ targets: mappedTargets }); */
      return mappedTargets;
    } catch (error) {
      if (error instanceof Error && error.message.includes("Usuário não autenticado")) {
        console.log("Usuário não autenticado, redirecionando...");
      } else {
        Alert.alert("Erro", "Não foi possível carregar as metas.");
        console.log(error);
      }
      return [];
    }
  },
  fetchTargetsByCurrency: async (db,currencyType) => {
    try {
      const userId = getUserId();
      const response = await db.showAllByCurrency(currencyType, userId);

      const mappedTargets = response.map((item) => ({
        id: item.id,
        value: item.current,
        color: item.color,
        text: String(item.current),
        pillName: item.name,
        target: numberToCurrency(item.amount),
      }));
      /* set({ targets: mappedTargets }); */
      return mappedTargets;
    } catch (error) {
      if (error instanceof Error && error.message.includes("Usuário não autenticado")) {
        console.log("Usuário não autenticado, redirecionando...");
      } else {
        Alert.alert("Erro", "Não foi possível carregar as metas.");
        console.log(error);
      }
      return [];
    }
  },

  fetchTargetById: async (id, db) => {
    try {
      const userId = getUserId();
      const response = await db.show(id, userId);
      

      return {
        id: Number(response.id),
        name: response.name,
        target: numberToCurrency(response.amount),
        currency: numberToCurrency(response.current),
        color: response.color,
        end_date: response.end_date,
        percentage: Number(response.percentage.toFixed(2)),
        current: response.current,
        start_date: response.start_date,
        photo_color: response.photo_color,
        photo_blur_hash: response.photo_blur_hash,
        photo_direct_url: response.photo_direct_url,
        photo_file_name: response.photo_file_name,
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes("Usuário não autenticado")) {
        console.log("Usuário não autenticado, redirecionando...");
      } else {
        Alert.alert("Erro", "Não foi possível carregar a meta.");
        console.log(error);
      }
      return null;
    }
  },

  fetchTransactions: async (db, targets) => {
    try {
      const userId = getUserId();
      const response = await db.listAll(userId);
      const formattedTransactions = response.map((item) => {
        const target = targets.find((tg) => tg.id === item.target_id);
        return {
          id: String(item.id),
          target_id: item.target_id,
          value: numberToCurrency(item.amount),
          date: dayjs(item.created_at).format("DD/MM/YYYY [às] HH:mm"),
          description: item.observation ?? null,
          type: item.amount < 0 ? TransactionTypes.Output : TransactionTypes.Input,
          color: target?.color || colors.black,
          text: target?.text || "",
          pillName: target?.pillName ?? "",
        };
      });
      return formattedTransactions; // 👈 retorna como no fetchTargets

      /* set({ transactions: formattedTransactions }); */
    } catch (error) {
      if (error instanceof Error && error.message.includes("Usuário não autenticado")) {
        console.log("Usuário não autenticado, redirecionando...");
      } else {
        Alert.alert("Erro", "Não foi possível carregar as transações.");
        console.log(error);
      }
      return [];
    }
  },
  fetchTransactionsByTargetsAllData: async (db, targets,target_ids,currencyType) => {
    try {
      const userId = getUserId();
      const response = await db.listAllDataByTargetsId(target_ids, userId);
      const formattedTransactions = response.map((item) => {
        const target = targets.find((tg) => tg.id === item.target_id);
        return {
          id: String(item.id),
          target_id: item.target_id,
          value: numberToCurrency(item.amount,currencyType),
          date: dayjs(item.created_at).format("DD/MM/YYYY [às] HH:mm"),
          description: item.observation ?? null,
          type: item.amount < 0 ? TransactionTypes.Output : TransactionTypes.Input,
          
          color: target?.color || colors.black,
          text: target?.text || "",
          pillName: target?.pillName ?? "",

        photo: {
          fileName: item.photo_file_name,
          color: item.photo_color,
          blurHash: item.photo_blur_hash,
          directUrl: item.photo_direct_url,
        },
          
        };
      });
      return formattedTransactions; // 👈 retorna como no fetchTargets

      /* set({ transactions: formattedTransactions }); */
    } catch (error) {
      if (error instanceof Error && error.message.includes("Usuário não autenticado")) {
        console.log("Usuário não autenticado, redirecionando...");
      } else {
        Alert.alert("Erro", "Não foi possível carregar as transações.");
        console.log(error);
      }
      return [];
    }
  },
}));