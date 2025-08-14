import { create } from "zustand";
import { UnsplashPhoto } from "@/services/UnsplashService";
import { getRandomColor } from "@/utils/getRandomColor";
 
export interface TempTargetData {
  photo: UnsplashPhoto | null;
  color: string | null;
}

interface TargetStore {
  target: TempTargetData;
  setTempTarget: (target: Partial<TempTargetData>) => void; // atualizar parcialmente
  resetTempTarget: () => void; // resetar para estado inicial
}

const initialTarget: TempTargetData = {
  photo: null,
  color: null,
};

export const useTargetStore = create<TargetStore>((set) => ({
  target: initialTarget,

  setTempTarget: (newData: Partial<TempTargetData>) =>
    set((state) => ({
      target: { ...state.target, ...newData },
    })),

  resetTempTarget: () => set({ target: { color: getRandomColor(), photo: null} }),
}));