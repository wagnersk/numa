import { create } from "zustand";

export type TargetProps = {
  id: number;
  value: number;
  color: string;
  text: string;
  pillName: string;
};

interface AnalysisState {
  targets: TargetProps[];
  selectedPill: number;
  setTargets: (targets: TargetProps[]) => void;
  setSelectedPill: (index: number) => void;
  fetchTargets: () => Promise<void>;
}

import { useTargetDatabase } from "@/database/useTargetDatabase";
import { Alert } from "react-native";

export const useAnalysisStore = create<AnalysisState>((set, get) => ({
  targets: [],
  selectedPill: 0,
  setTargets: (targets) => set({ targets }),
  setSelectedPill: (index) => set({ selectedPill: index }),
  fetchTargets: async () => {
    try {
      const targetDatabase = useTargetDatabase();
      const response = await targetDatabase.showAll();
      const mappedTargets = response.map((item) => ({
        id: item.id,
        value: item.current,
        color: item.color,
        text: String(item.current),
        pillName: item.name,
      }));
      set({ targets: mappedTargets });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar as metas.");
    }
  },
}));
