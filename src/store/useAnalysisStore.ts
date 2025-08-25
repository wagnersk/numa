import { create } from "zustand";
import { Alert } from "react-native";
import { useTargetDatabase } from "@/database/useTargetDatabase";
import { useTransactionsDatabase } from "@/database/useTransactionsDatabase";
import { numberToCurrency } from "@/utils/numberToCurrency";
import dayjs from "dayjs";
import { TransactionTypes } from "@/utils/TransactionTypes";
import { colors } from "@/theme";

// Type definitions
export type TargetProps = {
  id: number;
  value: number;
  color: string;
  text: string;
  pillName: string;
};

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

export type TransactionFilter = 'all' | 'income' | 'expense';

// Store State and Actions interface
interface AnalysisState {
  targets: TargetProps[];
  transactions: TransactionProps[];
  selectedPill: number;
  transactionFilter: TransactionFilter;
  setTargets: (targets: TargetProps[]) => void;
  setSelectedPill: (index: number) => void;
  setTransactionFilter: (filter: TransactionFilter) => void;
  fetchTargets: (db: ReturnType<typeof useTargetDatabase>) => Promise<TargetProps[]>;
  fetchTargetById: (id: string, db: ReturnType<typeof useTargetDatabase>) => Promise<any | null>;
  fetchTransactions: (db: ReturnType<typeof useTransactionsDatabase>, targets: TargetProps[]) => Promise<void>;
}

// Store implementation
export const useAnalysisStore = create<AnalysisState>((set) => ({
  // Initial state
  targets: [],
  transactions: [],
  selectedPill: 0,
  transactionFilter: 'all',
  customTabBarHeight: 0, // Initial value

  // Actions
  setTargets: (targets) => set({ targets }),
  setSelectedPill: (index) => set({ selectedPill: index }),
  setTransactionFilter: (filter) => set({ transactionFilter: filter }),

  fetchTargets: async (db) => {
    try {
      const response = await db.showAll();
      const mappedTargets = response.map((item) => ({
        id: item.id,
        value: item.current,
        color: item.color,
        text: String(item.current),
        pillName: item.name,
      }));
      set({ targets: mappedTargets });
      return mappedTargets;
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar as metas.");
      return [];
    }
  },

    fetchTargetById: async (id, db) => {
    try {
      const response = await db.show(id);

      return {
        id: Number(response.id),
        target: numberToCurrency(response.amount),
        currency: numberToCurrency(response.current),
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
      Alert.alert("Erro", "Não foi possível carregar a meta.");
      return null;
    }
  },

  fetchTransactions: async (db, targets) => {
    try {
      const response = await db.listAll();
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
      set({ transactions: formattedTransactions });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar as transações.");
    }
  },
}));